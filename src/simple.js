/**
 * @fileoverview シンプルなサンプルクラス
 * @description 基本的なクラス構造のサンプル
 * @version 1.0.0
 */

import { Container, Graphics } from 'pixi.js'

/**
 * シンプルなサンプルクラス
 * @class Simple
 * @extends Container
 * @description 基本的な図形を表示するシンプルなクラス
 */
export class Simple extends Container {
  /**
   * Simpleクラスのコンストラクタ
   * @constructor
   * @param {number} x - X座標
   * @param {number} y - Y座標
   */
  constructor(x, y) {
    super()

    this.x = x
    this.y = y

    this.init()
  }

  /**
   * 初期化処理
   * @method init
   * @private
   */
  init() {
    const graphics = new Graphics()
    graphics.rect(-25, -25, 50, 50)
    graphics.fill(0x66ccff)
    this.addChild(graphics)
  }
}
