/**
 * @fileoverview ゲームエリアクラスを定義するモジュール
 * @description キャラクターが動ける範囲を示す四角形を管理する
 * @version 1.0.0
 */

import { Container, Graphics } from 'pixi.js';

/**
 * ゲームエリアクラス
 * @class GameArea
 * @extends Container
 * @description キャラクターが動ける範囲を示す四角形の領域を管理する
 */
export class GameArea extends Container {
    /**
     * GameAreaクラスのコンストラクタ
     * @constructor
     * @param {number} width - ゲームエリアの幅
     * @param {number} height - ゲームエリアの高さ
     * @param {number} [borderColor=0xffffff] - 枠線の色
     * @param {number} [borderWidth=4] - 枠線の太さ
     * @param {number} [backgroundColor=0x000000] - 背景色
     * @param {number} [backgroundAlpha=0.1] - 背景の透明度
     */
    constructor(width, height, borderColor = 0xffffff, borderWidth = 4, backgroundColor = 0x000000, backgroundAlpha = 0.1) {
        super();

        /**
         * ゲームエリアの幅
         * @type {number}
         * @private
         */
        this.areaWidth = width;

        /**
         * ゲームエリアの高さ
         * @type {number}
         * @private
         */
        this.areaHeight = height;

        /**
         * 枠線の色
         * @type {number}
         * @private
         */
        this.borderColor = borderColor;

        /**
         * 枠線の太さ
         * @type {number}
         * @private
         */
        this.borderWidth = borderWidth;

        /**
         * 背景色
         * @type {number}
         * @private
         */
        this.backgroundColor = backgroundColor;

        /**
         * 背景の透明度
         * @type {number}
         * @private
         */
        this.backgroundAlpha = backgroundAlpha;

        /**
         * グラフィックスオブジェクト
         * @type {Graphics}
         * @private
         */
        this.graphics = null;

        this.init();
    }

    /**
     * 初期化処理を実行
     * @method init
     * @private
     */
    init() {
        this.graphics = new Graphics();
        this.draw();
        this.addChild(this.graphics);
    }

    /**
     * ゲームエリアを描画
     * @method draw
     * @private
     */
    draw() {
        this.graphics.clear();

        // 背景を描画
        this.graphics.rect(0, 0, this.areaWidth, this.areaHeight);
        this.graphics.fill({ color: this.backgroundColor, alpha: this.backgroundAlpha });

        // 枠線を描画
        this.graphics.rect(0, 0, this.areaWidth, this.areaHeight);
        this.graphics.stroke({ color: this.borderColor, width: this.borderWidth });
    }

    /**
     * ゲームエリアのサイズを更新
     * @method resize
     * @param {number} width - 新しい幅
     * @param {number} height - 新しい高さ
     */
    resize(width, height) {
        this.areaWidth = width;
        this.areaHeight = height;
        this.draw();
    }

    /**
     * 座標がゲームエリア内にあるかチェック
     * @method isInside
     * @param {number} x - X座標（ローカル座標）
     * @param {number} y - Y座標（ローカル座標）
     * @returns {boolean} エリア内ならtrue
     */
    isInside(x, y) {
        return x >= 0 && x <= this.areaWidth && y >= 0 && y <= this.areaHeight;
    }

    /**
     * 座標をゲームエリア内に制限する
     * @method clamp
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} [margin=0] - エリア端からのマージン
     * @returns {{x: number, y: number}} 制限された座標
     */
    clamp(x, y, margin = 0) {
        return {
            x: Math.max(margin, Math.min(this.areaWidth - margin, x)),
            y: Math.max(margin, Math.min(this.areaHeight - margin, y))
        };
    }

    /**
     * ゲームエリアの幅を取得
     * @method getWidth
     * @returns {number} エリアの幅
     */
    getWidth() {
        return this.areaWidth;
    }

    /**
     * ゲームエリアの高さを取得
     * @method getHeight
     * @returns {number} エリアの高さ
     */
    getHeight() {
        return this.areaHeight;
    }
}
