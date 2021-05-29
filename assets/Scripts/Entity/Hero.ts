/*
 * @Autor: Rao
 * @Date: 2021-04-06 21:36:44
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-28 22:47:24
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
    private _isRight: boolean = true;   // hero朝向
    private _moneyCount: number = 0;
    private _obstacleCount: number = 0;
    private _monsterCount: number = 0;
    private _isRevive:boolean = false;   // 是否刚刚复活？为了应对map>2时玩家重新生成时的heroInfo初始化问题
    // curSceneNode: cc.Node = null;
    // rigidBody:cc.RigidBody=null;

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
            this.saveData();
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
            this.needExp *= 2;
            this.ack *= 2;
            EventMgr.getInstance().EventDispatcher('playLevelUpAudio');
        }
    }
    
    checkLife() {
        if (this.life <= 0) {
            EventMgr.getInstance().EventDispatcher('playDiesAudio');
            this.saveData();
            EventMgr.getInstance().EventDispatcher('gameover');
        }
        else {
            // 生命>0, 死亡后重新开始，但是不进入结算界面。
            // 难点：玩家信息如何处理。如果玩家此时在map2，重新开始地图还是map2，而onLoad里的heroInfo就会是undefined
            // 方法：判断玩家是否是刚刚复活过
            Global.isHeroRevive = true;
            // 难点： 死亡后，攻击和等级都要归0，但是积分等成就不应该归0，需要在结算界面加起来。
            // 方法： 死亡后，将heroData再存一次。复活时在重新读取。
            this.saveData();
            let sceneName = this.node.parent.name;
            let scenePrefix = sceneName.substr(0, sceneName.length-5);
            EventMgr.getInstance().EventDispatcher('open'+scenePrefix+'Scene', {'curNode': this.node.parent});
        }
    }
    
    // data是玩家复活（未回到菜单界面）时一直需要存在的。
    saveData() {
        Global.heroData = {
            'score': this.score,
            'moneyCount': this.moneyCount,
            'obstacleCount': this.obstacleCount,
            'monsterCount': this.monsterCount,
            'life': this.life
        }
        // localStorage存储的数据在下次游戏开始时依然存在。所以不能在此处用。但是可以用来持久化存储
        // cc.sys.localStorage.setItem('heroData', JSON.stringify(herodata));
    }

    restoreData(data) {
        this.score = data.score;
        this.moneyCount = data.moneyCount;
        this.obstacleCount = data.obstacleCount;
        this.monsterCount = data.monsterCount;
        this.life = data.life;
    }

    // Info是玩家在换一个关卡时需要的。
    saveInfo() {
        Global.heroInfo = {
            'level': this.level,
            'curExp': this.curExp,
            'needExp': this.needExp,
            'ack': this.ack,
            'life': this.life,
            'score': this.score,
            
        }
        // cc.sys.localStorage.setItem('heroInfo', JSON.stringify(heroInfo));
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
        let isRelaxScene = this.node.parent.name === 'RelaxScene';
        let mapIndex = Global.curMapIndex;
        let heroConfig = ResMgr.getInstance().getConfig('heroDt')[0];
        for (const key in this.props) {
            this.props[key] = heroConfig[key];
        }
        if (isRelaxScene) {
            if (Global.isHeroRevive) {
                // 玩家刚刚复活，积分等数据要恢复
                Global.isHeroRevive = false;
                let heroData = Global.heroData;
                this.restoreData(heroData);
            }
        }
        else {
            let heroData = Global.heroData;
            if (Global.isHeroRevive) {
                // 复活后重新生成hero
                Global.isHeroRevive = false;
                this.restoreData(heroData);  
            }
            else if(!Global.isHeroRevive && mapIndex > 1){
                // 转换关卡后重新生成hero
                heroConfig = Global.heroInfo;
                for (const key in this.props) {
                    this.props[key] = heroConfig[key];
                }
                this.restoreData(heroData);
                // 修复转换关卡后刚生成hero时hero的子弹类型为1的Bug
                this.addScore(0);
            }
        }
        
        this.node.x = cc.winSize.width*0.15;
        this.node.y = cc.winSize.height*0.15;
        this._velX = 0;
        this._velY = 0;
        this._aclY = -980;
        this._Dir = cc.v2(0, -1);
        this._anim = this.getComponent(cc.Animation);
        this._anim.play('HeroNormal');
        this._scale = this.node.scale;
        this._isRailColli = false;
        this._maxHp = this.hp;
        this._bulletType = 1;

        // this.rigidBody = this.node.getComponent(cc.RigidBody);
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

    set isRevive(rst:boolean) {
        this._isRevive = rst;
    }
    get isRevive() {
        return this._isRevive;
    } 

    update(dt) {
        this.updateVel(dt);
        this.updatePosition(dt);
        this.checkRailColli();
        this.curTime++;
    }

    // 当玩家跳上Rail后，onColliEnter只会刚开始时执行一次。
    checkRailColli() {
        if (this._isRailColli) {
            // 加10是因为判断是否离开rail判断的是脚和rail的接触，而不是整个hero图片和rail的距离
            let isLeave = Math.abs(this._railNode.x - this.node.x) + 10 > this._railNode.width / 2 + this.node.width * this._scale / 2;
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

        // x方向的边缘判断。之所以不判断Y轴，是因为没必要。休闲模式中hero跳不到那么高，冒险 模式中直接进入下一关
        // TODO: 冒险模式增加一个倒数时钟，在规定时间内没有过关的将损失一条生命。
        if (this.node.x <= this.node.width/2) {
            this.node.x = this.node.width/2;
        }
        else if (this.node.x >= cc.winSize.width-this.node.width/2) {
            this.node.x = cc.winSize.width-this.node.width/2
        }
    }

    onCollisionEnter(other, self) {
        let colliName = other.node.group;
        if (colliName === 'ground') {
            this.velY = 0;
            this.dirY = 0;
            if (this.node.y - other.node.y <= this.node.height * this._scale / 2 + other.node.height / 2) {
                // 减2是因为hero的图片底部和脚的底部有一点距离
                this.node.y = other.node.y + other.node.height / 2 + this.node.height * this._scale / 2 - 2;
            }
        }
        if (colliName === 'rail') {
            this.colliRail(other, self);
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
    
    // onCollisionStay(other) {
    //     let colliName = other.node.group;
    //     if (colliName === 'ground') {
    //         this.dirY = 0;
    //         // this.node.y = other.node.height / 2 + this.node.height * this.node.getScale(cc.v2()).x / 2 - 2;
    //         //this.node.y = other.node.y + other.node.height / 2 + this.node.height * this._scale / 2 - 2;
    //     }
    //     if (colliName === 'rail') 
    //     console.log('onCollisionstay');
    // }

    // onCollisionExit(other) {
    //     let colliName = other.node.group;
    //     if (colliName === 'rail') 
    //     console.log('onCollisionExit');
    // }

    colliRail(other, self) {
        /*if (this.dirY === 1) {
            this.dirY = -1;
            this.dirX = 0;
        }
        else if (this.dirY === -1) {
            // Math.abs(other.node.x - this.node.x) < other.node.width/2+this.node.width*this._scale/2 - 2
            // 主角陷入rail中
            if (this.node.y <= other.node.y + (other.node.height / 2 + this.node.height * this._scale / 2) + 5) {
                this.node.y = other.node.y + other.node.height / 2 + this.node.height * this._scale / 2 - 2;
                this.dirY = 0;
                this._railNode = other.node;
                this._isRailColli = true;
            }
            else {
                this.dirX = 0;
            }
        }*/

        // 碰撞体的tag为0，表示是头部；否则则为脚
        let tag = self.tag;
        if (tag === 0) {
            this.dirY = -1;
        }
        else {
            if (true || this.node.y <= other.node.y + (other.node.height / 2 + this.node.height * this._scale / 2) - 3) {
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
        let isRelaxScene = this.node.parent.name === 'RelaxScene';
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
                }, 3.5);
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
            this.velY = 680;
            this.dirY = 1;
        }

        // let vel = this.rigidBody.linearVelocity;
        // vel.y = 800;
        // this.rigidBody.linearVelocity = vel;

    }

    // walk(dirX) {
    //     let vel = this.rigidBody.linearVelocity;
    //     vel.x = dirX*200;
    //     this.rigidBody.linearVelocity = vel;
    // }
    createBulletIntervel:number = 30;
    curTime:number = 60;
    createBullet() {
        // 使用curSceneNode时我是把hero放在游戏父节点Game节点下。目前它是挂在Game节点的子节点下
        // let isRelaxScene = this.curSceneNode.name === 'RelaxScene';
        let isRelaxScene = this.node.parent.name === 'RelaxScene';
        if (isRelaxScene) {
            return;
        }

        // 子弹生成间隔时间
        if(this.curTime <= this.createBulletIntervel) {
            return;
        }
        this.curTime = 0; 
        
        //let bulletN = BulletPool.getInstance().getBullet(this.bulletType);
        let bulletN = cc.instantiate(ResMgr.getInstance().getPrefab('Bullet'+this.bulletType));
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
                Global.heroDirX = 1;
                this.changeAniamtion(true);
                // this.walk(1)
                break;
            case cc.macro.KEY.a:
                this.velX = 280;
                this.dirX = -1;
                Global.heroDirX = -1;
                this.changeAniamtion(false);
                // this.walk(-1);
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
                // this.walk(0);
                break;
            case cc.macro.KEY.a:
                this._velX = 0;
                this.dirX = 0;
                // this.walk(0);
                break;
        }
    }

    onDestroy() {
        GameComponent.prototype.removeEvent.call(this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
