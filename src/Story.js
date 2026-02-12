/**
 * @fileoverview Story screen
 */

import { Container, Graphics, Text, Sprite, Assets } from 'pixi.js';

const UI_FONT = 'DotGothic16Std-M, Arial, sans-serif';

export class Story extends Container {
    constructor(app, onComplete = null) {
        super();

        this.app = app;
        this.onComplete = onComplete;

        this.eventMode = 'static';

        this.daigorouSprite = null;
        this.textBox = null;
        this.messageText = null;
        this.promptText = null;
        
        // ストーリーのメッセージリスト
        this.messages = [
            '俺は大吾郎。\n見ての通りイケイケな恐竜だぜ',
            'もうすぐバレンタインだな\n俺みたいなモテ恐竜はチョコをもらうだけでも\n大変だぜ',
            'そこでヒマそうなお前に協力して欲しいんだ\n矢印キーで俺を操作して\n上から降ってくるチョコを集めてくれ！',
            '上キーでジャンプ、\nスペースキーを押しながら矢印キーを押すと\nダッシュができるぜ',
            'ダッシュはスタミナを消費する\nスタミナが切れると回復するまで\n移動速度が落ちてしまうから注意だ',
            '一回練習してから\nチョコをもらいにいくとするか！'
        ];
        
        this.currentMessageIndex = 0;
        this.isTyping = false; // タイプ中かどうか
        this.typingIndex = 0; // 現在表示している文字数
        this.typingSpeed = 50; // 文字表示の間隔（ミリ秒）
        this.typingIntervalId = null; // setIntervalのID
        
        this.init();

        // Enterキーでメッセージ送り
        this.keydownHandler = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.keydownHandler);

        window.addEventListener('resize', () => {
            this.layout();
        });
    }

    async init() {
        // 背景
        const background = new Graphics();
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.fill(0xFED4E4);
        this.addChild(background);

        try {
            // 大吾郎背面画像を読み込み
            const texture = await Assets.load('/assets/daigorou_haimen.png');
            this.daigorouSprite = new Sprite(texture);
            this.daigorouSprite.anchor.set(0.5);
            this.addChild(this.daigorouSprite);
        } catch (e) {
            console.error('Failed to load daigorou_haimen.png:', e);
        }

        // テキストボックス（下部）
        this.textBox = new Graphics();
        this.addChild(this.textBox);

        // メッセージテキスト
        this.messageText = new Text({
            text: '',
            style: {
                fontFamily: UI_FONT,
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0x000000,
                wordWrap: true,
                wordWrapWidth: 700,
                lineHeight: 32
            }
        });
        this.addChild(this.messageText);

        // プロンプトテキスト（Enterで進む表示）
        this.promptText = new Text({
            text: '▼ Enter',
            style: {
                fontFamily: UI_FONT,
                fontSize: 18,
                fill: 0x666666
            }
        });
        this.addChild(this.promptText);

        this.layout();
        this.showMessage(0);
    }

    layout() {
        try {
            const centerX = this.app.screen.width / 2;
            const centerY = this.app.screen.height / 2;

            // 大吾郎の位置（画面中央上寄り）
            if (this.daigorouSprite) {
                this.daigorouSprite.x = centerX;
                this.daigorouSprite.y = centerY - 100;
                
                // サイズ調整
                const maxHeight = 300;
                if (this.daigorouSprite.height > maxHeight) {
                    const scale = maxHeight / this.daigorouSprite.height;
                    this.daigorouSprite.scale.set(scale);
                }
            }

            // テキストボックス（画面下部）
            const boxWidth = 800;
            const boxHeight = 180;
            const boxX = centerX - boxWidth / 2;
            const boxY = this.app.screen.height - boxHeight - 40;

            if (this.textBox) {
                this.textBox.clear();
                this.textBox.rect(boxX, boxY, boxWidth, boxHeight);
                this.textBox.fill(0xffffff);
                this.textBox.stroke({ color: 0xB47261, width: 4 });
            }

            // メッセージテキスト
            if (this.messageText) {
                this.messageText.style.wordWrapWidth = boxWidth - 40;
                this.messageText.x = boxX + 20;
                this.messageText.y = boxY + 20;
            }

            // プロンプトテキスト
            if (this.promptText) {
                this.promptText.x = boxX + boxWidth - this.promptText.width - 20;
                this.promptText.y = boxY + boxHeight - this.promptText.height - 10;
            }
        } catch (e) {
            console.error('Layout error:', e);
        }
    }

    showMessage(index) {
        if (index >= 0 && index < this.messages.length && this.messageText) {
            // 既存のタイプライター処理を停止
            if (this.typingIntervalId) {
                clearInterval(this.typingIntervalId);
                this.typingIntervalId = null;
            }
            
            this.isTyping = true;
            this.typingIndex = 0;
            this.messageText.text = '';
            
            const currentMessage = this.messages[index];
            
            // タイプライター効果
            this.typingIntervalId = setInterval(() => {
                if (this.typingIndex < currentMessage.length) {
                    this.typingIndex++;
                    this.messageText.text = currentMessage.substring(0, this.typingIndex);
                } else {
                    clearInterval(this.typingIntervalId);
                    this.typingIntervalId = null;
                    this.isTyping = false;
                }
            }, this.typingSpeed);
        }
    }

    stopTyping() {
        if (this.typingIntervalId) {
            clearInterval(this.typingIntervalId);
            this.typingIntervalId = null;
        }
        this.isTyping = false;
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            // タイプ中ならスキップして全文表示
            if (this.isTyping) {
                this.stopTyping();
                const currentMessage = this.messages[this.currentMessageIndex];
                this.messageText.text = currentMessage;
                return;
            }
            
            // 次のメッセージへ
            this.currentMessageIndex++;
            
            if (this.currentMessageIndex >= this.messages.length) {
                // すべてのメッセージ表示完了
                this.cleanup();
                if (typeof this.onComplete === 'function') {
                    this.onComplete();
                }
            } else {
                // 次のメッセージを表示
                this.showMessage(this.currentMessageIndex);
            }
        }
    }

    cleanup() {
        window.removeEventListener('keydown', this.keydownHandler);
        this.stopTyping();
    }

    destroy(options) {
        this.cleanup();
        super.destroy(options);
    }
}
