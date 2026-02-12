/**
 * @fileoverview 操作方法ページ（練習ページ兼用）
 */

import { Container, Graphics, Text } from 'pixi.js';
import { Player } from './Player.js';
import { GameArea } from './GameArea.js';
import { StaminaGauge } from './StaminaGauge.js';

const UI_FONT = 'DotGothic16Std-M, Arial, sans-serif';

export class Instructions extends Container {
    constructor(app, onTop = null, onStart = null) {
        super();

        this.app = app;
        this.onTop = onTop;
        this.onStart = onStart;

        this.player = null;
        this.gameArea = null;
        this.practiceContainer = null;
        this.staminaGauge = null;
        this.currentStamina = 2.0;
        this.maxStamina = 2.0;

        this.topButton = null;
        this.topButtonText = null;
        this.startButton = null;
        this.startButtonText = null;

        this.init();

        window.addEventListener('resize', () => {
            this.layout();
        });
    }

    init() {
        // 背景
        const background = new Graphics();
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.fill(0x1099bb);
        this.addChild(background);

        // ゲームエリアのサイズ（実際のゲーム画面と同じ）
        const maxWidth = 600;
        const maxHeight = 800;
        const areaWidth = Math.min(this.app.screen.width * 0.7, maxWidth);
        const areaHeight = Math.min(this.app.screen.height * 0.8, maxHeight);

        // 左側に説明文を配置
        const instructionsText = new Text({
            text: '操作方法\n\n左右矢印キー：移動\n\n上矢印キー：ジャンプ\n\nスペースキー＋\n左右矢印キー：ダッシュ\n\n※ダッシュはスタミナ\nゲージを消費します。\n\n使い切ると満タンに\n回復するまで移動速度が\n遅くなります！',
            style: {
                fontFamily: UI_FONT,
                fontSize: 16,
                fontWeight: 'bold',
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: 200,
                lineHeight: 28
            }
        });
        instructionsText.x = 20;
        instructionsText.y = 20;
        this.addChild(instructionsText);

        // 練習ゲーム用コンテナ
        this.practiceContainer = new Container();
        this.practiceContainer.sortableChildren = true;
        const practiceAreaX = this.app.screen.width - areaWidth - 20;
        const practiceAreaY = (this.app.screen.height - areaHeight) / 2;
        this.practiceContainer.x = practiceAreaX;
        this.practiceContainer.y = practiceAreaY;
        this.addChild(this.practiceContainer);

        // ゲームエリアの初期化（practiceContainerのローカル座標で配置）
        this.gameArea = new GameArea(areaWidth, areaHeight);
        this.gameArea.x = 0;
        this.gameArea.y = 0;
        this.practiceContainer.addChild(this.gameArea);

        // プレイヤーの初期化（practiceContainerのローカル座標で配置）
        this.player = new Player(
            areaWidth / 2,
            areaHeight - 16,
            16,
            areaWidth - 16
        );
        this.player.zIndex = 100;
        this.practiceContainer.addChild(this.player);

        // スタミナゲージを作成（practiceContainerのローカル座標で配置）
        this.staminaGauge = new StaminaGauge(
            0,
            -40,
            areaWidth,
            16
        );
        this.practiceContainer.addChild(this.staminaGauge);
        this.staminaGauge.setStamina(this.currentStamina, this.maxStamina);

        // TOPボタンを作成
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
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.topButtonText);

        // STARTボタンを作成
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
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        });
        this.addChild(this.startButtonText);

        this.layout();
    }

    layout() {
        try {
            const buttonWidth = 120;
            const buttonHeight = 50;
            const bottomMargin = 30;
            const leftMargin = 30;

            // TOPボタン
            const topButtonX = leftMargin;
            const topButtonY = this.app.screen.height - buttonHeight - bottomMargin;

            if (this.topButton) {
                this.topButton.clear();
                this.topButton.roundRect(topButtonX, topButtonY, buttonWidth, buttonHeight, 10);
                this.topButton.fill(0x666666);
                this.topButton.stroke({ color: 0xffffff, width: 3 });
            }

            if (this.topButtonText) {
                try {
                    this.topButtonText.x = topButtonX + buttonWidth / 2 - this.topButtonText.width / 2;
                    this.topButtonText.y = topButtonY + buttonHeight / 2 - this.topButtonText.height / 2;
                } catch (e) {
                    console.warn('Top button text layout error:', e);
                }
            }

            // STARTボタン
            const startButtonX = leftMargin + buttonWidth + 20;
            const startButtonY = this.app.screen.height - buttonHeight - bottomMargin;

            if (this.startButton) {
                this.startButton.clear();
                this.startButton.roundRect(startButtonX, startButtonY, buttonWidth, buttonHeight, 10);
                this.startButton.fill(0xff6b6b);
                this.startButton.stroke({ color: 0xffffff, width: 3 });
            }

            if (this.startButtonText) {
                try {
                    this.startButtonText.x = startButtonX + buttonWidth / 2 - this.startButtonText.width / 2;
                    this.startButtonText.y = startButtonY + buttonHeight / 2 - this.startButtonText.height / 2;
                } catch (e) {
                    console.warn('Start button text layout error:', e);
                }
            }
        } catch (e) {
            console.error('Layout error:', e);
        }
    }

    update(deltaTime) {
        if (this.player) {
            this.player.update(deltaTime);
            
            // スタミナゲージを更新
            this.currentStamina = this.player.stamina;
            if (this.staminaGauge) {
                this.staminaGauge.setStamina(this.currentStamina, this.maxStamina);
            }
        }
    }

    destroy(options) {
        // Playerを破棄
        if (this.player) {
            this.player.destroy({ children: true });
            this.player = null;
        }

        // 親クラスのdestroyを呼び出し
        super.destroy(options);
    }
}
