/**
 * @fileoverview ゲームのメイン画面を担当するモジュール
 * @description ゲームのステージとして機能し、キャラクターを配置・管理する
 * @version 2.0.0
 */

import { Container, Graphics } from 'pixi.js';
import { Character } from './character.js';

/**
 * ゲームのメイン画面クラス
 * @class Game
 * @extends Container
 * @description ゲームのステージとして機能するコンテナクラス
 */
export class Game extends Container {
    /**
     * Gameクラスのコンストラクタ
     * @constructor
     * @param {Application} app - PixiJSアプリケーションインスタンス
     */
    constructor(app) {
        super();

        /**
         * PixiJSアプリケーションインスタンスへの参照
         * @type {Application}
         * @private
         */
        this.app = app;

        /**
         * 背景グラフィックスオブジェクト
         * @type {Graphics}
         * @private
         */
        this.background = null;

        /**
         * キャラクターインスタンス
         * @type {Character}
         * @private
         */
        this.character = null;

        /**
         * 全キャラクターの配列
         * @type {Character[]}
         * @private
         */
        this.characters = [];

        /**
         * ドラッグ中のキャラクター
         * @type {Character|null}
         * @private
         */
        this.draggedCharacter = null;

        /**
         * 現在のポインター位置（グローバル座標）
         * @type {{x: number, y: number}}
         * @private
         */
        this.currentPointerPos = { x: 0, y: 0 };

        this.init();
    }

    /**
     * 初期化処理を実行
     * @method init
     * @private
     */
    init() {
        this.sortableChildren = true;
        
        // イベント処理を有効にする
        this.eventMode = 'static';

        this.setupBackground();
        this.setupCharacter();
        this.setupPointerEvents();

        // Stage レベルでもイベントをリッスンしてデバッグ
        this.app.stage.on('pointerdown', (event) => {
            console.log('Stage: PointerDown イベント発火');
        });

        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    /**
     * 背景のセットアップ
     * @method setupBackground
     * @private
     */
    setupBackground() {
        this.background = new Graphics();
        this.drawBackground();
        // 背景のイベントを通す設定
        this.background.eventMode = 'none';
        this.addChild(this.background);
    }

    /**
     * 背景を描画
     * @method drawBackground
     * @private
     */
    drawBackground() {
        this.background.clear();
        this.background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        this.background.fill(0x1099bb);
    }

    /**
     * キャラクターのセットアップ
     * @method setupCharacter
     * @private
     */
    setupCharacter() {
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;

        // 赤い円
        const redCircle = new Character(centerX - 150, centerY, 100, 0xff0000);
        redCircle.vx = 2;
        redCircle.vy = 1;
        this.addChild(redCircle);
        this.characters.push(redCircle);

        // 緑の円
        const greenCircle = new Character(centerX + 150, centerY, 100, 0x00ff00);
        greenCircle.vx = -2;
        greenCircle.vy = -1;
        this.addChild(greenCircle);
        this.characters.push(greenCircle);

        // 青い円（既存）
        this.character = new Character(centerX, centerY, 100, 0x0000ff);
        this.character.vx = 0;
        this.character.vy = 2;
        this.addChild(this.character);
        this.characters.push(this.character);
    }

    /**
     * ポインターイベントのセットアップ
     * @method setupPointerEvents
     * @private
     */
    setupPointerEvents() {
        // ポインターダウン時：どのキャラクターがクリックされたかを判定
        this.on('pointerdown', (event) => {
            console.log('PointerDown イベント発火');
            const globalPos = event.global;
            const localPos = this.toLocal(globalPos);
            console.log('グローバル座標:', globalPos.x, globalPos.y);
            console.log('ローカル座標:', localPos.x, localPos.y);
            
            for (const character of this.characters) {
                const distance = Math.sqrt(
                    Math.pow(localPos.x - character.x, 2) +
                    Math.pow(localPos.y - character.y, 2)
                );
                console.log(`キャラクター at (${character.x}, ${character.y}), サイズ: ${character.size}, 距離: ${distance}`);
                
                if (distance <= character.size) {
                    this.draggedCharacter = character;
                    
                    // 色をHEX値から名前に変換
                    const colorMap = {
                        0xff0000: '赤',
                        0x00ff00: '緑',
                        0x0000ff: '青'
                    };
                    const colorName = colorMap[character.color] || '不明';
                    console.log(`PointerDown: ${colorName}の円がクリックされました`);
                    break;
                }
            }
        });

        // ポインタームーブ時：ポインター位置を記録
        this.on('pointermove', (event) => {
            this.currentPointerPos.x = event.global.x;
            this.currentPointerPos.y = event.global.y;
        });

        // ポインターアップ時：ドラッグを終了
        this.on('pointerup', () => {
            if (this.draggedCharacter) {
                console.log('PointerUp: キャラクターが離されました');
                this.draggedCharacter = null;
            }
        });

        // ポインターアップアウトサイド時：ウィンドウの外に出た場合もドラッグを終了
        this.on('pointerupoutside', () => {
            if (this.draggedCharacter) {
                console.log('PointerUpOutside: キャラクターが離されました');
                this.draggedCharacter = null;
            }
        });
    }

    /**
     * ウィンドウリサイズ時のコールバック処理
     * @method onResize
     */
    onResize() {
        this.drawBackground();
    }

    /**
     * フレーム更新処理
     * @method update
     * @param {number} delta - 前フレームからの経過時間（60FPS基準で1.0が標準）
     */
    update(delta) {
        // 各キャラクターを更新
        for (const character of this.characters) {
            // ドラッグ中でないキャラクターのみ更新
            if (character !== this.draggedCharacter) {
                character.update(delta);
                
                // 画面端との衝突判定と反発処理
                this.checkScreenCollision(character);
            }
        }

        // ドラッグ中のキャラクターを毎フレーム更新
        if (this.draggedCharacter) {
            const localPos = this.toLocal(this.currentPointerPos);
            this.draggedCharacter.x = localPos.x;
            this.draggedCharacter.y = localPos.y;
            // ドラッグ中は速度をリセット
            this.draggedCharacter.vx = 0;
            this.draggedCharacter.vy = 0;
        }

        // 当たり判定を処理（すべてのキャラクター同士）
        for (let i = 0; i < this.characters.length; i++) {
            for (let j = i + 1; j < this.characters.length; j++) {
                this.checkCollision(this.characters[i], this.characters[j]);
            }
        }

        if (this.character) {
            this.character.update(delta);
        }
    }

    /**
     * 画面端との衝突判定と反発処理
     * @method checkScreenCollision
     * @param {Character} character - キャラクター
     * @private
     */
    checkScreenCollision(character) {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
        
        // 左端の壁
        if (character.x - character.size <= 0) {
            character.x = character.size;
            character.vx = Math.abs(character.vx);
        }
        
        // 右端の壁
        if (character.x + character.size >= screenWidth) {
            character.x = screenWidth - character.size;
            character.vx = -Math.abs(character.vx);
        }
        
        // 上端の壁
        if (character.y - character.size <= 0) {
            character.y = character.size;
            character.vy = Math.abs(character.vy);
        }
        
        // 下端の壁
        if (character.y + character.size >= screenHeight) {
            character.y = screenHeight - character.size;
            character.vy = -Math.abs(character.vy);
        }
    }

    /**
     * 2つのキャラクター間の衝突判定と反射処理
     * @method checkCollision
     * @param {Character} char1 - キャラクター1
     * @param {Character} char2 - キャラクター2
     * @private
     */
    checkCollision(char1, char2) {
        // 2つの円の中心間の距離を計算
        const dx = char2.x - char1.x;
        const dy = char2.y - char1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 2つの円が接触しているかチェック（円全体での判定）
        const minDistance = char1.size + char2.size;
        if (distance < minDistance + 2 && distance > 0.1) {
            // 正規化された衝突法線ベクトル（char1からchar2へ向かう方向）
            const nx = dx / distance;
            const ny = dy / distance;
            
            // 衝突接線ベクトル
            const tx = -ny;
            const ty = nx;
            
            // 各キャラクターの速度を衝突法線と接線成分に分解
            const v1n = char1.vx * nx + char1.vy * ny;  // char1 の法線成分
            const v1t = char1.vx * tx + char1.vy * ty;  // char1 の接線成分
            const v2n = char2.vx * nx + char2.vy * ny;  // char2 の法線成分
            const v2t = char2.vx * tx + char2.vy * ty;  // char2 の接線成分
            
            // 既に離れている場合はスキップ
            if (v1n - v2n > 0.01) {
                return;
            }
            
            // 反発係数（完全弾性衝突の場合は1.0）
            const restitution = 0.95;
            
            // どちらかがドラッグ中かチェック
            const char1Dragging = char1 === this.draggedCharacter;
            const char2Dragging = char2 === this.draggedCharacter;
            
            if (!char1Dragging && !char2Dragging) {
                // どちらもドラッグ中でない場合：通常の衝突処理
                const v1n_new = (v1n * (1 - restitution) + v2n * (1 + restitution)) / 2;
                const v2n_new = (v2n * (1 - restitution) + v1n * (1 + restitution)) / 2;
                
                char1.vx = v1n_new * nx + v1t * tx;
                char1.vy = v1n_new * ny + v1t * ty;
                char2.vx = v2n_new * nx + v2t * tx;
                char2.vy = v2n_new * ny + v2t * ty;
                
                // 両者で補正を分け合う
                const separationDistance = minDistance + 2;
                const moveDistance = (separationDistance - distance) / 2 + 1;
                
                char1.x -= moveDistance * nx;
                char1.y -= moveDistance * ny;
                char2.x += moveDistance * nx;
                char2.y += moveDistance * ny;
            } else if (char1Dragging && !char2Dragging) {
                // char1 がドラッグ中：char2 を完全に押し出す
                char2.vx = -v2n * nx + v2t * tx;
                char2.vy = -v2n * ny + v2t * ty;
                
                const separationDistance = minDistance + 2;
                const moveDistance = separationDistance - distance + 1;
                
                char2.x += moveDistance * nx;
                char2.y += moveDistance * ny;
            } else if (!char1Dragging && char2Dragging) {
                // char2 がドラッグ中：char1 を完全に押し出す
                char1.vx = -v1n * nx + v1t * tx;
                char1.vy = -v1n * ny + v1t * ty;
                
                const separationDistance = minDistance + 2;
                const moveDistance = separationDistance - distance + 1;
                
                char1.x -= moveDistance * nx;
                char1.y -= moveDistance * ny;
            }
        }
    }
}
