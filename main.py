from decimal import Decimal, InvalidOperation, getcontext
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import cmath
import math

app = FastAPI(title="Root Calculator")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


def decimal_root(value: Decimal, degree: int, precision: int) -> Decimal:
    """Newton's method for a real root with arbitrary Decimal precision."""
    getcontext().prec = precision + 15

    if value == 0:
        return Decimal(0)

    negative = value < 0
    if negative:
        value = -value

    try:
        guess = Decimal(str(float(value) ** (1.0 / degree)))
    except (OverflowError, ValueError):
        guess = Decimal(1)

    if guess == 0:
        guess = Decimal(1)

    for _ in range(precision * 4 + 30):
        previous = guess
        guess = ((degree - 1) * guess + value / (guess ** (degree - 1))) / degree
        if abs(guess - previous) < Decimal(10) ** (-(precision + 5)):
            break

    return -guess if negative else guess


def format_decimal(value: Decimal, precision: int | None = None) -> str:
    if value == value.to_integral_value():
        return str(value.quantize(Decimal(1)))
    if precision is None:
        raise ValueError("precision_required")
    return f"{value:.{precision}f}"


def all_complex_roots(value: float, degree: int):
    r = abs(value) ** (1.0 / degree)
    theta = math.atan2(0.0, value) if value >= 0 else math.pi
    roots = []
    for k in range(degree):
        angle = (theta + 2 * math.pi * k) / degree
        roots.append(complex(r * math.cos(angle), r * math.sin(angle)))
    return roots


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
)


@app.post("/calculate")
async def calculate(data: dict):
    number_text = str(data.get("number", "")).strip()
    degree_text = str(data.get("degree", "")).strip()
    precision_text = str(data.get("precision", "")).strip()
    complex_mode = bool(data.get("complex_mode", True))
    analytical = bool(data.get("analytical", False))

    if not number_text:
        return {"ok": False, "error": "number_required"}
    if not degree_text:
        return {"ok": False, "error": "degree_required"}

    try:
        number = Decimal(number_text)
    except InvalidOperation:
        return {"ok": False, "error": "not_number"}

    try:
        degree = int(degree_text)
    except ValueError:
        return {"ok": False, "error": "degree_integer"}

    if degree <= 0:
        return {"ok": False, "error": "degree_positive"}

    if number == 0:
        return {
            "ok": True,
            "type": "zero",
            "roots": ["0"],
            "analytical": "x = 0" if analytical else None,
        }

    if number < 0 and degree % 2 == 0:
        if not complex_mode:
            return {"ok": False, "error": "even_negative"}

        roots = all_complex_roots(float(number), degree)
        precision = None

        if precision_text:
            try:
                precision = int(precision_text)
                if precision < 0 or precision > 100:
                    return {"ok": False, "error": "precision_range"}
            except ValueError:
                return {"ok": False, "error": "precision_integer"}
        else:
            precision = 6

        formatted = []
        for z in roots:
            re = 0.0 if abs(z.real) < 10 ** (-(precision + 1)) else z.real
            im = 0.0 if abs(z.imag) < 10 ** (-(precision + 1)) else z.imag
            if abs(im) < 10 ** (-(precision + 1)):
                formatted.append(f"{re:.{precision}f}".rstrip("0").rstrip("."))
            elif abs(re) < 10 ** (-(precision + 1)):
                formatted.append(f"{im:.{precision}f}i")
            else:
                sign = "+" if im >= 0 else "-"
                formatted.append(
                    f"{re:.{precision}f} {sign} {abs(im):.{precision}f}i"
                )

        return {
            "ok": True,
            "type": "complex",
            "roots": formatted,
            "analytical": f"x^({degree}) = {number_text}" if analytical else None,
        }

    try:
        precision = None
        if number > 0:
            getcontext().prec = 120
            root = decimal_root(number, degree, 100)
            is_integer = root == root.to_integral_value()

            if is_integer:
                root_text = format_decimal(root)
                roots = [f"+{root_text}", f"-{root_text}"] if degree % 2 == 0 else [root_text]
            else:
                if not precision_text:
                    return {"ok": False, "error": "precision_required"}
                try:
                    precision = int(precision_text)
                except ValueError:
                    return {"ok": False, "error": "precision_integer"}
                if precision < 0 or precision > 100:
                    return {"ok": False, "error": "precision_range"}

                getcontext().prec = precision + 15
                root = decimal_root(number, degree, precision)
                root_text = format_decimal(root, precision)
                roots = [f"+{root_text}", f"-{root_text}"] if degree % 2 == 0 else [root_text]
        else:
            if number < 0 and degree % 2 == 1:
                if not precision_text:
                    getcontext().prec = 120
                    root = decimal_root(number, degree, 100)
                    if root == root.to_integral_value():
                        roots = [format_decimal(root)]
                    else:
                        return {"ok": False, "error": "precision_required"}
                else:
                    try:
                        precision = int(precision_text)
                    except ValueError:
                        return {"ok": False, "error": "precision_integer"}
                    if precision < 0 or precision > 100:
                        return {"ok": False, "error": "precision_range"}
                    root = decimal_root(number, degree, precision)
                    roots = [format_decimal(root, precision)]
            else:
                return {"ok": False, "error": "unsupported"}

    except (OverflowError, InvalidOperation, ZeroDivisionError):
        return {"ok": False, "error": "calculation_error"}

    return {
        "ok": True,
        "type": "real",
        "roots": roots,
        "analytical": f"x^{degree} = {number_text}" if analytical else None,
    }
