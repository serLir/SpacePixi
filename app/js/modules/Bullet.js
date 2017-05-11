"use strict";

const BaseModule = require('../BaseModule');

module.exports = class Bullet extends BaseModule {
    constructor(data = {}) {
        super(data);

        this.el = this.createBullet();
        this.init(data.options);
    }

    init(options) {
        super.init(options);

        this.app.ticker.add(this.checkImpact, this);
        this.app.ticker.add(this.render, this);
    }

    createBullet() {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x91909a);
        graphics.lineStyle(1, 0xff2f2f, 1);
        graphics.drawRect(0, 0, 2, 10);

        return graphics;
    }

    render() {
        this.el.y -= this.delta.speed;

        if (this.el.y < 0 - this.el.height) {
            this.destroy();
        }
    }

    checkImpact() {
        for (let bot of this.bots) {
            if (this.el.y <= bot.el.y + bot.centerY
                && this.el.y + this.el.height <= bot.el.y - bot.centerY
                && this.el.x >= bot.el.x - bot.centerX
                && this.el.x <= bot.el.x + bot.centerX
            ) {
                this.destroy();
                bot.startExplode();
                break;
            }
        }
    }
    
    destroy() {
        super.destroy();

        this.app.ticker.remove(this.render, this);
        this.app.ticker.remove(this.checkImpact, this);
    }
};