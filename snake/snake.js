document.addEventListener('DOMContentLoaded', DOMReady);

const MAX_WIDTH = 90;
const MAX_HEIGHT = 90;
const CELL_SIZE = 30;
let cxt;
let code = 0;
let startX = 0;
let startY = 0;
let snake = [];
let foods = [];
let running = false;
let over = false;

function DOMReady() {
    const canvas = document.getElementById('box');
    cxt = canvas.getContext('2d');
    handleKeyDown();
    drawPanel();
    drawFood();
    start();
}

function start() {
    drawSnake();
    if (over) {
        return;
    }
    let timer = setTimeout(() => {
        !over && clear();
        clearTimeout(timer);
        timer = null;
        run();
    }, 300);
}

function run() {
    let timer = setInterval(() => {
        clearTimeout(timer);
        timer = null;
        start();
    }, 300);
}

function drawSnake() {
    cxt.fillStyle = 'RGBA(255,120,120,1)';
    switch (code) {
        case 37:
            running = true;
            moveLeft();
            break;
        case 38:
            running = true;
            moveUp();
            break;
        case 39:
            running = true;
            moveRight();
            break;
        case 40:
            running = true;
            moveDown();
            break;
        default:
            init();
            break;
    }
}

function init() {
    startX = Math.floor(MAX_WIDTH / CELL_SIZE / 2) * CELL_SIZE;
    startY = Math.floor(MAX_HEIGHT / CELL_SIZE / 2) * CELL_SIZE;
    // cxt.fillStyle = 'RGBA(255,120,120,1)';
    cxt.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
    cxt.strokeRect(startX, startY, CELL_SIZE, CELL_SIZE);
    if (!snake.length) {
        snake.push({ x: startX, y: startY });
    }
}

function clear() {
    console.log('clear...')
    snake.forEach(snippet => {
        cxt.clearRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function moveUp() {
    if (startY > 0) {
        startY -= CELL_SIZE;
        updateLeftUp();
        snake[0].y -= CELL_SIZE;
        feed();
        console.log('moveUp');
    } else {
        console.log('boom..');
        over = true;
    }
    snake.forEach(snippet => {
        cxt.fillRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function moveDown() {
    if (startY < MAX_HEIGHT - CELL_SIZE) {
        startY += CELL_SIZE;
        updateRightDown();
        snake[snake.length - 1].y += CELL_SIZE;
        feed();
        console.log('moveDown');
    } else {
        console.log('boom..');
        over = true;
    }
    snake.forEach(snippet => {
        cxt.fillRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function moveLeft() {
    if (startX > 0) {
        startX -= CELL_SIZE;
        updateLeftUp();
        snake[0].x -= CELL_SIZE;
        feed();
        console.log('moveLeft');
    } else {
        console.log('boom...');
        over = true;
    }
    snake.forEach(snippet => {
        cxt.fillRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function moveRight() {
    if (startX < MAX_WIDTH - CELL_SIZE) {
        startX += CELL_SIZE;
        updateRightDown();
        snake[snake.length - 1].x += CELL_SIZE;
        feed();
        console.log('moveRight');
    } else {
        console.log('boom...');
        over = true;
    }
    snake.forEach(snippet => {
        cxt.fillRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function updateLeftUp() {
    for (let i = snake.length - 1; i > 0; i--) {
        let snippet = snake[i];
        snippet.x = snake[i - 1].x;
        snippet.y = snake[i - 1].y;
    }
}

function updateRightDown() {
    for (let i = 0; i < snake.length - 1; i++) {
        let snippet = snake[i];
        snippet.x = snake[i + 1].x;
        snippet.y = snake[i + 1].y;
    }
}

function feed() {
    let i = 0;
    let eat = false;
    for (; i < foods.length; i++) {
        let food = foods[i];
        if (food.x === startX && food.y === startY) {
            eat = true;
            break;
        }
    }
    if (eat) {
        switch (code) {
            case 37:
                snake = [...snake, { x: (startX + CELL_SIZE), y: startY }];
                break;
            case 38:
                snake = [...snake, { x: startX, y: (startY + CELL_SIZE) }];
                break;
            case 39:
                snake = [{ x: (startX - CELL_SIZE), y: startY }, ...snake];
                break;
            case 40:
                snake = [{ x: startX, y: (startY - CELL_SIZE) }, ...snake];
                break;
        }
        foods.splice(i, 1);
    }
}

function drawPanel() {
    cxt.translate(0.5, 0.5);
    cxt.lineWidth = 1;
    let nums = MAX_WIDTH / CELL_SIZE + 1;
    cxt.beginPath();
    drawLine('H', nums);
    drawLine('V', nums);
    cxt.stroke();
}

function drawLine(type, nums, x = 0, y = 0) {
    for (let i = 0; i < nums; i++) {
        cxt.moveTo(x, y);
        if (type === 'H') {
            cxt.lineTo(MAX_WIDTH, y);
            y += CELL_SIZE;
        } else if (type === 'V') {
            cxt.lineTo(x, MAX_HEIGHT);
            x += CELL_SIZE;
        }
    }
}

function drawFood() {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        let [x, y] = createFood();
        if (x === null && y === null) {
            return;
        }
        cxt.beginPath();
        let circleX = x + CELL_SIZE / 2;
        let circleY = y + CELL_SIZE / 2;
        let radius = Math.ceil(Math.random() * 6) + 6;
        cxt.arc(circleX, circleY, radius, 0, Math.PI * 2);
        cxt.fillStyle = '#8bc34a';
        cxt.fill();
        foods.push({ x, y });
        console.log(foods)
        drawFood();
    }, 1500)
}

function createFood() {
    let x, y;
    let arr = [...foods, ...snake];
    if (arr.length >= MAX_WIDTH / CELL_SIZE * MAX_HEIGHT / CELL_SIZE) {
        return [null, null];
    }
    while (true) {
        x = Math.floor(Math.random() * (MAX_WIDTH / CELL_SIZE - 1)) * CELL_SIZE;
        y = Math.floor(Math.random() * (MAX_HEIGHT / CELL_SIZE - 1)) * CELL_SIZE;
        if (arr.every(used => {
                return used.x !== x || used.y !== y
            })) {
            break;
        }
    }
    return [x, y];
}

function handleKeyDown() {
    document.addEventListener('keydown', e => {
        code = e.keyCode || e.which;
    });
}
