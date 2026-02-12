/**
 * @fileoverview アプリケーションのエントリーポイント
 * @description PixiJSアプリケーションの初期化とゲーム画面の起動を行う
 * @version 2.0.0
 */

import { Application } from 'pixi.js';
import { Game } from './game.js';
import { Opening } from './Opening.js';
import { Ending } from './Ending.js';
import { Instructions } from './Instructions.js';

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
    let currentScene = null;

    const loadFonts = async () => {
        if (!document.fonts || !document.fonts.load) {
            return;
        }
        try {
            await document.fonts.load('16px "DotGothic16Std-M"');
            await document.fonts.ready;
        } catch (error) {
            console.warn('Font loading failed:', error);
        }
    };

    const setScene = (scene) => {
        if (currentScene) {
            app.stage.removeChild(currentScene);
            if (typeof currentScene.destroy === 'function') {
                currentScene.destroy({ children: true });
            }
        }
        currentScene = scene;
        app.stage.addChild(currentScene);
    };

    const showOpening = () => {
        const opening = new Opening(app, () => {
            showGame();
        }, () => {
            showInstructions();
        });
        setScene(opening);
    };

    const showInstructions = () => {
        const instructions = new Instructions(app, () => {
            showOpening();
        }, () => {
            showGame();
        });
        setScene(instructions);
    };

    const showGame = () => {
        const game = new Game(app, (result) => {
            showEnding(result);
        });
        game.start();
        setScene(game);
    };

    const showEnding = (result) => {
        const ending = new Ending(app, result.score, () => {
            showGame();
        });
        setScene(ending);
    };

    await loadFonts();
    showOpening();

    app.ticker.add((ticker) => {
        if (currentScene && typeof currentScene.update === 'function') {
            currentScene.update(ticker.deltaTime);
        }
    });
})();
