/**
 * @fileoverview スタミナ変動表示を定義するモジュール
 * @description スタミナの消費または回復をアニメーション表示
 * @version 1.0.0
 */

import { Container, Text } from 'pixi.js';

/**
 * スタミナ変動表示クラス
 * @class StaminaChangeDisplay
 * @extends Container
 * @description スタミナの変動をアニメーション表示
 */
export class StaminaChangeDisplay extends Container {
    /**
     * StaminaChangeDisplayクラスのコンストラクタ
     * @constructor
     * @param {number} x - X座標（ゲージの位置）
     * @param {number} y - Y座標（ゲージの位置）
     * @param {number} amount - スタミナの変動量
     * @param {Object} [options={}] - オプション設定
     * @param {number} [options.duration=1000] - 表示時間（ミリ秒）
     * @param {number} [options.fontSize=18] - フォントサイズ
     * @param {boolean} [options.isConsumption=false] - 消費ならtrue、回復ならfalse
     */
    constructor(x, y, amount, options = {}) {
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
         * 初期X座標（表示開始位置）
         * @type {number}
         * @private
         */
        this.startX = x;

        /**
         * 初期Y座標（表示開始位置）
         * @type {number}
         * @private
         */
        this.startY = y;

        /**
         * 変動量
         * @type {number}
         * @private
         */
        this.amount = amount;

        /**
         * 消費フラグ
         * @type {boolean}
         * @private
         */
        this.isConsumption = options.isConsumption === true;

        /**
         * フローティング距離
         * @type {number}
         * @private
         */
        this.floatDistance = 80;

        // 位置を設定
        this.x = x;
        this.y = y;

        // テキストカラーを決定
        const textColor = this.isConsumption ? '#FF6666' : '#66FF66'; // 消費は赤、回復は緑
        const symbolPrefix = this.isConsumption ? '−' : '+';

        // テキストを作成
        const textStyle = {
            fontFamily: 'DotGothic16Std-M, Arial, sans-serif',
            fontSize: options.fontSize || 18,
            fill: textColor,
            fontWeight: 'bold',
            align: 'center',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 3
        };

        const displayText = `${symbolPrefix}${Math.abs(amount).toFixed(1)}s`;
        this.textObject = new Text(displayText, textStyle);
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
        // デルタを秒に変換
        this.elapsed += delta * (1000 / 60);

        // 進捗率 (0.0～1.0)
        const progress = Math.min(this.elapsed / this.duration, 1.0);

        // Y座標を更新（上に浮かび上がる）
        this.y = this.startY - (this.floatDistance * progress);

        // アルファ値を更新（フェードアウト）
        this.alpha = 1.0 - progress;

        // X座標も少し移動（左右にのれん状に）
        const offsetX = Math.sin(progress * Math.PI) * 30; // -30～30の振動
        this.x = this.startX + offsetX;

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
