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

        // タイトル
        const titleText = new Text({
            text: '操作方法',
            style: {
                fontFamily: UI_FONT,
                fontSize: 40,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 4 }
            }
        });
        titleText.x = 20;
        titleText.y = 20;
        this.addChild(titleText);

        // 操作方法の説明
        const instructionsText = new Text({
            text: '左右矢印キー：移動\n上矢印キー：ジャンプ\nスペースキー＋左右矢印キー：ダッシュ\n\n※ダッシュはスタミナゲージを\n消費します。使い切ると満タンに\n回復するまで移動速度が\n遅くなります！',
            style: {
                fontFamily: UI_FONT,
                fontSize: 18,
                fontWeight: 'bold',
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: 350,
                lineHeight: 30
            }
        });
        instructionsText.x = 30;
        instructionsText.y = 100;
        this.addChild(instructionsText);

        // 練習ゲーム用コンテナ
        this.practiceContainer = new Container();
        this.addChild(this.practiceContainer);

        // ゲームエリアの初期化（画面右側に配置）
        const practiceAreaX = this.app.screen.width / 2 + 50;
        const practiceAreaY = 100;
        const practiceAreaWidth = this.app.screen.width / 2 - 100;
        const practiceAreaHeight = 400;

        this.gameArea = new GameArea(practiceAreaX, practiceAreaY, practiceAreaWidth, practiceAreaHeight);
        this.practiceContainer.addChild(this.gameArea);

        // プレイヤーの初期化（高さを1/2に）
        this.player = new Player(
            this.gameArea.x + this.gameArea.getWidth() / 2,
            this.gameArea.y + this.gameArea.getHeight() - 16,
            this.gameArea.x + 16,
            this.gameArea.x + this.gameArea.getWidth() - 16
        );
        // プレイヤーのスケールを 0.5 に設定（高さを1/2に）
        this.player.scale.set(1, 0.5);
        this.practiceContainer.addChild(this.player);

        // スタミナゲージを作成
        this.staminaGauge = new StaminaGauge(
            this.gameArea.x,
            this.gameArea.y - 40,
            this.gameArea.getWidth(),
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
        const buttonWidth = 120;
        const buttonHeight = 50;
        const bottomMargin = 30;

        // TOPボタン
        const topButtonX = 30;
        const topButtonY = this.app.screen.height - buttonHeight - bottomMargin;

        this.topButton.clear();
        this.topButton.roundRect(topButtonX, topButtonY, buttonWidth, buttonHeight, 10);
        this.topButton.fill(0x666666);
        this.topButton.stroke({ color: 0xffffff, width: 3 });

        this.topButtonText.x = topButtonX + buttonWidth / 2 - this.topButtonText.width / 2;
        this.topButtonText.y = topButtonY + buttonHeight / 2 - this.topButtonText.height / 2;

        // STARTボタン
        const startButtonX = 30 + buttonWidth + 20;
        const startButtonY = this.app.screen.height - buttonHeight - bottomMargin;

        this.startButton.clear();
        this.startButton.roundRect(startButtonX, startButtonY, buttonWidth, buttonHeight, 10);
        this.startButton.fill(0xff6b6b);
        this.startButton.stroke({ color: 0xffffff, width: 3 });

        this.startButtonText.x = startButtonX + buttonWidth / 2 - this.startButtonText.width / 2;
        this.startButtonText.y = startButtonY + buttonHeight / 2 - this.startButtonText.height / 2;
    }

    update(deltaTime) {
        if (this.player) {
            this.player.update();
            // スタミナゲージを更新
            this.currentStamina = this.player.stamina;
            if (this.staminaGauge) {
                this.staminaGauge.setStamina(this.currentStamina, this.maxStamina);
            }
        }
    }
}
