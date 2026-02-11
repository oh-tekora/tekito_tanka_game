/**
 * @fileoverview チョコレートクラスを定義するモジュール
 * @description 上から落ちてくるチョコレートオブジェクト
 * @version 1.0.0
 */

import { Container, Sprite, Assets } from 'pixi.js';

/**
 * チョコレートクラス
 * @class Chocolate
 * @extends Container
 * @description 重力法則に従って落下するチョコレートオブジェクト
 */
export class Chocolate extends Container {
    /**
     * Chocolateクラスのコンストラクタ
     * @constructor
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {string} texturePath - チョコレート画像のパス
     * @param {number} [scale=1.0] - スケール（大きさ）
     */
    constructor(x, y, texturePath, scale = 1.0, points = 1) {
        super();

        /**
         * テクスチャパス
         * @type {string}
         * @private
         */
        this.texturePath = texturePath;

        /**
         * 得点
         * @type {number}
         * @private
         */
        this.points = points;

        /**
         * スプライトオブジェクト
         * @type {Sprite|null}
         * @private
         */
        this.sprite = null;

        /**
         * Y方向の速度
         * @type {number}
         * @private
         */
        this.vy = 0;

        /**
         * 重力加速度
         * @type {number}
         * @private
         */
        this.gravity = 0.15;

        /**
         * スケール
         * @type {number}
         * @private
         */
        this.spriteScale = scale;

        /**
         * キャッチされたかどうか
         * @type {boolean}
         * @private
         */
        this.caught = false;

        /**
         * 画面外に出たかどうか
         * @type {boolean}
         * @private
         */
        this.outOfBounds = false;

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
            // テクスチャを読み込む
            const texture = await Assets.load(this.texturePath);
            this.sprite = new Sprite(texture);

            // アンカーを中央に設定
            this.sprite.anchor.set(0.5);

            // スケールを設定
            this.sprite.scale.set(this.spriteScale);

            this.addChild(this.sprite);
        } catch (error) {
            console.error('チョコレート画像の読み込みに失敗しました:', error);
        }
    }

    /**
     * フレーム更新処理
     * @method update
     * @param {number} delta - 前フレームからの経過時間（60FPS基準で1.0が標準）
     */
    update(delta) {
        if (this.caught || this.outOfBounds) {
            return;
        }

        // 重力を適用
        this.vy += this.gravity * delta;

        // Y座標を更新
        this.y += this.vy * delta;
    }

    /**
     * チョコレートがキャッチされた時の処理
     * @method catch
     */
    catch() {
        this.caught = true;
    }

    /**
     * チョコレートが画面外に出たかチェック
     * @method checkOutOfBounds
     * @param {number} bottomY - 画面下端のY座標
     */
    checkOutOfBounds(bottomY) {
        if (this.y > bottomY) {
            this.outOfBounds = true;
        }
    }

    /**
     * チョコレートがキャッチされたかどうかを取得
     * @method isCaught
     * @returns {boolean} キャッチされていればtrue
     */
    isCaught() {
        return this.caught;
    }

    /**
     * チョコレートが画面外に出たかどうかを取得
     * @method isOutOfBounds
     * @returns {boolean} 画面外に出ていればtrue
     */
    isOutOfBounds() {
        return this.outOfBounds;
    }

    /**
     * チョコレートの幅を取得
     * @method getWidth
     * @returns {number} チョコレートの幅
     */
    getWidth() {
        return this.sprite ? this.sprite.width : 0;
    }

    /**
     * チョコレートの高さを取得
     * @method getHeight
     * @returns {number} チョコレートの高さ
     */
    getHeight() {
        return this.sprite ? this.sprite.height : 0;
    }

    /**
     * チョコレートのバウンディングボックスを取得
     * @method getBounds
     * @returns {{x: number, y: number, width: number, height: number}} バウンディングボックス
     */
    getBounds() {
        const width = this.getWidth();
        const height = this.getHeight();
        return {
            x: this.x - width / 2,
            y: this.y - height / 2,
            width: width,
            height: height
        };
    }

    /**
     * チョコレートの得点を取得
     * @method getPoints
     * @returns {number} 得点
     */
    getPoints() {
        return this.points;
    }
}
