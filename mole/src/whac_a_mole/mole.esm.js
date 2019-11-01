export default class Moles {
    /**
     * constructor
     * @param {Number} cellSize
     * @param {Number} panelSize
     */
    constructor(cellSize, panelSize) {
        this.score = 0;
        this.level = 2;
        this.maxScore = 20;
        this.minScore = 10;
        this.maxWidth = 50;
        this.minWidth = 30;
        this.offsetTop = 5;
        this.cellSize = cellSize;
        this.panelSize = panelSize;
        this.moles = [];
        this.gameOver = true;
        this.wrapper = document.createElement('div');
        this.holes = Math.floor(this.panelSize / this.cellSize);
        this.initMoles();
    }
    init() {
        if (!this.gameOver) {
            return;
        }
        this.gameOver = false;
        this.score = 0;
        this.level = 2;
        window.requestAnimationFrame(this.start.bind(this));
    }
    start() {
        let mole;
        let arr = this.moles.filter(mole => mole.active === false);
        if (!arr.length) {
            window.requestAnimationFrame(this.start.bind(this));
            return;
        }
        while (!mole) {
            let index = Math.floor(Math.random() * this.holes * this.holes);
            if (!this.moles[index].active) {
                mole = this.moles[index];
            }
        }
        this.next(mole);
        setTimeout(() => {
            if (!this.gameOver) {
                window.requestAnimationFrame(this.start.bind(this));
            }
        }, this.level * 300);
    }
    next(mole) {
        mole.active = true;
        mole.el.classList.remove('inactive');
        mole.el.classList.add('active');
        new Promise(resolve => {
            setTimeout(() => {
                mole.el.classList.remove('active');
                resolve();
            }, 1500);
        }).then(() => {
            setTimeout(() => {
                mole.active = false;
                let { width, score, weight } = this.getParams();
                mole.score = score;
                let adjust = (width - mole.el.offsetWidth) / 2;
                mole.el.style.width = width + 'px';
                mole.el.style.left = (mole.el.offsetLeft - adjust) + 'px';
                mole.el.classList.remove();
                mole.el.setAttribute('class', 'mole ' + weight);
            }, 500);
        });
    }
    knock(x, y) {
        for (let i = 0; i < this.moles.length; i++) {
            let mole = this.moles[i];
            if (!mole.domRect) {
                mole.domRect = mole.el.getBoundingClientRect();
            }
            let { top, bottom, left, right } = mole.domRect;
            if (x > left && x < right && y > top && y < bottom && mole.active && mole.score > 0) {
                mole.el.classList.add('inactive');
                this.score += mole.score;
                mole.score = 0;
                if (this.score > 150) {
                    this.level = 1;
                }
                break;
            }
        }
    }
    over() {
        this.gameOver = true;
        this.moles.forEach(mole => {
            mole.active = false;
            mole.el.classList.remove('active');
        });
    }
    initMoles() {
        for (let i = 0; i < this.holes; i++) {
            for (let j = 0; j < this.holes; j++) {
                let { width, score, weight } = this.getParams();
                let x = i * this.cellSize + (this.cellSize - width) / 2;
                let y = j * this.cellSize + this.offsetTop;
                let attr = 'm1e' + (x * 10 + y * 10).toString(36);
                let el = document.createElement('div');
                el.setAttribute('class', 'mole ' + weight);
                el.setAttribute(attr, '');
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.width = width + 'px';
                let mole = document.createElement('span');
                el.appendChild(mole);
                this.wrapper.appendChild(el);
                this.moles.push({ el, x, y, score, active: false });
            }
        }
    }
    getParams() {
        let width = Math.ceil(Math.random() * (this.maxWidth - this.minWidth) + this.minWidth);
        width = width % 2 === 0 ? width : width + 1;
        let score = this.maxScore - (this.maxWidth - width) / 2;
        let weight = '';
        if (score === this.maxScore || score === this.minScore) {
            weight = 'golden';
        } else if (score <= this.minScore + 3) {
            weight = 'thin'
        } else if (score <= this.minScore + 6) {
            weight = 'normal'
        } else {
            weight = 'fat'
        }
        return { width, score, weight };
    }
    getStage() {
        return this.wrapper;
    }
    getScore() {
        return this.score;
    }
}
