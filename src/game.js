/**
 * @fileoverview ゲームのメイン画面を担当するモジュール
 * @description ゲームのステージとして機能し、キャラクターを配置・管理する
 * @version 2.0.0
 */

import { Container, Graphics, Text } from 'pixi.js';
import { Character } from './character.js';
import { GameArea } from './GameArea.js';
import { Chocolate } from './Chocolate.js';
import { Player } from './Player.js';
import { FloatingText } from './FloatingText.js';
import { StaminaGauge } from './StaminaGauge.js';
import { Sprite, Assets } from 'pixi.js';

const UI_FONT = 'DotGothic16Std-M, Arial, sans-serif';

/**
 * ゲームのメイン画面クラス
 * @class Game
 * @extends Container
 * @description ゲームのステージとして機能するコンテナクラス
 */
export class Game extends Container {
    /**
     * Gameクラスのコンストラクタ
     * @constructor
     * @param {Application} app - PixiJSアプリケーションインスタンス
     */
    constructor(app, onGameEnd = null) {
        super();

        /**
         * PixiJSアプリケーションインスタンスへの参照
         * @type {Application}
         * @private
         */
        this.app = app;

        /**
         * ゲーム終了時のコールバック
         * @type {Function|null}
         * @private
         */
        this.onGameEnd = onGameEnd;

        /**
         * 背景グラフィックスオブジェクト
         * @type {Graphics}
         * @private
         */
        this.background = null;

        /**
         * ゲームエリア
         * @type {GameArea}
         * @private
         */
        this.gameArea = null;

        /**
         * キャラクターインスタンス
         * @type {Character}
         * @private
         */
        this.character = null;

        /**
         * 全キャラクターの配列
         * @type {Character[]}
         * @private
         */
        this.characters = [];

        /**
         * ドラッグ中のキャラクター
         * @type {Character|null}
         * @private
         */
        this.draggedCharacter = null;

        /**
         * 現在のポインター位置（グローバル座標）
         * @type {{x: number, y: number}}
         * @private
         */
        this.currentPointerPos = { x: 0, y: 0 };

        /**
         * チョコレートの配列
         * @type {Chocolate[]}
         * @private
         */
        this.chocolates = [];

        /**
         * チョコレート生成タイマー
         * @type {number}
         * @private
         */
        this.chocolateSpawnTimer = 0;

        /**
         * チョコレート生成間隔（秒）
         * @type {number}
         * @private
         */
        this.chocolateSpawnInterval = 0.5;

        /**
         * チョコレート画像のパス配列
         * @type {string[]}
         * @private
         */
        this.chocolateTextures = [
            '/assets/chocolate1.png',
            '/assets/chocolate2.png'
        ];

        /**
         * プレイヤー
         * @type {Player|null}
         * @private
         */
        this.player = null;

        /**
         * スコア
         * @type {number}
         * @private
         */
        this.score = 0;

        /**
         * スコア表示テキスト
         * @type {Text|null}
         * @private
         */
        this.scoreText = null;

        /**
         * 制限時間（秒）
         * @type {number}
         * @private
         */
        this.timeLimit = 30;

        /**
         * 残り時間（秒）
         * @type {number}
         * @private
         */
        this.timeLeft = this.timeLimit;

        /**
         * タイム表示テキスト
         * @type {Text|null}
         * @private
         */
        this.timeText = null;

        /**
         * フローティングテキスト（ポイント表示）の配列
         * @type {FloatingText[]}
         * @private
         */
        this.floatingTexts = [];

        /**
         * スタミナゲージ
         * @type {StaminaGauge|null}
         * @private
         */
        this.staminaGauge = null;

        /**
         * ゲーム進行中かどうか
         * @type {boolean}
         * @private
         */
        this.isRunning = false;

        /**
         * カウントダウン中かどうか
         * @type {boolean}
         * @private
         */
        this.isCountingDown = false;

        /**
         * カウントダウンの値（3, 2, 1）
         * @type {number}
         * @private
         */
        this.countdownValue = 3;

        /**
         * カウントダウンのタイマー
         * @type {number}
         * @private
         */
        this.countdownTimer = 0;

        /**
         * カウントダウン表示テキスト
         * @type {Text|null}
         * @private
         */
        this.countdownText = null;

        /**
         * FINISH表示中かどうか
         * @type {boolean}
         * @private
         */
        this.isFinishing = false;

        /**
         * FINISH表示のタイマー
         * @type {number}
         * @private
         */
        this.finishTimer = 0;

        /**
         * FINISH表示テキスト
         * @type {Text|null}
         * @private
         */
        this.finishText = null;

        this.init();
    }

    /**
     * 初期化処理を実行
     * @method init
     * @private
     */
    init() {
        this.sortableChildren = true;
        
        // イベント処理を有効にする
        this.eventMode = 'static';

        this.setupBackground();
        this.setupGameArea();
        this.setupLoveBackground();
        this.setupPlayer();
        this.setupStaminaGauge();
        this.setupScoreText();
        this.setupTimeText();
        this.setupPointGuide();
        this.setupStaminaGauge();
        this.setupCountdownText();
        this.setupFinishText();
        this.setupCharacter();
        this.setupPointerEvents();

        // Stage レベルでもイベントをリッスンしてデバッグ
        this.app.stage.on('pointerdown', (event) => {
            console.log('Stage: PointerDown イベント発火');
        });

        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    /**
     * 背景のセットアップ
     * @method setupBackground
     * @private
     */
    setupBackground() {
        this.background = new Graphics();
        this.drawBackground();
        // 背景のイベントを通す設定
        this.background.eventMode = 'none';
        this.addChild(this.background);
    }

    /**
     * 背景を描画
     * @method drawBackground
     * @private
     */
    drawBackground() {
        this.background.clear();
        this.background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        this.background.fill(0xFED4E4);
    }

    /**
     * ゲームエリアのセットアップ
     * @method setupGameArea
     * @private
     */
    setupGameArea() {
        // 画面サイズの80%のゲームエリアを作成（最大サイズに制限）
        const maxWidth = 600;
        const maxHeight = 800;
        const areaWidth = Math.min(this.app.screen.width * 0.8, maxWidth);
        const areaHeight = Math.min(this.app.screen.height * 0.8, maxHeight);

        this.gameArea = new GameArea(areaWidth, areaHeight, 0xB47261, 5, 0xffffff, 0.2);
        
        // ゲームエリアを画面中央に配置
        this.gameArea.x = (this.app.screen.width - areaWidth) / 2;
        this.gameArea.y = (this.app.screen.height - areaHeight) / 2;
        
        this.addChild(this.gameArea);
    }

    /**
     * LOVE背景のセットアップ
     * @method setupLoveBackground
     * @private
     */
    async setupLoveBackground() {
        if (!this.gameArea) return;

        try {
            const loveTexture = await Assets.load('/assets/LOVE.png');
            const loveSprite = new Sprite(loveTexture);
            
            // ゲームエリアの中央に配置
            loveSprite.anchor.set(0.5);
            loveSprite.x = this.gameArea.getWidth() / 2;
            loveSprite.y = this.gameArea.getHeight() / 2;
            
            // 透明度50%
            loveSprite.alpha = 0.5;
            
            // サイズをゲームエリアに合わせて調整
            const maxSize = Math.min(this.gameArea.getWidth(), this.gameArea.getHeight()) * 0.8;
            const scale = maxSize / Math.max(loveSprite.width, loveSprite.height);
            loveSprite.scale.set(scale);
            
            // ゲームエリアに追加（背面）
            loveSprite.zIndex = -1;
            this.gameArea.addChild(loveSprite);
        } catch (e) {
            console.error('Failed to load LOVE.png:', e);
        }
    }

    /**
     * プレイヤーのセットアップ
     * @method setupPlayer
     * @private
     */
    setupPlayer() {
        if (!this.gameArea) return;

        // プレイヤーの初期位置（ゲームエリアの底面から5px上）
        const playerX = this.gameArea.x + this.gameArea.getWidth() / 2;
        const playerY = this.gameArea.y + this.gameArea.getHeight() - 5;

        // 移動範囲（後でプレイヤーの幅が分かったら調整）
        const minX = this.gameArea.x;
        const maxX = this.gameArea.x + this.gameArea.getWidth();

        this.player = new Player(playerX, playerY, minX, maxX);
        this.addChild(this.player);
    }

    /**
     * スタミナゲージのセットアップ
     * @method setupStaminaGauge
     * @private
     */
    setupStaminaGauge() {
        if (!this.gameArea || !this.player) return;

        // スタミナゲージをゲームエリアの上に配置
        const gaugeWidth = this.gameArea.getWidth();
        const gaugeHeight = 20;
        const gaugeX = this.gameArea.x;
        const gaugeY = this.gameArea.y - gaugeHeight - 10;

        this.staminaGauge = new StaminaGauge(gaugeX, gaugeY, gaugeWidth, gaugeHeight);
        this.addChild(this.staminaGauge);
        
        // 初期値を設定
        this.staminaGauge.setStamina(this.player.stamina, this.player.maxStamina);
    }

    /**
     * スコア表示のセットアップ
     * @method setupScoreText
     * @private
     */
    setupScoreText() {
        if (!this.gameArea) return;

        // スコアテキストを作成
        this.scoreText = new Text({
            text: `Score: ${this.score}`,
            style: {
                fontFamily: UI_FONT,
                fontSize: 32,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 4 }
            }
        });

        // ゲームエリアの右上外側に配置
        this.scoreText.x = this.gameArea.x + this.gameArea.getWidth() + 20;
        this.scoreText.y = this.gameArea.y;

        this.addChild(this.scoreText);
    }

    /**
     * タイム表示のセットアップ
     * @method setupTimeText
     * @private
     */
    setupTimeText() {
        if (!this.gameArea) return;

        this.timeText = new Text({
            text: `Time: ${this.timeLeft.toFixed(1)}`,
            style: {
                fontFamily: UI_FONT,
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 4 }
            }
        });

        this.timeText.x = this.gameArea.x + this.gameArea.getWidth() + 20;
        this.timeText.y = this.gameArea.y + 50;

        this.addChild(this.timeText);
    }

    /**
     * ポイントガイドのセットアップ
     * @method setupPointGuide
     * @private
     */
    async setupPointGuide() {
        if (!this.gameArea) return;

        try {
            // チョコレート1の表示
            const choco1Texture = await Assets.load('/assets/chocolate1.png');
            const choco1Icon = new Sprite(choco1Texture);
            choco1Icon.width = 30;
            choco1Icon.height = 30;
            choco1Icon.x = this.gameArea.x + this.gameArea.getWidth() + 20;
            choco1Icon.y = this.gameArea.y + 100;
            this.addChild(choco1Icon);

            const choco1Text = new Text({
                text: '1pt',
                style: {
                    fontFamily: UI_FONT,
                    fontSize: 20,
                    fontWeight: 'bold',
                    fill: 0xffffff,
                    stroke: { color: 0x000000, width: 3 }
                }
            });
            choco1Text.x = choco1Icon.x + 40;
            choco1Text.y = choco1Icon.y + 5;
            this.addChild(choco1Text);

            // チョコレート2の表示
            const choco2Texture = await Assets.load('/assets/chocolate2.png');
            const choco2Icon = new Sprite(choco2Texture);
            choco2Icon.width = 30;
            choco2Icon.height = 30;
            choco2Icon.x = this.gameArea.x + this.gameArea.getWidth() + 20;
            choco2Icon.y = this.gameArea.y + 140;
            this.addChild(choco2Icon);

            const choco2Text = new Text({
                text: '3pt',
                style: {
                    fontFamily: UI_FONT,
                    fontSize: 20,
                    fontWeight: 'bold',
                    fill: 0xffffff,
                    stroke: { color: 0x000000, width: 3 }
                }
            });
            choco2Text.x = choco2Icon.x + 40;
            choco2Text.y = choco2Icon.y + 5;
            this.addChild(choco2Text);
        } catch (e) {
            console.error('Point guide setup failed:', e);
        }
    }

    /**
     * カウントダウンテキストのセットアップ
     * @method setupCountdownText
     * @private
     */
    setupCountdownText() {
        if (!this.gameArea) return;

        this.countdownText = new Text({
            text: '3',
            style: {
                fontFamily: UI_FONT,
                fontSize: 120,
                fontWeight: 'bold',
                fill: 0xff6b6b,
                stroke: { color: 0xffffff, width: 8 }
            }
        });

        // ゲームエリアの中央に配置
        this.countdownText.anchor.set(0.5);
        this.countdownText.x = this.gameArea.x + this.gameArea.getWidth() / 2;
        this.countdownText.y = this.gameArea.y + this.gameArea.getHeight() / 2;
        this.countdownText.visible = false;
        this.countdownText.zIndex = 10000;

        this.addChild(this.countdownText);
    }

    /**
     * FINISH表示テキストのセットアップ
     * @method setupFinishText
     * @private
     */
    setupFinishText() {
        if (!this.gameArea) return;

        this.finishText = new Text({
            text: 'FINISH！',
            style: {
                fontFamily: UI_FONT,
                fontSize: 100,
                fontWeight: 'bold',
                fill: 0xffffff,
                stroke: { color: 0xB47261, width: 8 }
            }
        });

        // ゲームエリアの中央に配置
        this.finishText.anchor.set(0.5);
        this.finishText.x = this.gameArea.x + this.gameArea.getWidth() / 2;
        this.finishText.y = this.gameArea.y + this.gameArea.getHeight() / 2;
        this.finishText.visible = false;
        this.finishText.zIndex = 10000;

        this.addChild(this.finishText);
    }

    /**
     * スタミナゲージのセットアップ
     * @method setupStaminaGauge
     * @private
     */
    setupStaminaGauge() {
        if (!this.gameArea) return;

        // スタミナゲージを作成
        this.staminaGauge = new StaminaGauge(
            this.gameArea.x,
            this.gameArea.y - 40,
            this.gameArea.getWidth(),
            16
        );

        this.addChild(this.staminaGauge);

        // 初期スタミナを反映
        if (this.player) {
            this.staminaGauge.setStamina(this.player.stamina, this.player.maxStamina);
        }
    }

    /**
     * キャラクターのセットアップ
     * @method setupCharacter
     * @private
     */
    /**
     * キャラクターのセットアップ
     * @method setupCharacter
     * @private
     */
    setupCharacter() {
        // キャラクターは後で追加
    }

    /**
     * ポインターイベントのセットアップ
     * @method setupPointerEvents
     * @private
     */
    setupPointerEvents() {
        // ポインターダウン時：どのキャラクターがクリックされたかを判定
        this.on('pointerdown', (event) => {
            console.log('PointerDown イベント発火');
            const globalPos = event.global;
            const localPos = this.toLocal(globalPos);
            console.log('グローバル座標:', globalPos.x, globalPos.y);
            console.log('ローカル座標:', localPos.x, localPos.y);
            
            for (const character of this.characters) {
                const distance = Math.sqrt(
                    Math.pow(localPos.x - character.x, 2) +
                    Math.pow(localPos.y - character.y, 2)
                );
                console.log(`キャラクター at (${character.x}, ${character.y}), サイズ: ${character.size}, 距離: ${distance}`);
                
                if (distance <= character.size) {
                    this.draggedCharacter = character;
                    
                    // 色をHEX値から名前に変換
                    const colorMap = {
                        0xff0000: '赤',
                        0x00ff00: '緑',
                        0x0000ff: '青'
                    };
                    const colorName = colorMap[character.color] || '不明';
                    console.log(`PointerDown: ${colorName}の円がクリックされました`);
                    break;
                }
            }
        });

        // ポインタームーブ時：ポインター位置を記録
        this.on('pointermove', (event) => {
            this.currentPointerPos.x = event.global.x;
            this.currentPointerPos.y = event.global.y;
        });

        // ポインターアップ時：ドラッグを終了
        this.on('pointerup', () => {
            if (this.draggedCharacter) {
                console.log('PointerUp: キャラクターが離されました');
                this.draggedCharacter = null;
            }
        });

        // ポインターアップアウトサイド時：ウィンドウの外に出た場合もドラッグを終了
        this.on('pointerupoutside', () => {
            if (this.draggedCharacter) {
                console.log('PointerUpOutside: キャラクターが離されました');
                this.draggedCharacter = null;
            }
        });
    }

    /**
     * ウィンドウリサイズ時のコールバック処理
     * @method onResize
     */
    onResize() {
        this.drawBackground();
        
        // ゲームエリアのサイズと位置を更新
        if (this.gameArea) {
            const maxWidth = 600;
            const maxHeight = 800;
            const areaWidth = Math.min(this.app.screen.width * 0.8, maxWidth);
            const areaHeight = Math.min(this.app.screen.height * 0.8, maxHeight);
            
            this.gameArea.resize(areaWidth, areaHeight);
            this.gameArea.x = (this.app.screen.width - areaWidth) / 2;
            this.gameArea.y = (this.app.screen.height - areaHeight) / 2;
        }

        // プレイヤーの位置を更新
        if (this.player && this.gameArea) {
            const playerY = this.gameArea.y + this.gameArea.getHeight() - 5;
            this.player.y = playerY;

            // プレイヤーの移動範囲を更新
            const minX = this.gameArea.x;
            const maxX = this.gameArea.x + this.gameArea.getWidth();
            this.player.updateBounds(minX, maxX);
        }

        // スコアテキストの位置を更新
        if (this.scoreText && this.gameArea) {
            this.scoreText.x = this.gameArea.x + this.gameArea.getWidth() + 20;
            this.scoreText.y = this.gameArea.y;
        }

        if (this.timeText && this.gameArea) {
            this.timeText.x = this.gameArea.x + this.gameArea.getWidth() + 20;
            this.timeText.y = this.gameArea.y + 50;
        }

        // スタミナゲージの位置を更新
        if (this.staminaGauge && this.gameArea) {
            this.staminaGauge.x = this.gameArea.x;
            this.staminaGauge.y = this.gameArea.y - 40;
        }
    }

    /**
     * ゲーム開始（カウントダウンから開始）
     * @method start
     */
    start() {
        // カウントダウンを開始
        this.isCountingDown = true;
        this.isRunning = false;
        this.countdownValue = 3;
        this.countdownTimer = 0;
        
        this.timeLeft = this.timeLimit;
        this.score = 0;
        this.chocolateSpawnTimer = 0;
        this.chocolates.forEach((chocolate) => this.removeChild(chocolate));
        this.chocolates = [];

        if (this.scoreText) {
            this.scoreText.text = `Score: ${this.score}`;
        }
        if (this.timeText) {
            this.timeText.text = `Time: ${this.timeLeft.toFixed(1)}`;
        }
        if (this.countdownText) {
            this.countdownText.text = '3';
            this.countdownText.visible = true;
        }
    }

    /**
     * ゲーム終了
     * @method endGame
     * @private
     */
    endGame() {
        if (!this.isRunning) return;
        this.isRunning = false;
        
        // FINISH表示を開始
        this.isFinishing = true;
        this.finishTimer = 0;
        if (this.finishText) {
            this.finishText.visible = true;
        }
    }

    /**
     * フレーム更新処理
     * @method update
     * @param {number} delta - 前フレームからの経過時間（60FPS基準で1.0が標準）
     */
    update(delta) {
        // FINISH表示処理
        if (this.isFinishing) {
            this.finishTimer += delta / 60;
            
            if (this.finishTimer >= 2.0) {
                // 2秒経過したらリザルト画面へ
                this.isFinishing = false;
                if (this.finishText) {
                    this.finishText.visible = false;
                }
                if (typeof this.onGameEnd === 'function') {
                    this.onGameEnd({ score: this.score });
                }
            }
            return;
        }
        
        // カウントダウン処理
        if (this.isCountingDown) {
            this.countdownTimer += delta / 60;
            
            if (this.countdownTimer >= 1.0) {
                this.countdownTimer = 0;
                this.countdownValue--;
                
                if (this.countdownValue > 0) {
                    // カウントダウン継続
                    if (this.countdownText) {
                        this.countdownText.text = String(this.countdownValue);
                    }
                } else {
                    // カウントダウン終了、ゲーム開始
                    this.isCountingDown = false;
                    this.isRunning = true;
                    if (this.countdownText) {
                        this.countdownText.visible = false;
                    }
                }
            }
            return;
        }
        
        if (!this.isRunning) {
            return;
        }
        this.timeLeft = Math.max(0, this.timeLeft - delta / 60);
        if (this.timeText) {
            this.timeText.text = `Time: ${this.timeLeft.toFixed(1)}`;
        }
        if (this.timeLeft <= 0) {
            this.endGame();
            return;
        }
        // プレイヤーを更新
        if (this.player) {
            this.player.update(delta);
            
            // スタミナゲージを更新
            if (this.staminaGauge) {
                this.staminaGauge.setStamina(this.player.stamina, this.player.maxStamina);
            }
        }

        // チョコレート生成タイマーを更新
        this.updateChocolateSpawner(delta);

        // チョコレートを更新
        this.updateChocolates(delta);

        // チョコとプレイヤーの衝突判定
        this.checkChocolateCollisions();

        // フローティングテキストを更新
        this.updateFloatingTexts(delta);

        // スタミナゲージを更新
        this.updateStaminaGauge();

        // 各キャラクターを更新
        for (const character of this.characters) {
            // ドラッグ中でないキャラクターのみ更新
            if (character !== this.draggedCharacter) {
                character.update(delta);
                
                // 画面端との衝突判定と反発処理
                this.checkScreenCollision(character);
            }
        }

        // ドラッグ中のキャラクターを毎フレーム更新
        if (this.draggedCharacter) {
            const localPos = this.toLocal(this.currentPointerPos);
            this.draggedCharacter.x = localPos.x;
            this.draggedCharacter.y = localPos.y;
            // ドラッグ中は速度をリセット
            this.draggedCharacter.vx = 0;
            this.draggedCharacter.vy = 0;
        }

        // 当たり判定を処理（すべてのキャラクター同士）
        for (let i = 0; i < this.characters.length; i++) {
            for (let j = i + 1; j < this.characters.length; j++) {
                this.checkCollision(this.characters[i], this.characters[j]);
            }
        }

        if (this.character) {
            this.character.update(delta);
        }
    }

    /**
     * チョコレート生成タイマーを更新
     * @method updateChocolateSpawner
     * @param {number} delta - 前フレームからの経過時間
     * @private
     */
    updateChocolateSpawner(delta) {
        this.chocolateSpawnTimer += delta / 60; // deltaを秒に変換

        if (this.chocolateSpawnTimer >= this.chocolateSpawnInterval) {
            this.spawnChocolate();
            this.chocolateSpawnTimer = 0;
        }
    }

    /**
     * チョコレートを生成
     * @method spawnChocolate
     * @private
     */
    spawnChocolate() {
        if (!this.gameArea) return;

        // ランダムなテクスチャを選択（70%でchocolate1、30%でchocolate2）
        const random = Math.random();
        const textureIndex = random < 0.7 ? 0 : 1;
        const texturePath = this.chocolateTextures[textureIndex];
        const points = texturePath.includes('chocolate2') ? 3 : 1;
        const gravityMultiplier = texturePath.includes('chocolate2') ? 1.1 : 0.9;

        // ゲームエリアの幅内でランダムなX座標を決定
        const areaWidth = this.gameArea.getWidth();
        const randomX = Math.random() * (areaWidth - 40) + 20; // 端から20pxマージン

        // ゲームエリアの上端のY座標（エリア内から出現）
        const spawnY = this.gameArea.y + 10;
        const spawnX = this.gameArea.x + randomX;

        // チョコレートを生成（スケールを調整）
        const chocolate = new Chocolate(spawnX, spawnY, texturePath, 0.08, points, gravityMultiplier);
        this.chocolates.push(chocolate);
        this.addChild(chocolate);
    }

    /**
     * チョコレートとプレイヤーの衝突判定
     * @method checkChocolateCollisions
     * @private
     */
    checkChocolateCollisions() {
        if (!this.player) return;

        const playerBounds = this.player.getBounds();

        for (const chocolate of this.chocolates) {
            if (chocolate.isCaught() || chocolate.isOutOfBounds()) {
                continue;
            }

            // チョコレートの境界を取得
            const chocoBounds = chocolate.getBounds();

            // 矩形の衝突判定
            if (this.checkRectCollision(playerBounds, chocoBounds)) {
                // チョコをキャッチ
                chocolate.catch();
                // ポイント数を取得
                const points = chocolate.getPoints();
                // スコアを増やす
                this.addScore(points);
                // フローティングテキストを表示
                this.showFloatingText(chocolate.x, chocolate.y, `+${points}pt`);
            }
        }
    }

    /**
     * 矩形同士の衝突判定
     * @method checkRectCollision
     * @param {Object} rect1 - 矩形1 {x, y, width, height}
     * @param {Object} rect2 - 矩形2 {x, y, width, height}
     * @returns {boolean} 衝突していればtrue
     * @private
     */
    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    /**
     * スコアを加算
     * @method addScore
     * @param {number} points - 加算するポイント
     * @private
     */
    addScore(points) {
        this.score += points;
        if (this.scoreText) {
            this.scoreText.text = `Score: ${this.score}`;
        }
        if (this.player && typeof this.player.setScore === 'function') {
            this.player.setScore(this.score);
        }
    }

    /**
     * フローティングテキストを表示
     * @method showFloatingText
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {string} text - 表示テキスト
     * @private
     */
    showFloatingText(x, y, text) {
        const floatingText = new FloatingText(x, y, text, {
            duration: 800,
            fontSize: 24,
            color: '#FFFFFF',
            floatDistance: 60
        });
        this.addChild(floatingText);
        this.floatingTexts.push(floatingText);
    }

    /**
     * フローティングテキストを更新
     * @method updateFloatingTexts
     * @param {number} delta - フレームデルタ
     * @private
     */
    updateFloatingTexts(delta) {
        // フローティングテキストを更新
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const floatingText = this.floatingTexts[i];
            const isActive = floatingText.update(delta);

            if (!isActive) {
                // アニメーション終了時に削除
                this.removeChild(floatingText);
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    /**
     * スタミナゲージを更新
     * @method updateStaminaGauge
     * @private
     */
    updateStaminaGauge() {
        if (!this.staminaGauge || !this.player) return;

        const currentStamina = this.player.stamina;
        const maxStamina = this.player.maxStamina;

        // ゲージを更新
        this.staminaGauge.setStamina(currentStamina, maxStamina);
    }

    /**
     * スタミナ変動表示を更新
     * @method updateStaminaChanges
     * @param {number} delta - フレームデルタ
     * @private
     */
    updateStaminaChanges(delta) {
        if (this.staminaChanges.length === 0) return;

        // スタミナ変動表示を更新
        for (let i = this.staminaChanges.length - 1; i >= 0; i--) {
            const staminaChange = this.staminaChanges[i];
            const isActive = staminaChange.update(delta);

            if (!isActive) {
                // アニメーション終了時に削除
                this.removeChild(staminaChange);
                this.staminaChanges.splice(i, 1);
            }
        }
    }

    /**
     * スタミナ変動表示を表示
     * @method showStaminaChange
     * @param {number} amount - スタミナ変動量
     * @param {boolean} isConsumption - 消費ならtrue、回復ならfalse
     * @private
     */
    showStaminaChange(amount, isConsumption) {
        if (!this.staminaGauge) return;

        // ゲージの中央位置
        const gaugeY = this.staminaGauge.y + this.staminaGauge.height / 2;

        const staminaChange = new StaminaChangeDisplay(
            this.staminaGauge.x + this.staminaGauge.width / 2,
            gaugeY,
            amount,
            {
                duration: 1000,
                fontSize: 16,
                isConsumption: isConsumption
            }
        );

        this.addChild(staminaChange);
        this.staminaChanges.push(staminaChange);
    }

    /**
     * チョコレートを更新
     * @method updateChocolates
     * @param {number} delta - 前フレームからの経過時間
     * @private
     */
    updateChocolates(delta) {
        // ゲームエリアの下端Y座標を取得（底面に到達したら消失）
        const bottomY = this.gameArea ? this.gameArea.y + this.gameArea.getHeight() : this.app.screen.height;

        // チョコレートを更新し、画面外チェック
        for (const chocolate of this.chocolates) {
            chocolate.update(delta);
            chocolate.checkOutOfBounds(bottomY);
        }

        // 画面外またはキャッチされたチョコレートを削除
        this.chocolates = this.chocolates.filter(chocolate => {
            if (chocolate.isOutOfBounds() || chocolate.isCaught()) {
                this.removeChild(chocolate);
                return false;
            }
            return true;
        });
    }

    /**
     * 画面端との衝突判定と反発処理
     * @method checkScreenCollision
     * @param {Character} character - キャラクター
     * @private
     */
    checkScreenCollision(character) {
        // ゲームエリアがない場合は画面全体を使用
        if (!this.gameArea) {
            const screenWidth = this.app.screen.width;
            const screenHeight = this.app.screen.height;
            
            // 左端の壁
            if (character.x - character.size <= 0) {
                character.x = character.size;
                character.vx = Math.abs(character.vx);
            }
            
            // 右端の壁
            if (character.x + character.size >= screenWidth) {
                character.x = screenWidth - character.size;
                character.vx = -Math.abs(character.vx);
            }
            
            // 上端の壁
            if (character.y - character.size <= 0) {
                character.y = character.size;
                character.vy = Math.abs(character.vy);
            }
            
            // 下端の壁
            if (character.y + character.size >= screenHeight) {
                character.y = screenHeight - character.size;
                character.vy = -Math.abs(character.vy);
            }
            return;
        }

        // ゲームエリアの境界での衝突判定
        const areaWidth = this.gameArea.getWidth();
        const areaHeight = this.gameArea.getHeight();
        
        // キャラクターのゲームエリア内での座標を取得
        const localPos = this.gameArea.toLocal({ x: character.x, y: character.y }, this);
        
        // 左端の壁
        if (localPos.x - character.size <= 0) {
            const globalPos = this.toLocal({ x: this.gameArea.x + character.size, y: character.y }, this.parent);
            character.x = globalPos.x;
            character.vx = Math.abs(character.vx);
        }
        
        // 右端の壁
        if (localPos.x + character.size >= areaWidth) {
            const globalPos = this.toLocal({ x: this.gameArea.x + areaWidth - character.size, y: character.y }, this.parent);
            character.x = globalPos.x;
            character.vx = -Math.abs(character.vx);
        }
        
        // 上端の壁
        if (localPos.y - character.size <= 0) {
            const globalPos = this.toLocal({ x: character.x, y: this.gameArea.y + character.size }, this.parent);
            character.y = globalPos.y;
            character.vy = Math.abs(character.vy);
        }
        
        // 下端の壁
        if (localPos.y + character.size >= areaHeight) {
            const globalPos = this.toLocal({ x: character.x, y: this.gameArea.y + areaHeight - character.size }, this.parent);
            character.y = globalPos.y;
            character.vy = -Math.abs(character.vy);
        }
    }

    /**
     * 2つのキャラクター間の衝突判定と反射処理
     * @method checkCollision
     * @param {Character} char1 - キャラクター1
     * @param {Character} char2 - キャラクター2
     * @private
     */
    checkCollision(char1, char2) {
        // 2つの円の中心間の距離を計算
        const dx = char2.x - char1.x;
        const dy = char2.y - char1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 2つの円が接触しているかチェック（円全体での判定）
        const minDistance = char1.size + char2.size;
        if (distance < minDistance + 2 && distance > 0.1) {
            // 正規化された衝突法線ベクトル（char1からchar2へ向かう方向）
            const nx = dx / distance;
            const ny = dy / distance;
            
            // 衝突接線ベクトル
            const tx = -ny;
            const ty = nx;
            
            // 各キャラクターの速度を衝突法線と接線成分に分解
            const v1n = char1.vx * nx + char1.vy * ny;  // char1 の法線成分
            const v1t = char1.vx * tx + char1.vy * ty;  // char1 の接線成分
            const v2n = char2.vx * nx + char2.vy * ny;  // char2 の法線成分
            const v2t = char2.vx * tx + char2.vy * ty;  // char2 の接線成分
            
            // 既に離れている場合はスキップ
            if (v1n - v2n > 0.01) {
                return;
            }
            
            // 反発係数（完全弾性衝突の場合は1.0）
            const restitution = 0.95;
            
            // どちらかがドラッグ中かチェック
            const char1Dragging = char1 === this.draggedCharacter;
            const char2Dragging = char2 === this.draggedCharacter;
            
            if (!char1Dragging && !char2Dragging) {
                // どちらもドラッグ中でない場合：通常の衝突処理
                const v1n_new = (v1n * (1 - restitution) + v2n * (1 + restitution)) / 2;
                const v2n_new = (v2n * (1 - restitution) + v1n * (1 + restitution)) / 2;
                
                char1.vx = v1n_new * nx + v1t * tx;
                char1.vy = v1n_new * ny + v1t * ty;
                char2.vx = v2n_new * nx + v2t * tx;
                char2.vy = v2n_new * ny + v2t * ty;
                
                // 両者で補正を分け合う
                const separationDistance = minDistance + 2;
                const moveDistance = (separationDistance - distance) / 2 + 1;
                
                char1.x -= moveDistance * nx;
                char1.y -= moveDistance * ny;
                char2.x += moveDistance * nx;
                char2.y += moveDistance * ny;
            } else if (char1Dragging && !char2Dragging) {
                // char1 がドラッグ中：char2 を完全に押し出す
                char2.vx = -v2n * nx + v2t * tx;
                char2.vy = -v2n * ny + v2t * ty;
                
                const separationDistance = minDistance + 2;
                const moveDistance = separationDistance - distance + 1;
                
                char2.x += moveDistance * nx;
                char2.y += moveDistance * ny;
            } else if (!char1Dragging && char2Dragging) {
                // char2 がドラッグ中：char1 を完全に押し出す
                char1.vx = -v1n * nx + v1t * tx;
                char1.vy = -v1n * ny + v1t * ty;
                
                const separationDistance = minDistance + 2;
                const moveDistance = separationDistance - distance + 1;
                
                char1.x -= moveDistance * nx;
                char1.y -= moveDistance * ny;
            }
        }
    }

    /**
     * Gameインスタンスを破棄し、Playerなどのリソースをクリーンアップ
     * @method destroy
     * @param {Object} options - 破棄オプション
     */
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
