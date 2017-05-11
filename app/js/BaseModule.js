"use strict";

module.exports = class BaseModule {
    constructor(data = {}) {
        for(let i in data) {
            if (data.hasOwnProperty(i) && i != 'options') {
                this[i] = data[i];
            }
        }

        if (this.el) {
            this.init(data.options);
        }
    }

    init(options) {
        for (let i in options) {
            if (options.hasOwnProperty(i)) {
                this.el[i] = options[i];
            }
        }

        this.centerX = this.el.width * 0.5;
        this.centerY = this.el.height * 0.5;

        this.container = this.container || this.app.stage;
        this.container.addChild(this.el);
    }

    turn() {}
    render() {}

    destroy() {
        this.el.destroy();
    }
};