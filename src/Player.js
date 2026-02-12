/**
 * @fileoverview プレイヤークラスを定義するモジュール
 * @description キーボードで操作可能なプレイヤーキャラクター
 * @version 1.0.0
 */

import { Container, Sprite, Assets } from 'pixi.js';

/**
 * プレイヤークラス
 * @class Player
 * @extends Container
 * @description 左右キーで操作可能なプレイヤーキャラクター
 */
export class Player extends Container {
    /**
     * Playerクラスのコンストラクタ
     * @constructor
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} minX - 移動可能な最小X座標
     * @param {number} maxX - 移動可能な最大X座標
     */
    constructor(x, y, minX, maxX) {
        super();

        /**
         * 移動可能な最小X座標
         * @type {number}
         * @private
         */
        this.minX = minX;

        /**
         * 移動可能な最小X座標（画像幅調整前）
         * @type {number}
         * @private
         */
        this.baseMinX = minX;

        /**
         * 移動可能な最大X座標
         * @type {number}
         * @private
         */
        this.maxX = maxX;

        /**
         * 移動可能な最大X座標（画像幅調整前）
         * @type {number}
         * @private
         */
        this.baseMaxX = maxX;

        /**
         * 移動中のスプライト
         * @type {Sprite|null}
         * @private
         */
        this.moveSprite = null;

        /**
         * 停止中のスプライト
         * @type {Sprite|null}
         * @private
         */
        this.stopSprite = null;

        /**
         * 現在のスプライト
         * @type {Sprite|null}
         * @private
         */
        this.currentSprite = null;

        /**
         * 現在の見た目レベル
         * @type {number}
         * @private
         */
        this.currentTier = 0;

        /**
         * 移動速度
         * @type {number}
         * @private
         */
        this.speed = 6.25;

        /**
         * ダッシュ速度
         * @type {number}
         * @private
         */
        this.dashSpeed = 12.5;

        /**
         * スペースキーが押されているか
         * @type {boolean}
         * @private
         */
        this.spacePressed = false;

        /**
         * 上キーが押されているか
         * @type {boolean}
         * @private
         */
        this.upPressed = false;

        /**
         * 左キーが押されているか
         * @type {boolean}
         * @private
         */
        this.leftPressed = false;

        /**
         * 右キーが押されているか
         * @type {boolean}
         * @private
         */
        this.rightPressed = false;

        /**
         * 直前の方向（'left' or 'right'）
         * @type {string}
         * @private
         */
        this.lastDirection = 'right';

        /**
         * 現在移動中かどうか
         * @type {boolean}
         * @private
         */
        this.isMoving = false;

        /**
         * Y方向の速度
         * @type {number}
         * @private
         */
        this.velocityY = 0;

        /**
         * 重力
         * @type {number}
         * @private
         */
        this.gravity = 0.3;

        /**
         * ジャンプ力
         * @type {number}
         * @private
         */
        this.jumpPower = 7;

        /**
         * 接地中かどうか
         * @type {boolean}
         * @private
         */
        this.isGrounded = true;

        /**
         * ジャンプをしているか
         * @type {boolean}
         * @private
         */
        this.jumpPressed = false;

        /**
         * 初期Y座標
         * @type {number}
         * @private
         */
        this.baseY = y;

        /**
         * 現在のスタミナ
         * @type {number}
         * @private
         */
        this.stamina = 2.0;

        /**
         * 最大スタミナ
         * @type {number}
         * @private
         */
        this.maxStamina = 2.0;

        /**
         * スタミナ回復速度（秒あたり）
         * @type {number}
         * @private
         */
        this.staminaRecoveryRate = 0.5;

        /**
         * スタミナ消費速度（秒あたり）
         * @type {number}
         * @private
         */
        this.staminaConsumptionRate = 1.0;

        /**
         * スタミナが空かどうか
         * @type {boolean}
         * @private
         */
        this.isStaminaEmpty = false;

        /**
         * キーダウンイベントハンドラー
         * @type {Function|null}
         * @private
         */
        this.keydownHandler = null;

        /**
         * キーアップイベントハンドラー
         * @type {Function|null}
         * @private
         */
        this.keyupHandler = null;

        // 位置を設定
        this.x = x;
        this.y = y;

        this.init();
    }

    /**
     * 初期化処理を実行
     * @async
     * @method init
     * @private
     */
    async init() {
        try {
            await this.loadSpriteSet(0);
            this.applyBounds();

            // キーボードイベントをセットアップ
            this.setupKeyboardEvents();

        } catch (error) {
            console.error('プレイヤー画像の読み込みに失敗しました:', error);
        }
    }

    /**
     * キーボードイベントのセットアップ
     * @method setupKeyboardEvents
     * @private
     */
    setupKeyboardEvents() {
        this.keydownHandler = (event) => {
            if (event.key === 'ArrowLeft') {
                this.leftPressed = true;
            } else if (event.key === 'ArrowRight') {
                this.rightPressed = true;
            } else if (event.key === 'ArrowUp' && this.isGrounded) {
                // 上キーでジャンプ
                this.velocityY = -this.jumpPower;
                this.isGrounded = false;
                this.upPressed = true;
            } else if (event.key === ' ') {
                // スペースキーでダッシュ
                this.spacePressed = true;
            }
        };

        this.keyupHandler = (event) => {
            if (event.key === 'ArrowLeft') {
                this.leftPressed = false;
            } else if (event.key === 'ArrowRight') {
                this.rightPressed = false;
            } else if (event.key === 'ArrowUp') {
                this.upPressed = false;
            } else if (event.key === ' ') {
                this.spacePressed = false;
            }
        };

        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }

    /**
     * フレーム更新処理
     * @method update
     * @param {number} delta - 前フレームからの経過時間（60FPS基準で1.0が標準）
     */
    update(delta = 1.0) {
        if (!this.currentSprite) {
            return;
        }
        this.isMoving = false;

        // デルタを秒に変換（60FPS基準で1.0 = 1フレーム）
        const deltaSeconds = delta / 60;

        // Y方向の挙動処理（重力と接地判定）
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // 接地判定（初期Y座標以上になったら接地中にする）
        if (this.y >= this.baseY) {
            this.y = this.baseY;
            this.velocityY = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        // ダッシュかどうかを判定
        const isDashing = this.spacePressed && !this.isStaminaEmpty && (this.leftPressed || this.rightPressed);
        const currentSpeed = isDashing ? this.dashSpeed : this.speed;

        // スタミナの処理
        if (isDashing) {
            // ダッシュ中はスタミナを消費
            this.stamina -= this.staminaConsumptionRate * deltaSeconds;
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.isStaminaEmpty = true;
            }
        } else {
            // ダッシュしていない時は回復
            if (this.isStaminaEmpty) {
                // 空になった場合は満タンまで回復
                this.stamina += this.staminaRecoveryRate * deltaSeconds;
                if (this.stamina >= this.maxStamina) {
                    this.stamina = this.maxStamina;
                    this.isStaminaEmpty = false;
                }
            } else {
                // 通常回復
                this.stamina += this.staminaRecoveryRate * deltaSeconds;
                if (this.stamina > this.maxStamina) {
                    this.stamina = this.maxStamina;
                }
            }
        }

        // 左右の移動処理
        const prevX = this.x;
        if (this.leftPressed) {
            this.x -= currentSpeed * delta;
            this.lastDirection = 'left';
            this.isMoving = true;
        }
        if (this.rightPressed) {
            this.x += currentSpeed * delta;
            this.lastDirection = 'right';
            this.isMoving = true;
        }

        // 移動範囲を制限
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));

        // スプライトの切り替えと向きの設定
        this.updateSprite();
    }

    /**
     * スプライトの更新
     * @method updateSprite
     * @private
     */
    updateSprite() {
        if (!this.moveSprite || !this.stopSprite || !this.currentSprite) {
            return;
        }
        let newSprite = null;
        let flipX = false;

        if (this.isMoving) {
            // 移動中
            newSprite = this.moveSprite;
            // 大吾郎_からっぽは左向きなので、右に動くときは反転
            flipX = (this.lastDirection === 'right');
        } else {
            // 停止中
            newSprite = this.stopSprite;
            // 大吾郎_停止_からっぽは右向きなので、直前が左なら反転
            flipX = (this.lastDirection === 'left');
        }

        // スプライトが変わった場合は入れ替え
        if (newSprite !== this.currentSprite) {
            this.removeChild(this.currentSprite);
            this.currentSprite = newSprite;
            this.addChild(this.currentSprite);
        }

        // 左右反転を適用
        this.currentSprite.scale.x = Math.abs(this.currentSprite.scale.x) * (flipX ? -1 : 1);
    }

    /**
     * 移動範囲を更新
     * @method updateBounds
     * @param {number} minX - 新しい最小X座標
     * @param {number} maxX - 新しい最大X座標
     */
    updateBounds(minX, maxX) {
        this.baseMinX = minX;
        this.baseMaxX = maxX;
        this.applyBounds();
    }

    /**
     * スコアに応じて見た目を更新
     * @method setScore
     * @param {number} score - 現在のスコア
     */
    setScore(score) {
        const nextTier = this.resolveTier(score);
        if (nextTier === this.currentTier) {
            return;
        }
        this.currentTier = nextTier;
        this.loadSpriteSet(nextTier).catch((error) => {
            console.error('プレイヤー画像の読み込みに失敗しました:', error);
        });
    }

    /**
     * スコアから見た目レベルを決定
     * @method resolveTier
     * @param {number} score - 現在のスコア
     * @returns {number} レベル
     * @private
     */
    resolveTier(score) {
        if (score >= 60) return 2;
        if (score >= 30) return 1;
        return 0;
    }

    /**
     * スプライトセットを読み込む
     * @method loadSpriteSet
     * @param {number} tier - 見た目レベル
     * @private
     */
    async loadSpriteSet(tier) {
        const paths = this.getSpritePaths(tier);
        const moveTexture = await Assets.load(paths.move);
        const stopTexture = await Assets.load(paths.stop);

        const moveSprite = new Sprite(moveTexture);
        const stopSprite = new Sprite(stopTexture);

        moveSprite.anchor.set(0.5, 1);
        stopSprite.anchor.set(0.5, 1);

        const scale = 0.15;
        moveSprite.scale.set(scale);
        stopSprite.scale.set(scale);

        if (this.moveSprite) this.removeChild(this.moveSprite);
        if (this.stopSprite) this.removeChild(this.stopSprite);

        this.moveSprite = moveSprite;
        this.stopSprite = stopSprite;

        this.currentSprite = this.isMoving ? this.moveSprite : this.stopSprite;
        this.addChild(this.currentSprite);
        
        // 確実に可視化
        this.visible = true;
        this.currentSprite.visible = true;

        this.applyBounds();
        this.updateSprite();
    }

    /**
     * レベルに応じた画像パスを取得
     * @method getSpritePaths
     * @param {number} tier - 見た目レベル
     * @returns {{move: string, stop: string}} 画像パス
     * @private
     */
    getSpritePaths(tier) {
        if (tier === 2) {
            return {
                move: '/assets/daigorou_3rd.png',
                stop: '/assets/daigorou_stop_3rd.png'
            };
        }
        if (tier === 1) {
            return {
                move: '/assets/daigorou_2nd.png',
                stop: '/assets/daigorou_stop_2nd.png'
            };
        }
        return {
            move: '/assets/daigorou_1st.png',
            stop: '/assets/daigorou_stop_1st.png'
        };
    }

    /**
     * 画像幅を考慮した移動範囲を適用
     * @method applyBounds
     * @private
     */
    applyBounds() {
        const halfWidth = this.getWidth() / 2;
        this.minX = this.baseMinX + halfWidth;
        this.maxX = this.baseMaxX - halfWidth;
    }

    /**
     * プレイヤーの幅を取得
     * @method getWidth
     * @returns {number} プレイヤーの幅
     */
    getWidth() {
        return this.currentSprite ? Math.abs(this.currentSprite.width) : 0;
    }

    /**
     * プレイヤーの高さを取得
     * @method getHeight
     * @returns {number} プレイヤーの高さ
     */
    getHeight() {
        return this.currentSprite ? this.currentSprite.height : 0;
    }

    /**
     * プレイヤーのバウンディングボックスを取得
     * @method getBounds
     * @returns {{x: number, y: number, width: number, height: number}} バウンディングボックス
     */
    getBounds() {
        const width = this.getWidth();
        const height = this.getHeight();
        return {
            x: this.x - width / 2,
            y: this.y - height,
            width: width,
            height: height
        };
    }

    /**
     * Playerインスタンスを破棄し、イベントリスナーをクリーンアップ
     * @method destroy
     * @param {Object} options - 破棄オプション
     */
    destroy(options) {
        // キーボードイベントリスナーを削除
        if (this.keydownHandler) {
            window.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
        if (this.keyupHandler) {
            window.removeEventListener('keyup', this.keyupHandler);
            this.keyupHandler = null;
        }

        // 親クラスのdestroyを呼び出し
        super.destroy(options);
    }
}
