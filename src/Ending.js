/**
 * @fileoverview Ending screen
 */

import { Container, Graphics, Text } from 'pixi.js';

const UI_FONT = 'DotGothic16Std-M, Arial, sans-serif';

export class Ending extends Container {
    constructor(app, score = 0, onRetry = null) {
        super();

        this.app = app;
        this.onRetry = onRetry;

        this.eventMode = 'static';

        this.titleText = null;
        this.scoreText = null;
        this.button = null;
        this.buttonText = null;

        this.init(score);

        window.addEventListener('resize', () => {
            this.layout();
        });
    }

    init(score) {
        this.titleText = new Text({
            text: 'Result',
            style: {
                fontFamily: UI_FONT,
                fontSize: 48,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 6 }
            }
        });
        this.addChild(this.titleText);

        this.scoreText = new Text({
            text: `Score: ${score}`,
            style: {
                fontFamily: UI_FONT,
                fontSize: 36,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 4 }
            }
        });
        this.addChild(this.scoreText);

        this.button = new Graphics();
        this.button.eventMode = 'static';
        this.button.cursor = 'pointer';
        this.button.on('pointerdown', () => {
            if (typeof this.onRetry === 'function') {
                this.onRetry();
            }
        });
        this.addChild(this.button);

        this.buttonText = new Text({
            text: 'RETRY',
            style: {
                fontFamily: UI_FONT,
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.buttonText);

        this.layout();
    }

    layout() {
        try {
            const centerX = this.app.screen.width / 2;
            const centerY = this.app.screen.height / 2;

            if (this.titleText) {
                try {
                    this.titleText.x = centerX - this.titleText.width / 2;
                    this.titleText.y = centerY - 160;
                } catch (e) {
                    console.warn('Title text layout error:', e);
                }
            }

            if (this.scoreText) {
                try {
                    this.scoreText.x = centerX - this.scoreText.width / 2;
                    this.scoreText.y = centerY - 90;
                } catch (e) {
                    console.warn('Score text layout error:', e);
                }
            }

            const buttonWidth = 200;
            const buttonHeight = 64;
            const buttonX = centerX - buttonWidth / 2;
            const buttonY = centerY + 10;

            if (this.button) {
                this.button.clear();
                this.button.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 12);
                this.button.fill(0x66ccff);
                this.button.stroke({ color: 0xffffff, width: 4 });
            }

            if (this.buttonText) {
                try {
                    this.buttonText.x = centerX - this.buttonText.width / 2;
                    this.buttonText.y = buttonY + (buttonHeight - this.buttonText.height) / 2;
                } catch (e) {
                    console.warn('Button text layout error:', e);
                }
            }
        } catch (e) {
            console.error('Layout error:', e);
        }
    }
}
