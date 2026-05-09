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
        result: document.getElementById('result'),
        // Элементы тренажера ОГЭ
        taskCanvas: document.getElementById('taskCanvas'),
        taskText: document.getElementById('task-text'),
        userAnswer: document.getElementById('user-answer'),
        feedback: document.getElementById('feedback'),
        taskType: document.getElementById('task-type'),
        taskStreak: document.getElementById('task-streak'),
        hintBox: document.getElementById('hint-box')
    };

    // Состояние тренажера ОГЭ
    let currentTask = null;
    let streak = 0;
    let taskCounter = 1;

    // База задач в формате ОГЭ
    const taskTemplates = [
        {
            type: 'Дом',
            text: (a, b, c) => `Крыша дома имеет форму равнобедренного треугольника. Высота крыши равна ${a} м, а половина основания — ${b} м. Найдите длину стропила (гипотенузу).`,
            find: 'hypotenuse',
            visual: 'house'
        },
        {
            type: 'Лестница',
            text: (a, b, c) => `Лестницу длиной ${c} м прислонили к стене. Нижний конец лестницы находится на расстоянии ${b} м от стены. На какой высоте от земли находится верхний конец лестницы?`,
            find: 'catet_a',
            visual: 'ladder'
        },
        {
            type: 'Диагональ',
            text: (a, b, c) => `Найдите диагональ прямоугольного экрана, если его ширина равна ${b} см, а высота — ${a} см.`,
            find: 'hypotenuse',
            visual: 'rectangle'
        },
        {
            type: 'Путь',
            text: (a, b, c) => `Турист прошёл ${a} км на север, затем повернул на восток и прошёл ещё ${b} км. На каком расстоянии от начальной точки он оказался?`,
            find: 'hypotenuse',
            visual: 'path'
        },
        {
            type: 'Тень',
            text: (a, b, c) => `Высота столба равна ${a} м. Длина его тени — ${b} м. Найдите расстояние от верхушки столба до конца тени.`,
            find: 'hypotenuse',
            visual: 'pole'
        }
    ];

    // Генерация задачи ОГЭ
    function generateOGETask() {
        // Выбираем случайный тип задачи
        const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
        
        // Генерируем пифагоровы тройки или близкие к ним числа для красивых ответов
        const triples = [
            [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], 
            [9, 12, 15], [12, 16, 20], [15, 20, 25], [7, 24, 25]
        ];
        const triple = triples[Math.floor(Math.random() * triples.length)];
        let [a, b, c] = [...triple];
        
        // Иногда умножаем на коэффициент для разнообразия
        if (Math.random() > 0.5) {
            const factor = Math.floor(Math.random() * 3) + 2;
            a *= factor;
            b *= factor;
            c *= factor;
        }

        // Перемешиваем что ищем
        let taskData;
        if (template.find === 'hypotenuse') {
            taskData = {
                a: a,
                b: b,
                answer: c,
                question: template.text(a, b, c),
                type: template.type,
                visual: template.visual,
                find: 'hypotenuse'
            };
        } else if (template.find === 'catet_a') {
            // Меняем местами: дана гипотенуза и катет, найти другой катет
            taskData = {
                a: a, // это будет высота (искомое)
                b: b, // это будет расстояние от стены
                c: c, // это длина лестницы (дано в тексте)
                answer: a,
                question: template.text(a, b, c),
                type: template.type,
                visual: template.visual,
                find: 'catet'
            };
        }

        currentTask = taskData;
        
        // Обновляем UI
        elements.taskType.textContent = `${template.type} | Задача №${taskCounter}`;
        elements.taskText.textContent = taskData.question;
        elements.userAnswer.value = '';
        elements.feedback.classList.add('hidden');
        elements.hintBox.classList.add('hidden');
        
        // Рисуем визуализацию
        drawTaskVisual(taskData);
    }

    // Рисование визуализации на canvas
    function drawTaskVisual(task) {
        const canvas = elements.taskCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Очистка
        ctx.clearRect(0, 0, width, height);
        
        // Фон
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, width, height);
        
        // Масштабирование
        const maxVal = Math.max(task.a, task.b, task.c || 0);
        const scale = Math.min(width, height) / (maxVal * 1.5) * 0.8;
        
        const padding = 30;
        const baseX = padding;
        const baseY = height - padding;
        
        // Координаты треугольника
        const x1 = baseX;
        const y1 = baseY;
        const x2 = baseX + task.b * scale;
        const y2 = baseY;
        const x3 = baseX;
        const y3 = baseY - task.a * scale;
        
        // Рисуем треугольник
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        
        ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Прямой угол
        ctx.beginPath();
        ctx.moveTo(x1, y1 - 15);
        ctx.lineTo(x1 + 15, y1 - 15);
        ctx.lineTo(x1 + 15, y1);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Подписи сторон
        ctx.font = '14px Poppins, sans-serif';
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'center';
        
        // Катет a (вертикальный)
        ctx.fillText(`${task.a}`, x1 - 20, (y1 + y3) / 2);
        
        // Катет b (горизонтальный)
        ctx.fillText(`${task.b}`, (x1 + x2) / 2, y2 + 20);
        
        // Гипотенуза c
        if (task.c) {
            const midX = (x2 + x3) / 2;
            const midY = (y2 + y3) / 2;
            ctx.fillText(`?`, midX + 15, midY - 10);
        }
        
        // Рисуем дополнительные элементы в зависимости от типа
        if (task.visual === 'house') {
            // Рисуем дом
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } else if (task.visual === 'ladder') {
            // Рисуем стену
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y3 - 20);
            ctx.stroke();
            
            // Рисуем землю
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2 + 10, y1);
            ctx.stroke();
        } else if (task.visual === 'rectangle') {
            // Рисуем полный прямоугольник
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2, y3);
            ctx.lineTo(x3, y3);
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (task.visual === 'path') {
            // Стрелки пути
            drawArrow(ctx, x1, y1, x3, y3, '#10b981');
            drawArrow(ctx, x3, y3, x2, y2, '#f59e0b');
        } else if (task.visual === 'pole') {
            // Столб
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y3);
            ctx.stroke();
            
            // Земля
            ctx.strokeStyle = '#065f46';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1 - 10, y1);
            ctx.lineTo(x2 + 10, y1);
            ctx.stroke();
        }
    }

    // Функция рисования стрелки
    function drawArrow(ctx, fromX, fromY, toX, toY, color) {
        const headlen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    // Проверка ответа
    function checkAnswer() {
        if (!currentTask) return;
        
        const userAnswer = parseFloat(elements.userAnswer.value);
        
        if (isNaN(userAnswer)) {
            showFeedback(false, 'Введите число!');
            return;
        }
        
        // Проверка с небольшой погрешностью
        const isCorrect = Math.abs(userAnswer - currentTask.answer) < 0.1;
        
        if (isCorrect) {
            streak++;
            taskCounter++;
            showFeedback(true, `✅ Верно! Ответ: ${currentTask.answer}`);
            elements.taskStreak.textContent = `Серия: ${streak} 🔥`;
            
            // Автогенерация следующей задачи через 2 секунды
            setTimeout(() => {
                generateOGETask();
            }, 2000);
        } else {
            streak = 0;
            elements.taskStreak.textContent = `Серия: 0 🔥`;
            showFeedback(false, `❌ Неверно. Правильный ответ: ${currentTask.answer}`);
        }
    }

    // Показ обратной связи
    function showFeedback(isCorrect, message) {
        elements.feedback.textContent = message;
        elements.feedback.classList.remove('hidden');
        elements.feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    }

    // Показать/скрыть подсказку
    function toggleHint() {
        if (elements.hintBox) {
            elements.hintBox.classList.toggle('hidden');
        }
    }

    // Используем DocumentFragment для минимизации перерисовок
    function generateTask() {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        
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
    
    // Инициализация тренажера ОГЭ
    if (elements.taskCanvas) {
        generateOGETask();
    }
    
    // Делаем функции доступными глобально для onclick
    window.checkAnswer = checkAnswer;
    window.generateTask = generateOGETask;
    window.toggleHint = toggleHint;
})();