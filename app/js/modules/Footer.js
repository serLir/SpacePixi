"use strict";

const pixi = require('pixi.js');

const BaseModule = require('../BaseModule');

module.exports = class Footer extends BaseModule {
    constructor(data = {}) {
        super(data);

        this.textStyle = {
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#8e2200'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        };

        this.el = this.createGraphics();
        this.addText();
        this.init(data.options);
    }

    createGraphics() {
        let graphics = new PIXI.Graphics();
        graphics.drawRect(0, 0, this.app.renderer.width, 100);

        graphics.lineStyle(2, 0xff2f2f, 1);
        graphics.beginFill(0xf7d4d2, 0.25);
        graphics.drawRoundedRect(this.app.renderer.width - 140, 25, 140, 50, 15);
        graphics.endFill();

        return graphics;
    }

    addText() {
        this.scoreText = new PIXI.Text('Score: 0', new PIXI.TextStyle(this.textStyle));
        this.scoreText.x = this.app.renderer.width - 130;
        this.scoreText.y = 32;

        this.el.addChild(this.scoreText);
    }

    changeScore(score) {
        this.scoreText.text = 'Score: ' + score;
    }

    showGameOverText() {
        this.endGameText = new PIXI.Text('Game Over', Object.assign(this.textStyle, {
            fontSize: 36,
            fill: ['#ffffff', '#e8d100']
        }));

        this.endGameText.x = this.app.renderer.width * 0.5 - 100;
        this.endGameText.y = 32;

        this.el.addChild(this.endGameText);
        this.app.stop();
    }
};