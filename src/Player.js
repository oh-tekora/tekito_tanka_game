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
         * 移動可能な最大X座標
         * @type {number}
         * @private
         */
        this.maxX = maxX;

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
         * 移動速度
         * @type {number}
         * @private
         */
        this.speed = 6.25;

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
            // 画像を読み込み
            const moveTexture = await Assets.load('/assets/大吾郎_からっぽ.png');
            const stopTexture = await Assets.load('/assets/大吾郎_停止_からっぽ.png');

            // スプライトを作成
            this.moveSprite = new Sprite(moveTexture);
            this.stopSprite = new Sprite(stopTexture);

            // アンカーを下中央に設定
            this.moveSprite.anchor.set(0.5, 1);
            this.stopSprite.anchor.set(0.5, 1);

            // スケールを調整（必要に応じて）
            const scale = 0.15;
            this.moveSprite.scale.set(scale);
            this.stopSprite.scale.set(scale);

            // 初期は停止スプライトを表示
            this.currentSprite = this.stopSprite;
            this.addChild(this.stopSprite);

            // 画像の幅を考慮して移動範囲を調整
            const halfWidth = this.getWidth() / 2;
            this.minX += halfWidth;
            this.maxX -= halfWidth;

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
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.leftPressed = true;
            } else if (event.key === 'ArrowRight') {
                this.rightPressed = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft') {
                this.leftPressed = false;
            } else if (event.key === 'ArrowRight') {
                this.rightPressed = false;
            }
        });
    }

    /**
     * フレーム更新処理
     * @method update
     * @param {number} delta - 前フレームからの経過時間（60FPS基準で1.0が標準）
     */
    update(delta) {
        this.isMoving = false;

        // 左右の移動処理
        if (this.leftPressed) {
            this.x -= this.speed * delta;
            this.lastDirection = 'left';
            this.isMoving = true;
        }
        if (this.rightPressed) {
            this.x += this.speed * delta;
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
        const halfWidth = this.getWidth() / 2;
        this.minX = minX + halfWidth;
        this.maxX = maxX - halfWidth;
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
}
