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
        numberPlaceholder: "Например: 16, 3+4i, sqrt(2)",
        degreePlaceholder: "Например: 4",
        precisionPlaceholder: "Например: 6",
        errors: {
            number_required: "Введите число.",
            degree_required: "Введите степень корня.",
            number_too_large: "Число слишком большое. Максимум 5000 символов.",
            degree_too_large: "Слишком большая степень корня. Максимум 1000.",
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
        numberPlaceholder: "For example: 16, 3+4i, sqrt(2)",
        degreePlaceholder: "For example: 4",
        precisionPlaceholder: "For example: 6",
        errors: {
            number_required: "Enter a number.",
            degree_required: "Enter the root degree.",
            number_too_large: "The number is too large. Maximum 5000 characters.",
            degree_too_large: "The root degree is too large. Maximum 1000.",
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
    },
    fr: {
        title: "Calculateur de racines",
        subtitle: "Racines de tout degré, nombres réels et complexes",
        number: "Nombre",
        degree: "Indice de la racine",
        precision: "Nombre de décimales",
        complex: "Afficher les racines complexes",
        analytical: "Afficher la forme analytique",
        calculate: "Calculer",
        result: "Résultat",
        footer: "La langue peut être changée sans redémarrer le programme.",
        numberPlaceholder: "Ex. : 16, 2,25 ou 3+4i",
        degreePlaceholder: "Ex. : 4",
        precisionPlaceholder: "Ex. : 6",
        errors: {
            number_required: "Veuillez saisir un nombre.",
            degree_required: "Veuillez saisir l’indice de la racine.",
            number_too_large: "Le nombre est trop grand. Maximum : 5000 caractères.",
            degree_too_large: "L’indice est trop grand. Maximum : 1000.",
            not_number: "La valeur saisie n’est pas un nombre.",
            degree_integer: "L’indice doit être un entier.",
            degree_positive: "L’indice de la racine doit être supérieur à zéro.",
            precision_required: "Le résultat n’est pas un entier. Indiquez le nombre de décimales ci-dessous.",
            precision_integer: "Le nombre de décimales doit être un entier.",
            precision_range: "Le nombre de décimales doit être compris entre 0 et 100.",
            even_negative: "Un nombre négatif avec un indice pair nécessite les racines complexes. Activez cette option.",
            calculation_error: "Le calcul n’a pas pu être effectué.",
            unsupported: "Impossible d’obtenir une racine réelle avec ces valeurs."
        }
    }
};

let language = ["ru", "en", "fr"].includes(localStorage.getItem("rootCalculatorLanguage"))
    ? localStorage.getItem("rootCalculatorLanguage") : "ru";

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
    const nextLanguage = {ru: "EN", en: "FR", fr: "RU"};
    document.getElementById("languageButton").textContent = nextLanguage[language];
    document.getElementById("languageButton").setAttribute("aria-label", `Switch language to ${nextLanguage[language]}`);
}

document.getElementById("languageButton").addEventListener("click", () => {
    language = {ru: "en", en: "fr", fr: "ru"}[language];
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
