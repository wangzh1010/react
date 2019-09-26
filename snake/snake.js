document.addEventListener('DOMContentLoaded', DOMReady);

const MAX_WIDTH = 270;
const MAX_HEIGHT = 270;
const CELL_SIZE = 30;
let cxt;
let code = 0;
let startX = Math.floor(MAX_WIDTH / CELL_SIZE / 2) * CELL_SIZE;
let startY = Math.floor(MAX_HEIGHT / CELL_SIZE / 2) * CELL_SIZE;
let snake = [];
let foods = [];
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
        clear();
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
            moveLeft();
            break;
        case 38:
            moveUp();
            break;
        case 39:
            moveRight();
            break;
        case 40:
            moveDown();
            break;
        default:
            init();
            break;
    }
}

function init() {
    cxt.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
    cxt.strokeRect(startX, startY, CELL_SIZE, CELL_SIZE);
    if (!snake.length) {
        snake.push({ x: startX, y: startY });
    }
}

function clear() {
    snake.forEach(snippet => {
        cxt.clearRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function moveUp() {
    if (startY > 0) {
        startY -= CELL_SIZE;
        update();
        feed();
    } else {
        over = true;
    }
    redrawSnake();
}

function moveDown() {
    if (startY < MAX_HEIGHT - CELL_SIZE) {
        startY += CELL_SIZE;
        update();
        feed();
    } else {
        over = true;
    }
    redrawSnake();
}

function moveLeft() {
    if (startX > 0) {
        startX -= CELL_SIZE;
        update();
        feed();
    } else {
        over = true;
    }
    console.log(JSON.stringify(snake))
    redrawSnake();
}

function moveRight() {
    if (startX < MAX_WIDTH - CELL_SIZE) {
        startX += CELL_SIZE;
        update();
        feed();
    } else {
        over = true;
    }
    redrawSnake();
}

function update() {
    for (let i = 0; i < snake.length - 1; i++) {
        let snippet = snake[i];
        snippet.x = snake[i + 1].x;
        snippet.y = snake[i + 1].y;
    }
    switch (code) {
        case 37:
            snake[snake.length - 1].x -= CELL_SIZE;
            break;
        case 38:
            snake[snake.length - 1].y -= CELL_SIZE;
            break;
        case 39:
            snake[snake.length - 1].x += CELL_SIZE;
            break;
        case 40:
            snake[snake.length - 1].y += CELL_SIZE;
            break;
    }
}

function redrawSnake(){
    clear();
    snake.forEach(snippet => {
        cxt.fillRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
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
        if (over || (x === null && y === null)) {
            clearFood();
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
        drawFood();
    }, 1500)
}

function createFood() {
    let x, y;
    let arr = [...foods, ...snake];
    if (arr.length >= MAX_WIDTH / CELL_SIZE * MAX_HEIGHT / CELL_SIZE * 0.3) {
        return [null, null];
    }
    while (true) {
        let empty = true;
        x = Math.floor(Math.random() * (MAX_WIDTH / CELL_SIZE)) * CELL_SIZE;
        y = Math.floor(Math.random() * (MAX_HEIGHT / CELL_SIZE)) * CELL_SIZE;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].x === x && arr[i].y === y) {
                empty = false;
                break;
            }
        }
        if (empty) {
            break;
        }
    }    
    return [x, y];
}

function clearFood() {
    foods.forEach(food => {
        cxt.clearRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
    });
}

function handleKeyDown() {
    document.addEventListener('keydown', e => {
        code = e.keyCode || e.which;
    });
}
