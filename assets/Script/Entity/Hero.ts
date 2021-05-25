

/*
 * @Autor: Rao
 * @Date: 2021-04-06 21:36:44
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-26 00:39:55
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ResMgr from "../Manager/ResMgr";
import EventMgr from "../Manager/EventMgr";
import BulletPool from "../NodePool/BulletPool";
import UIMgr from "../Manager/UIMgr";
import AudioMgr from "../Manager/AudioMgr";
import Global from "../Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hero extends GameComponent {
    private _Dir: cc.Vec2;
    private _velX: number;
    private _velY: number;
    private _aclY: number;

    private _life: number;
    private _hp: number;
    private _ack: number;
    private _score: number;
    private _isUltra: boolean = false;

    private _curExp: number;
    private _needExp: number;
    private _level: number;
    private _maxHp: number;

    private _anim: cc.Animation;
    private _scale: number;
    private _isRailColli: boolean;
    private _railNode: cc.Node = null;
    private _bulletType: number;

    private _isRight: boolean = true;

    private _moneyCount: number = 0;
    private _obstacleCount: number = 0;
    private _monsterCount: number = 0;

    // curSceneNode: cc.Node = null;

    props = {
        life: this._life,
        ack: this._ack,
        curExp: this._curExp,
        needExp: this._needExp,
        level: this._level,
        score: this._score,
    }
    listEvent() {
        return ['killMonster', 'reduceLife', 'saveInfo'];
    }
    onEvent(event, params) {
        if (event === 'killMonster') {
            this.killMonster(params);
        }
        else if (event === 'reduceLife') {
            this.life--;
            this.checkLife();
        }
        else if (event === 'saveInfo') {
            this.saveInfo();
        }
    }
    addScore(score: number) {
        this.score += score;
        if (this.score >= 200 && this.score <= 400) {
            this.bulletType = 2;
        }
        else if (this.score > 400) {
            this.bulletType = 3;
        }
    }

    killMonster(rewards) {
        this.monsterCount++;
        this.addScore(rewards.score);
        this.checkLevel(rewards.exp);

    }
    // reduceHp(mAck) {
    //     this.hp -= mAck;
    //     if (this.hp <= 0) {
    //         this.life--;
    //         this.checkLife();
    //     }
    // }
    checkLevel(exp) {
        this.curExp += exp;
        if (this.curExp >= this.needExp) {
            this.level++;
            this.curExp -= this.needExp;
            this.needExp *= 1.6;
            this.ack *= 1.2;
        }
    }
    checkLife() {
        if (this.life <= 0) {
            EventMgr.getInstance().EventDispatcher('playDiesAudio');
            let herodata = {
                'score': this.score,
                'moneyCount': this.moneyCount,
                'obstacleCount': this.obstacleCount,
                'monsterCount': this.monsterCount
            }
            cc.sys.localStorage.setItem('heroData', JSON.stringify(herodata));
            EventMgr.getInstance().EventDispatcher('gameover');
        }
    }
    saveInfo() {
        let heroInfo = {
            'level': this.level,
            'curExp': this.curExp,
            'needExp': this.needExp,
            'ack': this.ack,
            'life': this.life,
            'score': this.score,
        }
        cc.sys.localStorage.setItem('heroInfo', JSON.stringify(heroInfo));
    }
    onLoad() {
        GameComponent.prototype.onLoad.call(this);


        this.init();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // let curGameScene = cc.sys.localStorage.getItem('curGameScene');
        // this.curSceneNode = this.node.parent.getChildByName(curGameScene);
    }

    init() {
        let mapIndex = cc.sys.localStorage.getItem('curMapIndex');
        let heroConfig = null;
        if (mapIndex <= 1) {
            heroConfig = ResMgr.getInstance().getConfig('heroDt')[0];
        }
        else {
            heroConfig = JSON.parse(cc.sys.localStorage.getItem('heroInfo'));
        }
        for (const key in this.props) {
            this.props[key] = heroConfig[key];
        }

        this.node.x = 200;
        this.node.y = 200;
        this._velX = 0;
        this._velY = 0;
        this._aclY = -1280;
        this._Dir = cc.v2(0, -1);
        this._anim = this.getComponent(cc.Animation);
        this._anim.play('HeroNormal');
        this._scale = 1;
        this._isRailColli = false;
        this._maxHp = this.hp;
        this._bulletType = 1;
    }

    get dirX() {
        return this._Dir.x;
    }
    set dirX(num: number) {
        this._Dir.x = num;
    }

    get dirY() {
        return this._Dir.y;
    }
    set dirY(num: number) {
        this._Dir.y = num;
    }

    get life() {
        return this.props['life'];
    }
    set life(num: number) {
        this.props['life'] = num;
    }

    get hp() {
        return this.props['hp'];
    }
    set hp(num: number) {
        this.props['hp'] = num;
    }

    get ack() {
        return this.props['ack'];
    }
    set ack(num: number) {
        this.props['ack'] = num;
    }

    get bulletType() {
        return this._bulletType;
    }
    set bulletType(num: number) {
        this._bulletType = num;
    }

    get score() {
        return this.props['score'];
    }
    set score(num: number) {
        this.props['score'] = num;
    }

    get moneyCount() {
        return this._moneyCount;
    }
    set moneyCount(num: number) {
        this._moneyCount = num;
    }

    get obstacleCount() {
        return this._obstacleCount;
    }
    set obstacleCount(num: number) {
        this._obstacleCount = num;
    }

    get monsterCount() {
        return this._monsterCount;
    }
    set monsterCount(num: number) {
        this._monsterCount = num;
    }

    get aclY() {
        return this._aclY;
    }

    get velY() {
        return this._velY;
    }
    set velY(num: number) {
        this._velY = num;
    }

    get velX() {
        return this._velX;
    }
    set velX(num: number) {
        this._velX = num;
    }

    get needExp() {
        return this.props['needExp'];
    }
    set needExp(num: number) {
        this.props['needExp'] = num;
    }

    get curExp() {
        return this.props['curExp'];
    }
    set curExp(num: number) {
        this.props['curExp'] = num;
    }

    get level() {
        return this.props['level'];
    }
    set level(num: number) {
        this.props['level'] = num;
    }

    set isRight(rst: boolean) {
        this._isRight = rst;
    }
    get isRight() {
        return this._isRight;
    }

    update(dt) {
        this.updateVel(dt);
        this.updatePosition(dt);
        this.checkRailColli();
    }

    checkRailColli() {
        if (this._isRailColli) {
            let isLeave = Math.abs(this._railNode.x - this.node.x) > this._railNode.width / 2 + this.node.width * this._scale / 2;
            if (isLeave) {
                this.dirY = -1;
                this._isRailColli = false;
            }
        }
    }

    updateVel(dt) {
        this.velY += dt * this.aclY * this.dirY;
        if (this.velY < 0) {
            this.dirY = -1;
        }
    }

    updatePosition(dt) {
        this.node.y += this.velY * dt * this.dirY;
        this.node.x += this.velX * dt * this.dirX;
        // console.log(this.curSceneNode.y);
    }

    onCollisionEnter(other) {
        let colliName = other.node.group;
        if (colliName === 'ground') {
            this.velY = 0;
            this.dirY = 0;
            if (this.node.y - other.node.y <= this.node.height * this._scale / 2 + other.node.height / 2) {
                this.node.y = other.node.height / 2 + this.node.height * this._scale / 2 - 2;
            }
        }
        if (colliName === 'rail') {
            this.colliRail(other);
        }
        if (colliName === 'item') {
            this.colliItem(other);
        }
        if (colliName === 'obstacle') {
            this.colliObstacle(other);
        }
        if (colliName === 'money') {
            EventMgr.getInstance().EventDispatcher('playItemAudio');
            this.score += 30;
            this.moneyCount++;
            EventMgr.getInstance().EventDispatcher('updateScore', this.score);
        }
        if (colliName === 'monster') {
            this.life--;
            this.checkLife();
        }
    }
    onCollisionStay(other) {
        let colliName = other.node.group;
        if (colliName === 'ground') {
            this.dirY = 0;
            this.node.y = other.node.height / 2 + this.node.height * this.node.getScale(cc.v2()).x / 2 - 2;
        }
    }

    colliRail(other) {
        if (this.dirY === 1) {
            this.dirY = -1;
            this.dirX = 0;
        }
        else if (this.dirY === -1) {
            // Math.abs(other.node.x - this.node.x) < other.node.width/2+this.node.width*this._scale/2 - 2
            // 主角陷入rail中
            if (this.node.y <= other.node.y + (other.node.height / 2 + this.node.height * this._scale / 2)) {
                this.node.y = other.node.y + other.node.height / 2 + this.node.height * this._scale / 2 - 2;
                this.dirY = 0;
                this._railNode = other.node;
                this._isRailColli = true;
            }
            else {
                this.dirX = 0;
            }
        }
    }

    colliItem(other) {
        this.score += 30;
        EventMgr.getInstance().EventDispatcher('updateScore', this.score);
        EventMgr.getInstance().EventDispatcher('playItemAudio');
        let isRelaxScene = this.name === 'RelaxScene';
        if (isRelaxScene) {
            let type = other.node.name.substr(4);
            if (type === '1') {
                this.life++;
                EventMgr.getInstance().EventDispatcher('updateHeroLife');
            }
            else {
                this.node.scale = 1.8;
                this._scale = 1.8;
                this._isUltra = true;
                this.scheduleOnce(function () {
                    this.node.scale = 1;
                    this._scale = 1;
                    this._isUltra = false;
                    this.dirY = -1;
                }, 5);
            }
        }
        else {
            let itemTS = other.node.getComponent('Item');
            let type = other.node.name.substr(4);
            if (type === '1') {
                // life
                this.life += itemTS.buff;
            }
            else if (type === '2') {
                // ack   
                this.ack += itemTS.buff;
            }
            else if (type === '3') {
                // exp
                this.checkLevel(itemTS.buff);
            }
        }
    }

    colliObstacle(other) {
        if (this._isUltra) {
            this.obstacleCount++;
            this.score += 35;
            EventMgr.getInstance().EventDispatcher('updateScore', this.score);
            // EventMgr.getInstance().EventDispatcher('rotateObstacle', this.node.getPosition());
            EventMgr.getInstance().EventDispatcher('callFuncObstacle', {
                scene: 'RelaxScene', nodeName: other.node.name,
                tsName: 'Obstacle', funcName: 'rotateSelf', args: this.node.getPosition()
            });
            return;
        }
        this.life--;
        EventMgr.getInstance().EventDispatcher('updateHeroLife');
        this.checkLife();
    }

    jump() {
        if (this.dirY === 0) {
            this.velY = 800;
            this.dirY = 1;
        }
    }

    createBullet() {
        // let isRelaxScene = this.curSceneNode.name === 'RelaxScene';
        let isRelaxScene = this.node.parent.name === 'RelaxScene';
        if (isRelaxScene) {
            return;
        }
        let bulletN = BulletPool.getInstance().getBullet(this.bulletType);
        if (bulletN) {
            // this.curSceneNode.addChild(bulletN);
            this.node.parent.addChild(bulletN);
            bulletN.addComponent('Bullet');
            let bulletDir = this.isRight ? 1 : -1;
            bulletN.x = this.node.x + this.node.width / 2 * bulletDir;
            bulletN.y = this.node.y;
        }

    }

    changeAniamtion(isRight) {
        this.isRight = isRight;
        !this.isRight && this._anim.play('HeroTurnLeft');
        this.isRight && this._anim.play('HeroNormal');
    }

    showInfo() {
        let isRelaxScene = this.node.parent.name === 'RelaxScene';
        //let isRelaxScene = this.curSceneNode.name === 'RelaxScene';
        if (isRelaxScene) {
            return;
        }
        if (!cc.game.isPaused()) {
            this.saveInfo();
            EventMgr.getInstance().EventDispatcher('playPauseAudio');
            EventMgr.getInstance().EventDispatcher('openHeroInfoScene', { parentNode: this.node.parent, uiType: 'dialog' });
        }
    }

    onKeyDown(event) {
        
        switch (event.keyCode) {
            case cc.macro.KEY.d:
                this.velX = 200;
                this.dirX = 1;
                this.changeAniamtion(true);
                break;
            case cc.macro.KEY.a:
                this.velX = 250;
                this.dirX = -1;
                this.changeAniamtion(false);
                break;
            case cc.macro.KEY.j:
                this.createBullet();
                break;
            case cc.macro.KEY.space:
                this.jump();
                break;
            case cc.macro.KEY.i:
                this.showInfo();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.d:
                this.velX = 0;
                this.dirX = 0;
                break;
            case cc.macro.KEY.a:
                this._velX = 0;
                this.dirX = 0;
                break;
        }
    }

    onDestroy() {

        GameComponent.prototype.removeEvent.call(this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
