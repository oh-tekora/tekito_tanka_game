/**
 * @fileoverview Opening screen
 */

import { Container, Graphics, Text } from 'pixi.js';

export class Opening extends Container {
    constructor(app, onStart = null) {
        super();

        this.app = app;
        this.onStart = onStart;

        this.eventMode = 'static';

        this.titleText = null;
        this.button = null;
        this.buttonText = null;

        this.init();

        window.addEventListener('resize', () => {
            this.layout();
        });
    }

    init() {
        this.titleText = new Text({
            text: 'Valentine Catch',
            style: {
                fontFamily: 'Arial',
                fontSize: 48,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 6 }
            }
        });
        this.addChild(this.titleText);

        this.button = new Graphics();
        this.button.eventMode = 'static';
        this.button.cursor = 'pointer';
        this.button.on('pointerdown', () => {
            if (typeof this.onStart === 'function') {
                this.onStart();
            }
        });
        this.addChild(this.button);

        this.buttonText = new Text({
            text: 'START',
            style: {
                fontFamily: 'Arial',
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.buttonText);

        this.layout();
    }

    layout() {
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;

        this.titleText.x = centerX - this.titleText.width / 2;
        this.titleText.y = centerY - 140;

        const buttonWidth = 200;
        const buttonHeight = 64;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY - buttonHeight / 2;

        this.button.clear();
        this.button.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 12);
        this.button.fill(0xff6b6b);
        this.button.stroke({ color: 0xffffff, width: 4 });

        this.buttonText.x = centerX - this.buttonText.width / 2;
        this.buttonText.y = centerY - this.buttonText.height / 2;
    }
}
