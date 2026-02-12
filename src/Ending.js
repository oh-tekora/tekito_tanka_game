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
        this.rankText = null;
        this.rankDescText = null;
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

        const resultMessage = this.getResultMessage(score);
        this.rankText = new Text({
            text: resultMessage.rank,
            style: {
                fontFamily: UI_FONT,
                fontSize: 42,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 5 }
            }
        });
        this.addChild(this.rankText);

        this.rankDescText = new Text({
            text: resultMessage.description,
            style: {
                fontFamily: UI_FONT,
                fontSize: 24,
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 3 },
                wordWrap: true,
                wordWrapWidth: 520,
                lineHeight: 30
            }
        });
        this.addChild(this.rankDescText);

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

    getResultMessage(score) {
        if (score < 40) {
            return {
                rank: '絶滅危惧種級',
                description: 'そんなんじゃ氷河期を乗り切れないぜ。もっと牙を磨こう。'
            };
        }
        if (score < 80) {
            return {
                rank: '化石級',
                description: 'まあまあかな。将来恐竜博物館あたりでいい見せ物にはなれるんじゃないか？'
            };
        }
        return {
            rank: 'ダイナソー級',
            description: '見たか？俺くらいになると、ジュラ紀から令和までずっとモテモテだぜ。'
        };
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

            if (this.rankText && this.rankDescText) {
                try {
                    const rankY = centerY - 20;
                    this.rankText.x = centerX - this.rankText.width / 2;
                    this.rankText.y = rankY;

                    const descY = rankY + this.rankText.height + 10;
                    this.rankDescText.x = centerX - this.rankDescText.width / 2;
                    this.rankDescText.y = descY;
                } catch (e) {
                    console.warn('Rank text layout error:', e);
                }
            }

            const buttonWidth = 200;
            const buttonHeight = 64;
            const buttonSpacing = 20;
            const totalWidth = buttonWidth * 2 + buttonSpacing;
            const startX = centerX - totalWidth / 2;
            const buttonY = this.rankDescText
                ? this.rankDescText.y + this.rankDescText.height + 30
                : centerY + 10;

            // TOPボタン（左側）
            const topButtonX = startX;

            if (this.topButton) {
                this.topButton.clear();
                
                // ドット絵風のボタン
                this.topButton.rect(topButtonX, buttonY, buttonWidth, buttonHeight);
                this.topButton.fill(0x666666);
                this.topButton.stroke({ color: 0xffffff, width: 6 });
                
                // 内側の影
                this.topButton.rect(topButtonX + 4, buttonY + 4, buttonWidth - 8, buttonHeight - 8);
                this.topButton.stroke({ color: 0x4d4d4d, width: 2 });
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
                
                // ドット絵風のボタン
                this.retryButton.rect(retryButtonX, buttonY, buttonWidth, buttonHeight);
                this.retryButton.fill(0x66ccff);
                this.retryButton.stroke({ color: 0xffffff, width: 6 });
                
                // 内側の影
                this.retryButton.rect(retryButtonX + 4, buttonY + 4, buttonWidth - 8, buttonHeight - 8);
                this.retryButton.stroke({ color: 0x52a3cc, width: 2 });
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
