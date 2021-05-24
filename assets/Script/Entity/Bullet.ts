/*
 * @Autor: Rao
 * @Date: 2021-04-06 21:37:08
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-14 10:47:44
 * @Description: 
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ResMgr from "../Manager/ResMgr";
import BulletPool from "../NodePool/BulletPool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    private _id: number;
    private _type: number;
    private _buff: number;
    private _dir: number = 0;
    private _ack: number = 0;
    props = {
        id: this._id,
        type: this._type,
        ackBuff: this._buff
    }
    
    initWithData() {
        let bulletConfigs = ResMgr.getInstance().getConfig('bulletDt');
        let index = this.node.name.substr(6);
        let bulletConfig = bulletConfigs[parseInt(index)];
        for (const key in this.props) {
            this.props[key] = bulletConfig[key];
        }
    }

    get id() {
        return this.props['id'];
    }
    get type() {
        return this.props['type'];
    }
    get buff() {
        return this.props['ackBuff'];
    }

    set dir(num:number) {
        this._dir = num;
    }
    get dir() {
        return this._dir;
    }
    
    set ack(num:number) {
        this._ack = num;
    }
    get ack() {
        return this._ack;
    }
    
    moveVel:number = 250;    
    
    onLoad () {
        this.initWithData();
    }

    update (dt) {
        this.node.x += this.moveVel*this.dir*dt;
        if (this.node.x >= cc.winSize.width || this.node.x <= 0) {
            console.log('bullet remove');
            this.removeSelf();
        }
    }

    onCollisionEnter (other) {
        let colliName = other.node.group;
        if (colliName==='hero') {
            let heroN = this.node.parent.getChildByName('Hero');
            if (heroN) {
                let heroTs = heroN.getComponent('Hero');
                this.dir = heroTs.isRight ? 1:-1;
                this.ack = heroTs.ack + this.buff;
            }
        }
        else if (colliName === 'monster') {
            this.removeSelf();
        }
    }

    removeSelf () {
        BulletPool.getInstance().putBullet(this.type, this.node);
    }
}
