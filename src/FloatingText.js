/**
 * @fileoverview フローティングテキストを定義するモジュール
 * @description 画面上に浮かび上がるテキスト（ポイント表示用）
 * @version 1.0.0
 */

import { Container, Text } from 'pixi.js';

/**
 * フローティングテキストクラス
 * @class FloatingText
 * @extends Container
 * @description 上に浮かび上がるアニメーション付きテキスト
 */
export class FloatingText extends Container {
    /**
     * FloatingTextクラスのコンストラクタ
     * @constructor
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {string} text - 表示するテキスト
     * @param {Object} [options={}] - オプション設定
     * @param {number} [options.duration=1000] - 表示時間（ミリ秒）
     * @param {number} [options.fontSize=32] - フォントサイズ
     * @param {string} [options.color='#FFD700'] - テキスト色
     * @param {number} [options.floatDistance=80] - 浮かび上がる距離
     */
    constructor(x, y, text, options = {}) {
        super();

        /**
         * 表示時間（ミリ秒）
         * @type {number}
         * @private
         */
        this.duration = options.duration || 1000;

        /**
         * 経過時間（ミリ秒）
         * @type {number}
         * @private
         */
        this.elapsed = 0;

        /**
         * 浮かび上がる距離
         * @type {number}
         * @private
         */
        this.floatDistance = options.floatDistance || 80;

        /**
         * 初期Y座標
         * @type {number}
         * @private
         */
        this.startY = y;

        // 位置を設定
        this.x = x;
        this.y = y;

        // テキストを作成
        const textStyle = {
            fontFamily: 'DotGothic16Std-M, Arial, sans-serif',
            fontSize: options.fontSize || 32,
            fill: options.color || '#FFFFFF',
            fontWeight: 'bold',
            align: 'center',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 3
        };

        this.textObject = new Text(text, textStyle);
        this.textObject.anchor.set(0.5, 0.5);
        this.addChild(this.textObject);
    }

    /**
     * フレーム更新
     * @method update
     * @param {number} delta - フレームデルタ
     * @returns {boolean} 表示継続中ならtrue、終了ならfalse
     */
    update(delta) {
        // デルタは60FPS基準で、1フレームが1.0
        // ミリ秒に変換（16.67ms per frame at 60FPS）
        this.elapsed += delta * (1000 / 60);

        // 進捗率 (0.0～1.0)
        const progress = Math.min(this.elapsed / this.duration, 1.0);

        // Y座標を更新（上に浮かび上がる）
        this.y = this.startY - (this.floatDistance * progress);

        // アルファ値を更新（フェードアウト）
        this.alpha = 1.0 - progress;

        // 表示時間を超えたらfalseを返す
        return progress < 1.0;
    }

    /**
     * 使用済みかどうかを判定
     * @method isFinished
     * @returns {boolean} 表示が終了していればtrue
     */
    isFinished() {
        return this.elapsed >= this.duration;
    }
}
