document.addEventListener('DOMContentLoaded', DOMReady);

const MAX_WIDTH = 750;
const MAX_HEIGHT = 750;
const CELL_SIZE = 30;
let cxt;
let code = 0;
let startX = 0;
let startY = 0;
let snake = [];
let foods = [];
let over = false;
let opening = true;
let full = false;
const SPACE = CELL_SIZE * 9;

function DOMReady() {
    const canvas = document.getElementById('box');
    cxt = canvas.getContext('2d');
    cxt.translate(0.5, 0.5);
    openingShow();
}

function openingShow() {
    let x = SPACE;
    let y = Math.floor(MAX_HEIGHT / CELL_SIZE / 2) * CELL_SIZE;
    let timer = setInterval(() => {
        if (x < MAX_WIDTH - SPACE) {
            cxt.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            x += CELL_SIZE;
        } else {
            clearInterval(timer);
            timer = null;
            startX = SPACE;
            startY = Math.floor(MAX_HEIGHT / CELL_SIZE / 2) * CELL_SIZE;
            run();
            autoEat(startX + CELL_SIZE, startY);
        }
    }, 100);
}

function autoEat(x, y) {
    if (x >= MAX_WIDTH - SPACE) {
        over = true;
        return;
    }
    new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            drawCircle(x, y);
            foods.push({ x, y });
            resolve();
        }, 500);
    }).then(() => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            moveRight();
            autoEat(x + CELL_SIZE, y);
        }, 300);
    });
}

function startGame() {
    cxt.fillStyle = '#ffffff';
    cxt.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
    code = 0;
    over = false;
    snake = [];
    foods = [];
    startX = Math.floor(MAX_WIDTH / CELL_SIZE / 2) * CELL_SIZE;
    startY = Math.floor(MAX_HEIGHT / CELL_SIZE / 2) * CELL_SIZE;
    drawPanel();
    drawFood();
}

function run() {
    drawSnake();
    if (opening && over) {
        rollback().then(() => {
            over = false;
            startX = SPACE;
            startY = Math.floor(MAX_HEIGHT / CELL_SIZE / 2) * CELL_SIZE;
            run();
            cxt.font = '20px serif';
            let txt = 'Press Enter To Start !';
            let metrics = cxt.measureText(txt);
            cxt.fillText(txt, Math.floor((MAX_WIDTH - metrics.width) / 2), (Math.floor(MAX_HEIGHT / CELL_SIZE / 2) + 3) * CELL_SIZE, MAX_WIDTH);
            handleKeyDown();
        });
        return;
    }
    if (over) {
        clearFood();
        rollback().then(() => {
            gameOver();
        });
        return;
    }
    new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            clear();
            resolve();
        }, 200);
    }).then(() => {
        let timer = setInterval(() => {
            clearTimeout(timer);
            timer = null;
            run();
        }, 200);
    });
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
    if (!snake.length) {
        snake.push({ x: startX, y: startY });
    }
    redrawSnake();
}

function redrawSnake() {
    snake.forEach(snippet => {
        cxt.fillRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function clear() {
    snake.forEach(snippet => {
        cxt.clearRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
        cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
    });
}

function moveUp() {
    if (startY > 0 && !mbius()) {
        startY -= CELL_SIZE;
        feed();
        update();
    } else {
        over = true;
    }
    redrawSnake();
}

function moveDown() {
    if (startY < MAX_HEIGHT - CELL_SIZE && !mbius()) {
        startY += CELL_SIZE;
        feed();
        update();
    } else {
        over = true;
    }
    redrawSnake();
}

function moveLeft() {
    if (startX > 0 && !mbius()) {
        startX -= CELL_SIZE;
        feed();
        update();
    } else {
        over = true;
    }
    redrawSnake();
}

function moveRight() {
    if (startX < MAX_WIDTH - CELL_SIZE && !mbius()) {
        startX += CELL_SIZE;
        feed();
        update();
    } else {
        over = true;
    }
    redrawSnake();
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
        let tail = snake[snake.length - 1];
        switch (code) {
            case 37:
                snake.push({ x: tail.x + CELL_SIZE, y: tail.y });
                break;
            case 38:
                snake.push({ x: tail.x, y: tail.y + CELL_SIZE });
                break;
            case 39:
                snake.push({ x: tail.x - CELL_SIZE, y: tail.y });
                break;
            case 40:
                snake.push({ x: tail.x, y: tail.y - CELL_SIZE });
                break;
            default:
                snake.push({ x: tail.x - CELL_SIZE, y: tail.y });
                break;
        }
        foods.splice(i, 1);
    }
}

function update() {
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }
    switch (code) {
        case 37:
            snake[0].x -= CELL_SIZE;
            break;
        case 38:
            snake[0].y -= CELL_SIZE;
            break;
        case 39:
            snake[0].x += CELL_SIZE;
            break;
        case 40:
            snake[0].y += CELL_SIZE;
            break;
        default:
            snake[0].x += CELL_SIZE;
            break;
    }
}

function mbius() {
    let x, y;
    let head = snake[0];
    switch (code) {
        case 37:
            x = head.x - CELL_SIZE;
            y = head.y;
            break;
        case 38:
            x = head.x;
            y = head.y - CELL_SIZE;
            break;
        case 39:
            x = head.x + CELL_SIZE;
            y = head.y;
            break;
        case 40:
            x = head.x;
            y = head.y + CELL_SIZE;
            break;
    }
    return snake.some(snippet => {
        return snippet.x === x && snippet.y === y
    });
}

function drawPanel() {
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
        if (over) {
            return;
        }
        if (x === null && y === null) {
            drawFood();
            return;
        }
        let radius = Math.ceil(Math.random() * 6) + 6;
        drawCircle(x, y, radius);
        foods.push({ x, y });
        drawFood();
    }, 1500);
}

function drawCircle(x, y, radius = 9) {
    cxt.beginPath();
    let circleX = x + CELL_SIZE / 2;
    let circleY = y + CELL_SIZE / 2;
    cxt.arc(circleX, circleY, radius, 0, Math.PI * 2);
    cxt.fillStyle = '#8bc34a';
    cxt.fill();
}

function createFood() {
    if (foods.length >= MAX_WIDTH / CELL_SIZE * MAX_HEIGHT / CELL_SIZE * 0.3) {
        return [null, null];
    }
    let x, y;
    let arr = [...foods, ...snake];
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

function rollback() {
    return new Promise((resolve, reject) => {
        let timer = setInterval(() => {
            if (!snake.length) {
                clearInterval(timer);
                timer = null;
                return resolve();
            }
            let snippet = snake[0];
            cxt.clearRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
            cxt.strokeRect(snippet.x, snippet.y, CELL_SIZE, CELL_SIZE);
            snake.shift();
        }, 100);
    });
}

function gameOver() {
    cxt.font = '32px serif';
    let txt = 'Game Over ! Press Enter To Start !';
    let metrics = cxt.measureText(txt);
    cxt.fillText(txt, Math.floor((MAX_WIDTH - metrics.width) / 2), Math.floor(MAX_HEIGHT / CELL_SIZE / 2) * CELL_SIZE, MAX_WIDTH);
}

function handleKeyDown() {
    document.addEventListener('keydown', e => {
        let keyCode = e.keyCode || e.which;
        if (opening) {
            if (keyCode === 13) {
                opening = false;
                startGame();
            }
        } else if (over) {
            if (keyCode === 13) {
                startGame();
                run();
            }
        } else {
            code = keyCode;
        }
    });
}
