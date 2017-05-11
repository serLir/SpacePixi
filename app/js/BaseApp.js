"use strict";

const pixi = require('pixi.js');

const BaseModule = require('./BaseModule');
const Bot = require('./modules/Bot');
const Ship = require('./modules/Ship');
const Bullet = require('./modules/Bullet');
const Footer = require('./modules/Footer');

module.exports = class BaseApp {
    constructor(data = {}) {
        this.textures = {};
        this.bots = new Set();
        this.bullets = new Set();
        this.ship = null;
        this.footer = null;

        this.botsSettings = {
            limit: 2,
            speed: 1,
            score: 0
        };

        this.app = data.app || new pixi.Application({
                width: document.body.clientWidth,
                height: document.body.clientHeight + document.body.scrollHeight
            });
        this.footerHeight = data.footerHeight || 100;

        this.init();
    }

    init() {
        pixi.loader.add(['./images/Bot.png', './images/Ship.png']).load(this.onAssetsLoaded.bind(this));
        document.body.appendChild(this.app.view);
    }

    onAssetsLoaded(loader, res) {
        this.textures.bot = new pixi.Texture(res['./images/Bot.png'].texture);
        this.textures.ship = new pixi.Texture(res['./images/Ship.png'].texture);

        this.addShip();
        this.addActionField();
        this.addFooter();
        this.supportEnemy();
    }

    getNewPosition() {
        return Math.floor(Math.random() * (this.app.renderer.width - 1 + 1)) + 1;
    }

    addEnemy() {
        this.bots.add(new Bot({
            app: this.app,
            el: new pixi.Sprite(this.textures.bot),
            options: { x: this.getNewPosition() },
            delta: { speed: this.botsSettings.speed },
            getShip: this.getShip.bind(this),
            onDestroyEnemy: this.removeEnemy.bind(this),
            onExplodeEnemy: this.setScore.bind(this),
            onDestroyCallback: this.gameOver.bind(this)
        }));
    }

    getShip() {
        return this.ship;
    }

    removeEnemy(bot) {
        this.bots.delete(bot);
    }

    addShip() {
        this.ship = new Ship({
            app: this.app,
            el: new pixi.Sprite(this.textures.ship),
            options: { x: this.app.renderer.width * 0.5, y: this.app.renderer.height - (this.footerHeight + 120) },
            delta: { speed: 10 },
            onFireCallback: this.addBullet.bind(this),
            onDestroyCallback: this.gameOver.bind(this)
        });
    }

    addFooter() {
        this.footer = new Footer({
            app: this.app,
            options: {
                y: this.app.renderer.height - this.footerHeight,
                width: this.app.renderer.width,
                height: this.footerHeight,
                interactive: true
            }
        });
    }

    addActionField() {
        new BaseModule({
            app: this.app,
            el: new pixi.Sprite(''),
            options: {
                width: this.app.renderer.width,
                height: this.app.renderer.height - this.footerHeight,
                interactive: true,
                buttonMode: true,
                click: (param) => this.ship.start(param.data.global.x),
                tap: (param) => this.ship.start(param.data.global.x)
            }
        });
    }

    addBullet(point) {
        this.bullets.add(new Bullet({
            app: this.app,
            options: point,
            delta: { speed: 30 },
            bots: this.bots
        }));
    }

    supportEnemy() {
        if (this.botsSettings.score > 10) {
            this.botsSettings.limit = 3;
        }
        if (this.botsSettings.score > 50) {
            this.botsSettings.limit = 2;
            this.botsSettings.speed = 2;
        }
        if (this.botsSettings.score > 100) {
            this.botsSettings.limit = 3;
            this.botsSettings.speed = 2;
        }
        if (this.botsSettings.score > 150) {
            this.botsSettings.limit = 4;
            this.botsSettings.speed = 2;
        }
        if (this.botsSettings.score > 200) {
            this.botsSettings.limit = 3;
            this.botsSettings.speed = 3;
        }
        if (this.botsSettings.score > 250) {
            this.botsSettings.limit = 4;
            this.botsSettings.speed = 3;
        }
        if (this.botsSettings.score > 300) {
            this.botsSettings.limit = 5;
            this.botsSettings.speed = 4;
        }

        if (this.bots && this.bots.size < this.botsSettings.limit) {
            this.addEnemy();
        }

        setTimeout(() => {
            this.supportEnemy();
        }, 1000);
    }

    setScore() {
        this.footer.changeScore(++this.botsSettings.score);
    }

    gameOver() {
        this.footer.showGameOverText();
    }
};