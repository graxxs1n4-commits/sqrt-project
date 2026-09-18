<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="title">Извлечение корня</title>
    <link rel="stylesheet" href="/static/style.css">
    <script src="/static/script.js" defer></script>
</head>
<body>
<div class="container">
    <header>
        <div>
            <h1 data-i18n="title">Извлечение корня</h1>
            <p data-i18n="subtitle">Корень любой степени, действительные и комплексные корни</p>
        </div>
        <button id="languageButton" class="language-btn" type="button">EN</button>
    </header>

    <main class="card">
        <label for="number" data-i18n="number">Число</label>
        <input id="number" type="text" inputmode="decimal" placeholder="Например: 16">

        <label for="degree" data-i18n="degree">Степень корня</label>
        <input id="degree" type="text" inputmode="numeric" placeholder="Например: 4">

        <div id="precisionBox" class="hidden">
            <label for="precision" data-i18n="precision">Знаков после запятой</label>
            <input id="precision" type="number" min="0" max="100" placeholder="Например: 6">
        </div>

        <div class="options">
            <label class="check">
                <input id="complexMode" type="checkbox" checked>
                <span data-i18n="complex">Показывать комплексные корни</span>
            </label>
            <label class="check">
                <input id="analytical" type="checkbox">
                <span data-i18n="analytical">Показать аналитическую форму</span>
            </label>
        </div>

        <button id="calculate" class="calculate" type="button" data-i18n="calculate">Вычислить</button>

        <div id="message" class="message hidden"></div>

        <section id="result" class="result hidden">
            <h2 data-i18n="result">Результат</h2>
            <div id="roots"></div>
            <div id="analyticalResult" class="analytical"></div>
        </section>
    </main>

    <footer data-i18n="footer">Язык можно менять без перезапуска программы.</footer>
</div>
</body>
</html>
