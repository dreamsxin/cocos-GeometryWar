/*
 * @Autor: Rao
 * @Date: 2021-05-02 15:58:40
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-19 14:25:49
 * @Description: 
 */

import ResMgr from "../Manager/ResMgr";
import EventMgr from "../Manager/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends cc.Component {

    private _Dir: cc.Vec2;
    private _velX: number;
    private _velY: number;
    private _aclY: number;
    private _walkLen: number;   
    private _edgeLeft: number;  // 怪物可以行走的左边界
    private _edgeRight: number;

    private _life: number;
    private _hp: number;
    private _ack: number;
    private _exp: number;
    private _score:number;

    props = {
        life: this._life,
        hp: this._hp,
        ack: this._ack,
        exp: this._exp,
        score: this._score,
    }
    
    onLoad () {
        let monsterConfigs = ResMgr.getInstance().getConfig('monsterDt');
        let index = this.node.name.substr(7);
        let monsterConfig = monsterConfigs[parseInt(index)];
        this.init(monsterConfig); 
    }

    init(monsterConfig) {
        for (const key in this.props) {
            this.props[key] = monsterConfig[key];
        }
        this._Dir = cc.v2(-1,-1);
        this._aclY = 980;
        this._velY = 0;
        this._velX = 83;
        this._edgeLeft = 0;
        this._edgeRight = 0;
    }

    get dirX() {
        return this._Dir.x;
    }
    set dirX(num:number) {
        this._Dir.x = num;
    }

    get dirY() {
        return this._Dir.y;
    }
    set dirY(num:number) {
        this._Dir.y = num;
    }

    get aclY() {
        return this._aclY;
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

    get score() {
        return this.props['score'];
    }
    set score(num: number) {
        this.props['score'] = num;
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

    get exp() {
        return this.props['exp'];
    }

    set walkLen(num: number) {
        this._walkLen = num;
    }
    get walkLen() {
        return this._walkLen;
    }

    onCollisionEnter(other) {
        let colliName = other.node.group;
        if(colliName === 'ground' || colliName === 'rail') {
            this.velY = 0;
            this.dirY = 0;
            this._edgeLeft = other.node.x - other.node.width/2;
            this._edgeRight = other.node.x + other.node.width/2;
            if (this.node.y - other.node.y <= this.node.height/2 + other.node.height/2) {
                this.node.y = other.node.y + other.node.height/2+this.node.height/2 - 2;
            } 
        }
        if (colliName === 'bullet') {
            let bulletTs = other.node.getComponent('Bullet');
            let bulletAck = bulletTs.ack;
            console.log(bulletAck + "," +this.life);
            this.life -= bulletAck;
            if (this.life <= 0) {
                EventMgr.getInstance().EventDispatcher('killMonster', {'exp':this.exp, 'score': this.score});
                this.node.destroy();
            }
        }
    }
    
    onCollisionStay(other) {
        let colliName = other.node.group;
        if(colliName === 'ground' || colliName === 'rail') {
            this.dirY=0;
            this.node.y = other.node.y + other.node.height/2+this.node.height/2 - 2;
        }
    }

    update (dt) {
        this.updateVel(dt);
        this.updatePosition(dt);
    }

    updateVel(dt) {
        this.velY += dt*this.aclY*this.dirY;
    }

    updatePosition(dt) {
        this.node.y += this.velY*dt;
        this.node.x += this.velX*dt*this.dirX; 
        if (this.node.x <= this._edgeLeft+this.node.width/2 || this.node.x >= this._edgeRight-this.node.width/2) {
            this.dirX *= -1;
        }
    }

}
