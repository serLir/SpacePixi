"use strict";

const BaseModule = require('../BaseModule');

module.exports = class Enemy extends BaseModule {
    init(options) {
        super.init(options);

        this.el.anchor.set(0.5);

        this.app.ticker.add(this.turn, this);
        this.app.ticker.add(this.checkImpact, this);

        this.track = null;
        this.position = {};
        this.ship = this.getShip();
    }

    setPosition() {
        this.position.x = this.el.x;
        this.position.y = this.el.y;
    }

    turn() {
        if (!this.track) {
            this.track = this.sequence();
            this.setPosition();
            this.condition = this.track.next();
        }

        if (this.condition.done) {
            this.track = null;
        } else if (this.condition.value()) {
            this.setPosition();
            this.condition = this.track.next();
        }

        if (this.el.y + this.centerY >= this.app.renderer.height) {
            this.ship.destroy();
        } else {
            this.render();
        }
    }

    * sequence() {
        this.render = () => this.el.y += this.delta.speed;
        yield () => this.el.y - this.el.height >= this.position.y;
        this.render = () => this.el.x -= this.delta.speed;
        yield () => this.position.x - this.el.x >= this.el.width * 2 || this.el.x <= this.centerX;
        this.render = () => this.el.y += this.delta.speed;
        yield () => this.el.y - this.el.height >= this.position.y;
        this.render = () => this.el.x += this.delta.speed;
        yield () => this.el.x - this.position.x >= this.el.width * 2 || this.el.x >= this.app.renderer.width - this.el.width;
    }

    checkImpact() {
        if (this.ship) {
            if (this.el.y + this.centerY >= this.ship.el.y
                && this.el.y + this.centerY <= this.ship.el.y + this.ship.el.height
                && this.el.x <= this.ship.el.x + this.ship.el.width
                && this.el.x + this.centerX >= this.ship.el.x
            ) {
                this.destroy();
                this.ship.destroy();
            }
        }
    }

    startExplode() {
        this.onExplodeEnemy();
        this.onDestroyEnemy(this);

        this.app.ticker.remove(this.checkImpact, this);
        this.app.ticker.remove(this.turn, this);

        this.scale = 1;
        this.app.ticker.add(this.explode, this);

        setTimeout(this.stopExplode.bind(this), 1000);
    }

    stopExplode() {
        this.app.ticker.remove(this.explode, this);
        this.destroy();
    }

    explode() {
        this.scale -= 0.02;
        this.el.scale.set(this.scale);
        this.el.rotation += 0.1;
    }

    destroy() {
        super.destroy();

        this.app.ticker.remove(this.checkImpact, this);
        this.app.ticker.remove(this.turn, this);

        this.onDestroyEnemy(this);
    }

    onDestroyEnemy() {}
    onExplodeEnemy() {}
    getShip() {}
};