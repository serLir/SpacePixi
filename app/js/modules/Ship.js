"use strict";

const BaseModule = require('../BaseModule');

module.exports = class Ship extends BaseModule {
    init(options) {
        super.init(options);

        this.direction = 1;
        this.targetX = undefined;
    }

    render() {
        const x = this.el.x + this.centerX;
        let dX;

        if (x != this.targetX) {
            dX = Math.abs(this.targetX - x);
            this.el.x += this.direction * (dX < this.delta.speed ? dX : this.delta.speed);
        } else {
            this.app.ticker.remove(this.render, this);

            this.onFireCallback({
                x: this.el.x + this.centerX,
                y: this.el.y
            });
        }
    }

    start(x) {
        if (x < this.centerX) {
            this.targetX = this.centerX;
        } else if (x > this.app.renderer.width - this.centerX) {
            this.targetX = this.app.renderer.width - this.centerX;
        } else {
            this.targetX = x;
        }

        this.direction = this.targetX - (this.el.x + this.centerX) >= 0 ? 1 : -1;

        this.app.ticker.remove(this.render, this);
        this.app.ticker.add(this.render, this);
    }

    destroy() {
        this.onDestroyCallback();
    }

    onFireCallback() {}
    onDestroyCallback() {}
};
