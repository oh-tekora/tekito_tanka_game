/**
 * @fileoverview Opening screen
 */

import { Container, Graphics, Text, Sprite, Texture } from 'pixi.js';

const UI_FONT = 'DotGothic16Std-M, Arial, sans-serif';

export class Opening extends Container {
    constructor(app, onStart = null, onInstructions = null) {
        super();

        this.app = app;
        this.onStart = onStart;
        this.onInstructions = onInstructions;

        this.eventMode = 'static';

        this.titleLogo = null;
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
        // タイトルロゴを読み込んで表示
        const titleTexture = Texture.from('/assets/title_rogo.png');
        this.titleLogo = new Sprite(titleTexture);
        this.titleLogo.anchor.set(0.5);
        this.addChild(this.titleLogo);

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
        try {
            const centerX = this.app.screen.width / 2;
            const centerY = this.app.screen.height / 2;

            if (this.titleLogo) {
                try {
                    this.titleLogo.x = centerX;
                    this.titleLogo.y = centerY - 140;
                } catch (e) {
                    console.warn('Title text layout error:', e);
                }
            }

            const buttonWidth = 200;
            const buttonHeight = 64;
            const buttonSpacing = 30;

            // STARTボタン
            const startButtonX = centerX - buttonWidth / 2;
            const startButtonY = centerY - buttonHeight / 2;

            if (this.startButton) {
                this.startButton.clear();
                
                // ドット絵風のボタン（四角形、太いボーダー）
                // 外側の明るいボーダー
                this.startButton.rect(startButtonX, startButtonY, buttonWidth, buttonHeight);
                this.startButton.fill(0xff6b6b);
                this.startButton.stroke({ color: 0xffffff, width: 6 });
                
                // 内側の影（ドット絵風の立体感）
                this.startButton.rect(startButtonX + 4, startButtonY + 4, buttonWidth - 8, buttonHeight - 8);
                this.startButton.stroke({ color: 0xcc5555, width: 2 });
            }

            if (this.startButtonText) {
                try {
                    this.startButtonText.x = centerX - this.startButtonText.width / 2;
                    this.startButtonText.y = startButtonY + buttonHeight / 2 - this.startButtonText.height / 2;
                } catch (e) {
                    console.warn('Start button text layout error:', e);
                }
            }

            // 操作方法ボタン
            const instructionsButtonX = centerX - buttonWidth / 2;
            const instructionsButtonY = startButtonY + buttonHeight + buttonSpacing;

            if (this.instructionsButton) {
                this.instructionsButton.clear();
                
                // ドット絵風のボタン（四角形、太いボーダー）
                // 外側の明るいボーダー
                this.instructionsButton.rect(instructionsButtonX, instructionsButtonY, buttonWidth, buttonHeight);
                this.instructionsButton.fill(0x4ecdc4);
                this.instructionsButton.stroke({ color: 0xffffff, width: 6 });
                
                // 内側の影（ドット絵風の立体感）
                this.instructionsButton.rect(instructionsButtonX + 4, instructionsButtonY + 4, buttonWidth - 8, buttonHeight - 8);
                this.instructionsButton.stroke({ color: 0x3da39c, width: 2 });
            }

            if (this.instructionsButtonText) {
                try {
                    this.instructionsButtonText.x = centerX - this.instructionsButtonText.width / 2;
                    this.instructionsButtonText.y = instructionsButtonY + buttonHeight / 2 - this.instructionsButtonText.height / 2;
                } catch (e) {
                    console.warn('Instructions button text layout error:', e);
                }
            }
        } catch (e) {
            console.error('Layout error:', e);
        }
    }
}
