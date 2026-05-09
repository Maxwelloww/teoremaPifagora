// Оптимизированный JavaScript с кэшированием DOM элементов
(function() {
    'use strict';

    // Кэшируем ссылки на DOM элементы при загрузке
    const elements = {
        generateBtn: document.getElementById('generateBtn'),
        calculateBtn: document.getElementById('calculateBtn'),
        task: document.getElementById('task'),
        catetA: document.getElementById('catetA'),
        catetB: document.getElementById('catetB'),
        result: document.getElementById('result')
    };

    // Используем DocumentFragment для минимизации перерисовок
    function generateTask() {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        
        const fragment = document.createDocumentFragment();
        const textNode = document.createTextNode(`Найдите гипотенузу треугольника, где катеты равны ${a} и ${b}.`);
        fragment.appendChild(textNode);
        
        elements.task.textContent = `Найдите гипотенузу треугольника, где катеты равны ${a} и ${b}.`;
        elements.task.dataset.a = a;
        elements.task.dataset.b = b;
    }

    function calculateHypotenuse() {
        const a = parseFloat(elements.catetA.value);
        const b = parseFloat(elements.catetB.value);

        if (isNaN(a) || isNaN(b)) {
            elements.result.textContent = 'Пожалуйста, введите оба катета.';
        } else {
            const hypotenuse = Math.hypot(a, b).toFixed(2);
            elements.result.textContent = `Гипотенуза равна: ${hypotenuse}`;
        }
    }

    // Добавляем обработчики событий
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', generateTask);
    }
    if (elements.calculateBtn) {
        elements.calculateBtn.addEventListener('click', calculateHypotenuse);
    }
})();