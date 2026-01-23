/**
 * @fileoverview キャラクタークラスを定義するモジュール
 * @description タップ/クリック可能なキャラクターオブジェクト
 * @version 2.0.0
 */

import { Container, Graphics, Circle } from 'pixi.js';

/**
 * キャラクタークラス
 * @class Character
 * @extends Container
 * @description タップ/クリックに反応するキャラクターオブジェクト
 */
export class Character extends Container {
    /**
     * Characterクラスのコンストラクタ
     * @constructor
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} [size=50] - キャラクターのサイズ
     * @param {number} [color=0xff6b6b] - キャラクターの色
     */
    constructor(x, y, size = 50, color = 0xff6b6b) {
        super();

        /**
         * キャラクターのサイズ
         * @type {number}
         * @private
         */
        this.size = size;

        /**
         * キャラクターの色
         * @type {number}
         * @private
         */
        this.color = color;

        /**
         * グラフィックスオブジェクト
         * @type {Graphics}
         * @private
         */
        this.graphics = null;

        /**
         * X方向の速度
         * @type {number}
         * @private
         */
        this.vx = 0;

        /**
         * Y方向の速度
         * @type {number}
         * @private
         */
        this.vy = 0;

        this.x = x;
        this.y = y;

        this.init();
    }

    /**
     * 初期化処理
     * @method init
     * @private
     */
    init() {
        this.createGraphics();
    }

    /**
     * グラフィックスの作成
     * @method createGraphics
     * @private
     */
    createGraphics() {
        this.graphics = new Graphics();
        this.graphics.circle(0, 0, this.size);
        this.graphics.fill(this.color);
        this.addChild(this.graphics);
    }

    /**
     * フレーム更新処理
     * @method update
     * @param {number} delta - 前フレームからの経過時間
     */
    update(delta) {
        // 速度で位置を更新
        this.x += this.vx;
        this.y += this.vy;
    }
}
