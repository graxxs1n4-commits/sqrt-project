const translations = {
    ru: {
        title: "Извлечение корня",
        subtitle: "Корень любой степени, действительные и комплексные числа",
        number: "Число",
        degree: "Степень корня",
        precision: "Знаков после запятой",
        complex: "Показывать комплексные корни",
        analytical: "Показать аналитическую форму",
        calculate: "Вычислить",
        result: "Результат",
        footer: "Язык можно менять без перезапуска программы.",
        numberPlaceholder: "Например: 16 или 3+4i",
        degreePlaceholder: "Например: 4",
        precisionPlaceholder: "Например: 6",
        errors: {
            number_required: "Введите число.",
            degree_required: "Введите степень корня.",
            not_number: "Введенное вами значение не является числом.",
            degree_integer: "Степень должна быть целым числом.",
            degree_positive: "Степень корня должна быть больше нуля.",
            precision_required: "Результат не является целым числом. Укажите количество знаков после запятой ниже.",
            precision_integer: "Количество знаков после запятой должно быть целым числом.",
            precision_range: "Количество знаков после запятой должно быть от 0 до 100.",
            even_negative: "Для отрицательного числа и четной степени нужны комплексные корни. Включите эту возможность.",
            calculation_error: "Не удалось выполнить вычисление.",
            unsupported: "Для этих входных данных невозможно получить действительный корень."
        }
    },
    en: {
        title: "Root Calculator",
        subtitle: "Roots of any degree, real and complex numbers",
        number: "Number",
        degree: "Root degree",
        precision: "Decimal places",
        complex: "Show complex roots",
        analytical: "Show analytical form",
        calculate: "Calculate",
        result: "Result",
        footer: "The language can be changed without restarting the program.",
        numberPlaceholder: "For example: 16 or 3+4i",
        degreePlaceholder: "For example: 4",
        precisionPlaceholder: "For example: 6",
        errors: {
            number_required: "Enter a number.",
            degree_required: "Enter the root degree.",
            not_number: "The value you entered is not a number.",
            degree_integer: "The degree must be an integer.",
            degree_positive: "The root degree must be greater than zero.",
            precision_required: "The result is not an integer. Enter the number of decimal places below.",
            precision_integer: "The number of decimal places must be an integer.",
            precision_range: "The number of decimal places must be between 0 and 100.",
            even_negative: "A negative number with an even degree requires complex roots. Enable this option.",
            calculation_error: "The calculation could not be completed.",
            unsupported: "A real root cannot be obtained for these inputs."
        }
    }
};

let language = localStorage.getItem("rootCalculatorLanguage") || "ru";

function applyLanguage() {
    const t = translations[language];
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
    });

    document.getElementById("number").placeholder = t.numberPlaceholder;
    document.getElementById("degree").placeholder = t.degreePlaceholder;
    document.getElementById("precision").placeholder = t.precisionPlaceholder;
    document.getElementById("languageButton").textContent = language === "ru" ? "EN" : "RU";
}

document.getElementById("languageButton").addEventListener("click", () => {
    language = language === "ru" ? "en" : "ru";
    localStorage.setItem("rootCalculatorLanguage", language);
    applyLanguage();
    showMessage("");
});

function showMessage(key) {
    const box = document.getElementById("message");
    if (!key) {
        box.classList.add("hidden");
        return;
    }
    box.textContent = translations[language].errors[key] || translations[language].errors.calculation_error;
    box.classList.remove("hidden");
}

function showResult(data) {
    const result = document.getElementById("result");
    const roots = document.getElementById("roots");
    const analytical = document.getElementById("analyticalResult");

    roots.innerHTML = "";
    data.roots.forEach((root, index) => {
        const div = document.createElement("div");
        div.className = "root-item";
        div.textContent = data.roots.length > 1
            ? `x${index + 1} = ${root}`
            : `x = ${root}`;
        roots.appendChild(div);
    });

    analytical.textContent = data.analytical || "";
    result.classList.remove("hidden");
}

function showPrecisionBox(show) {
    const box = document.getElementById("precisionBox");
    const input = document.getElementById("precision");
    if (show) {
        box.classList.remove("hidden");
    } else {
        box.classList.add("hidden");
        input.value = "";
    }
}

function looksComplex(value) {
    return /i/i.test(value);
}

// При вводе комплексного числа — сразу показываем поле точности
// При изменении числа или степени — прячем поле точности
document.getElementById("number").addEventListener("input", () => {
    const value = document.getElementById("number").value;
    if (looksComplex(value)) {
        showPrecisionBox(true);
        const p = document.getElementById("precision");
        if (!p.value) p.value = "6";
    } else {
        showPrecisionBox(false);
    }
    showMessage("");
});

document.getElementById("degree").addEventListener("input", () => {
    showPrecisionBox(false);
    showMessage("");
});

document.getElementById("calculate").addEventListener("click", async () => {
    const button = document.getElementById("calculate");
    const result = document.getElementById("result");

    showMessage("");
    result.classList.add("hidden");
    button.disabled = true;

    const precisionBoxVisible = !document.getElementById("precisionBox").classList.contains("hidden");

    const payload = {
        number: document.getElementById("number").value,
        degree: document.getElementById("degree").value,
        precision: precisionBoxVisible ? document.getElementById("precision").value : "",
        complex_mode: document.getElementById("complexMode").checked,
        analytical: document.getElementById("analytical").checked
    };

    try {
        const response = await fetch("/calculate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!data.ok) {
            if (data.error === "precision_required") {
                showPrecisionBox(true);
                const precisionInput = document.getElementById("precision");
                precisionInput.focus();
                precisionInput.scrollIntoView({behavior: "smooth", block: "center"});
            }
            showMessage(data.error);
        } else {
            if (data.type === "real" || data.type === "zero") {
                const allInteger = data.roots.every(r => !/[.,]/.test(r));
                if (allInteger) showPrecisionBox(false);
            }
            showResult(data);
        }
    } catch (error) {
        showMessage("calculation_error");
    } finally {
        button.disabled = false;
    }
});

applyLanguage();
