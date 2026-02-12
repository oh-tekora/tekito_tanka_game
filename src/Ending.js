/**
 * @fileoverview Ending screen
 */

import { Container, Graphics, Text } from 'pixi.js';

const UI_FONT = 'DotGothic16Std-M, Arial, sans-serif';

export class Ending extends Container {
    constructor(app, score = 0, onRetry = null, onTop = null) {
        super();

        this.app = app;
        this.onRetry = onRetry;
        this.onTop = onTop;

        this.eventMode = 'static';

        this.titleText = null;
        this.scoreText = null;
        this.retryButton = null;
        this.retryButtonText = null;
        this.topButton = null;
        this.topButtonText = null;

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

        // RETRYボタン
        this.retryButton = new Graphics();
        this.retryButton.eventMode = 'static';
        this.retryButton.cursor = 'pointer';
        this.retryButton.on('pointerdown', () => {
            if (typeof this.onRetry === 'function') {
                this.onRetry();
            }
        });
        this.addChild(this.retryButton);

        this.retryButtonText = new Text({
            text: 'RETRY',
            style: {
                fontFamily: UI_FONT,
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.retryButtonText);

        // TOPボタン
        this.topButton = new Graphics();
        this.topButton.eventMode = 'static';
        this.topButton.cursor = 'pointer';
        this.topButton.on('pointerdown', () => {
            if (typeof this.onTop === 'function') {
                this.onTop();
            }
        });
        this.addChild(this.topButton);

        this.topButtonText = new Text({
            text: 'TOP',
            style: {
                fontFamily: UI_FONT,
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.topButtonText);

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
            const buttonSpacing = 20;
            const totalWidth = buttonWidth * 2 + buttonSpacing;
            const startX = centerX - totalWidth / 2;
            const buttonY = centerY + 10;

            // TOPボタン（左側）
            const topButtonX = startX;

            if (this.topButton) {
                this.topButton.clear();
                this.topButton.roundRect(topButtonX, buttonY, buttonWidth, buttonHeight, 12);
                this.topButton.fill(0x666666);
                this.topButton.stroke({ color: 0xffffff, width: 4 });
            }

            if (this.topButtonText) {
                try {
                    this.topButtonText.x = topButtonX + buttonWidth / 2 - this.topButtonText.width / 2;
                    this.topButtonText.y = buttonY + (buttonHeight - this.topButtonText.height) / 2;
                } catch (e) {
                    console.warn('Top button text layout error:', e);
                }
            }

            // RETRYボタン（右側）
            const retryButtonX = startX + buttonWidth + buttonSpacing;

            if (this.retryButton) {
                this.retryButton.clear();
                this.retryButton.roundRect(retryButtonX, buttonY, buttonWidth, buttonHeight, 12);
                this.retryButton.fill(0x66ccff);
                this.retryButton.stroke({ color: 0xffffff, width: 4 });
            }

            if (this.retryButtonText) {
                try {
                    this.retryButtonText.x = retryButtonX + buttonWidth / 2 - this.retryButtonText.width / 2;
                    this.retryButtonText.y = buttonY + (buttonHeight - this.retryButtonText.height) / 2;
                } catch (e) {
                    console.warn('Retry button text layout error:', e);
                }
            }
        } catch (e) {
            console.error('Layout error:', e);
        }
    }
}
