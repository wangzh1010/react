import '../../scss/whac_a_mole.scss'
import Moles from './mole.esm'
import Stage from './stage.esm'

const CELL_SIZE = 100;
const PANEL_SIZE = 400;
let playtime = 30;
const panel = document.querySelector('.panel');
const { top, bottom, left, right } = panel.getBoundingClientRect();
const startBtn = document.getElementById('start');
let counter = document.getElementById('counter');
counter.textContent = playtime;
let score = document.getElementById('score');
score.textContent = 0;
let hammer = document.querySelector('.hammer');

let stage = new Stage(CELL_SIZE, PANEL_SIZE);
let moles = new Moles(CELL_SIZE, PANEL_SIZE);
panel.appendChild(stage.getStage());
panel.appendChild(moles.getStage());

panel.addEventListener('mousemove', (e) => {
    if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
        return;
    }
    hammer.style.top = (e.clientY - 60) + 'px';
    hammer.style.left = (e.clientX - 64) + 'px';
});

panel.addEventListener('mousedown', (e) => {
    hammer.classList.add('ding');
    moles.knock(e.clientX, e.clientY);
    score.textContent = moles.getScore();
});

panel.addEventListener('touchstart', (e) => {
    if (!hammer.classList.contains('ding')) {
        hammer.style.top = (e.touches[0].clientY - 60) + 'px';
        hammer.style.left = (e.touches[0].clientX - 64) + 'px';
        hammer.classList.add('ding');
    }
    moles.knock(e.touches[0].clientX, e.touches[0].clientY);
    score.textContent = moles.getScore();
});

hammer.addEventListener('animationend', () => {
    hammer.classList.remove('ding');
})

startBtn.addEventListener('click', () => {
    startBtn.setAttribute('disabled', '')
    moles.init();
    let timer = setInterval(() => {
        playtime--;
        if (playtime < 0) {
            clearInterval(timer)
            timer = null;
            playtime = 30;
            moles.over();
            startBtn.removeAttribute('disabled');
            return;
        }
        counter.textContent = playtime;
    }, 1000);
});
