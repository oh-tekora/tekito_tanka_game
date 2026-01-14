/**
 * @fileoverview アプリケーションのエントリーポイント
 * @description PixiJSアプリケーションの初期化とゲーム画面の起動を行う
 * @version 2.0.0
 */

import { Application } from 'pixi.js';
import { Game } from './game.js';

/**
 * PixiJSアプリケーションの初期化クラス
 * @class Init
 * @description PixiJS Applicationのインスタンス生成と初期設定を管理する
 *              ウィンドウサイズに追従するレスポンシブ対応を含む
 */
class Init {
    /**
     * Initクラスのコンストラクタ
     * @constructor
     */
    constructor() {
        /**
         * PixiJSアプリケーションインスタンス
         * @type {Application|null}
         * @private
         */
        this.app = null;
    }

    /**
     * PixiJSアプリケーションのセットアップを実行
     * @async
     * @method setup
     * @returns {Promise<Application>} 初期化されたPixiJSアプリケーションインスタンス
     */
    async setup() {
        this.app = new Application();

        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: window
        });

        document.body.appendChild(this.app.canvas);

        window.addEventListener('resize', () => {
            this.onResize();
        });

        return this.app;
    }

    /**
     * ウィンドウリサイズ時のコールバック処理
     * @method onResize
     */
    onResize() {
        if (this.app) {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        }
    }

    /**
     * PixiJSアプリケーションインスタンスを取得
     * @method getApp
     * @returns {Application|null}
     */
    getApp() {
        return this.app;
    }
}

/**
 * アプリケーションのメインエントリーポイント
 */
(async () => {
    const init = new Init();
    const app = await init.setup();
    const game = new Game(app);

    app.stage.addChild(game);

    app.ticker.add((ticker) => {
        game.update(ticker.deltaTime);
    });
})();
