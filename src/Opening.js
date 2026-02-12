/**
 * @fileoverview Opening screen
 */

import { Container, Graphics, Text } from 'pixi.js';

const UI_FONT = 'DotGothic16Std-M, Arial, sans-serif';

export class Opening extends Container {
    constructor(app, onStart = null, onInstructions = null) {
        super();

        this.app = app;
        this.onStart = onStart;
        this.onInstructions = onInstructions;

        this.eventMode = 'static';

        this.titleText = null;
        this.startButton = null;
        this.startButtonText = null;
        this.instructionsButton = null;
        this.instructionsButtonText = null;

        this.init();

        window.addEventListener('resize', () => {
            this.layout();
        });
    }

    init() {
        this.titleText = new Text({
            text: 'Valentine Catch',
            style: {
                fontFamily: UI_FONT,
                fontSize: 48,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 6 }
            }
        });
        this.addChild(this.titleText);

        // STARTボタン
        this.startButton = new Graphics();
        this.startButton.eventMode = 'static';
        this.startButton.cursor = 'pointer';
        this.startButton.on('pointerdown', () => {
            if (typeof this.onStart === 'function') {
                this.onStart();
            }
        });
        this.addChild(this.startButton);

        this.startButtonText = new Text({
            text: 'START',
            style: {
                fontFamily: UI_FONT,
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.startButtonText);

        // 操作方法ボタン
        this.instructionsButton = new Graphics();
        this.instructionsButton.eventMode = 'static';
        this.instructionsButton.cursor = 'pointer';
        this.instructionsButton.on('pointerdown', () => {
            if (typeof this.onInstructions === 'function') {
                this.onInstructions();
            }
        });
        this.addChild(this.instructionsButton);

        this.instructionsButtonText = new Text({
            text: '操作方法',
            style: {
                fontFamily: UI_FONT,
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.instructionsButtonText);

        this.layout();
    }

    layout() {
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;

        this.titleText.x = centerX - this.titleText.width / 2;
        this.titleText.y = centerY - 140;

        const buttonWidth = 200;
        const buttonHeight = 64;
        const buttonSpacing = 30;

        // STARTボタン
        const startButtonX = centerX - buttonWidth / 2;
        const startButtonY = centerY - buttonHeight / 2;

        this.startButton.clear();
        this.startButton.roundRect(startButtonX, startButtonY, buttonWidth, buttonHeight, 12);
        this.startButton.fill(0xff6b6b);
        this.startButton.stroke({ color: 0xffffff, width: 4 });

        this.startButtonText.x = centerX - this.startButtonText.width / 2;
        this.startButtonText.y = startButtonY + buttonHeight / 2 - this.startButtonText.height / 2;

        // 操作方法ボタン
        const instructionsButtonX = centerX - buttonWidth / 2;
        const instructionsButtonY = startButtonY + buttonHeight + buttonSpacing;

        this.instructionsButton.clear();
        this.instructionsButton.roundRect(instructionsButtonX, instructionsButtonY, buttonWidth, buttonHeight, 12);
        this.instructionsButton.fill(0x4ecdc4);
        this.instructionsButton.stroke({ color: 0xffffff, width: 4 });

        this.instructionsButtonText.x = centerX - this.instructionsButtonText.width / 2;
        this.instructionsButtonText.y = instructionsButtonY + buttonHeight / 2 - this.instructionsButtonText.height / 2;
    }
}
