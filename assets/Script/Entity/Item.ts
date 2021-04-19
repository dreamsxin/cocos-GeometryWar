/*
 * @Autor: Rao
 * @Date: 2021-04-07 10:19:54
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-12 10:28:17
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ItemPool from "../NodePool/ItemPool";
import ResMgr from "../Manager/ResMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends GameComponent {

    private _id: number;
    private _type: number;
    private _buff: number;
    props = {
        id: this._id,
        type: this._type,
        lifeBuff: this._buff,
        ackBuff: this._buff,
        hpBuff: this._buff,
        timeBuff: this._buff,
    }
    buffMap = {
        1: 'lifeBuff',
        2: 'ackBuff',
        3: 'hpBuff',
        4: 'timeBuff',
    }
    
    initWithData() {
        let itemConfigs = ResMgr.getInstance().getConfig('ItemDt');
        let index = this.node.name.substr(4);
        let itemConfig = itemConfigs[parseInt(index)];
        for (const key in this.props) {
            this.props[key] = itemConfig[key];
        }
    }

    get id() {
        return this.props['id'];
    }
    get type() {
        return this.props['type'];
    }
    get buff() {
        let rst = this.props[this.buffMap[this.id]];
        return rst ? rst:0;
    }
    
    // moveVel:number = -350;    
    moveDst:number = 2;

    listEvent(){
        return ['removeItem'];
    }
    onEvent(event) {
        if (event === 'removeItem') {
            this.removeItem();
        }
    }

    onLoad () {
        // GameComponent.prototype.onLoad.call(this);
    
        let ground = cc.find('Canvas/Game/RelaxScene/ground');
        this.node.x = cc.winSize.width;
        let minY = ground && ground.height/2+this.node.height/2;
        let maxY = minY + 120;
        let posY = Math.floor(Math.random()*(maxY-minY)+minY);
        this.node.y = posY;
        this.initWithData();
    }

    update (dt) {
        // this.node.x += this.moveVel*dt;
        this.node.x -= this.moveDst;
        if (this.node.x < -this.node.width) {
            this.removeItem();
        }
    }

    onCollisionEnter(other) {
        let colliName = other.node.group;
        if (colliName === 'hero') {
            this.removeItem();
        }
    }

    removeItem() {
        ItemPool.getInstance().putItem(this.props['type'], this.node);
    }
}
