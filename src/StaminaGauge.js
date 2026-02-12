/**
 * @fileoverview スタミナゲージを定義するモジュール
 * @description 画面上に表示されるスタミナゲージUI
 * @version 1.0.0
 */

import { Container, Graphics, Text } from 'pixi.js';

/**
 * スタミナゲージクラス
 * @class StaminaGauge
 * @extends Container
 * @description スタミナの可視化ゲージ
 */
export class StaminaGauge extends Container {
    /**
     * StaminaGaugeクラスのコンストラクタ
     * @constructor
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} width - ゲージ幅
     * @param {number} height - ゲージ高さ
     */
    constructor(x, y, width = 200, height = 20) {
        super();

        /**
         * ゲージの幅
         * @type {number}
         * @private
         */
        this._width = width;

        /**
         * ゲージの高さ
         * @type {number}
         * @private
         */
        this._height = height;

        /**
         * 背景グラフィックス
         * @type {Graphics}
         * @private
         */
        this.background = null;

        /**
         * ゲージのグラフィックス
         * @type {Graphics}
         * @private
         */
        this.gauge = null;

        /**
         * 枠線のグラフィックス
         * @type {Graphics}
         * @private
         */
        this.border = null;

        /**
         * ラベルテキスト
         * @type {Text}
         * @private
         */
        this.label = null;

        /**
         * 現在のスタミナ（0.0～1.0）
         * @type {number}
         * @private
         */
        this.currentStamina = 1.0;

        /**
         * 前フレームのスタミナ（スムーズなアニメーション用）
         * @type {number}
         * @private
         */
        this.previousStamina = 1.0;

        /**
         * ゲージの色（状態別）
         * @type {Object}
         * @private
         */
        this.colors = {
            normal: 0x00ff00,      // 緑
            warning: 0xffaa00,     // オレンジ
            critical: 0xff0000,    // 赤
            depleted: 0x666666     // グレー（枯渇）
        };

        // 位置を設定
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
        // 背景
        this.background = new Graphics();
        this.background.rect(0, 0, this._width, this._height);
        this.background.fill(0x333333);
        this.addChild(this.background);

        // ゲージ
        this.gauge = new Graphics();
        this.addChild(this.gauge);

        // 枠線
        this.border = new Graphics();
        this.border.rect(0, 0, this._width, this._height);
        this.border.stroke({ color: 0xffffff, width: 2 });
        this.addChild(this.border);

        // ラベル
        // コンテナの幅・高さを明示的に設定
        this.width = this._width;
        this.height = this._height;

        this.label = new Text({
            text: 'Stamina',
            style: {
                fontFamily: 'DotGothic16Std-M, Arial, sans-serif',
                fontSize: 12,
                fill: 0xffffff,
                fontWeight: 'bold'
            }
        });
        this.label.x = 5;
        this.label.y = -20;
        this.addChild(this.label);

        this.updateGauge();
    }

    /**
     * スタミナを更新
     * @method setStamina
     * @param {number} stamina - 現在のスタミナ（0.0～maxStamina）
     * @param {number} maxStamina - スタミナの最大値
     */
    setStamina(stamina, maxStamina) {
        this.currentStamina = Math.max(0, Math.min(1.0, stamina / maxStamina));
        this.updateGauge();
    }

    /**
     * ゲージの表示を更新
     * @method updateGauge
     * @private
     */
    updateGauge() {
        this.gauge.clear();

        // スタミナの状態に応じて色を決定
        let gaugeColor;
        if (this.currentStamina <= 0) {
            gaugeColor = this.colors.depleted;
        } else if (this.currentStamina < 0.3) {
            gaugeColor = this.colors.critical;
        } else if (this.currentStamina < 0.7) {
            gaugeColor = this.colors.warning;
        } else {
            gaugeColor = this.colors.normal;
        }

        // ゲージを描画
        const gaugeWidth = this._width * this.currentStamina;
        this.gauge.rect(0, 0, gaugeWidth, this._height);
        this.gauge.fill(gaugeColor);
    }

    /**
     * ゲージの状態を取得
     * @method getStatus
     * @returns {{current: number, isCritical: boolean, isEmpty: boolean}} ゲージ状態
     */
    getStatus() {
        return {
            current: this.currentStamina,
            isCritical: this.currentStamina < 0.3,
            isEmpty: this.currentStamina <= 0
        };
    }

    /**
     * ゲージの色を設定
     * @method setColors
     * @param {Object} colors - 色設定オブジェクト
     */
    setColors(colors) {
        if (colors.normal) this.colors.normal = colors.normal;
        if (colors.warning) this.colors.warning = colors.warning;
        if (colors.critical) this.colors.critical = colors.critical;
        if (colors.depleted) this.colors.depleted = colors.depleted;
    }
}
