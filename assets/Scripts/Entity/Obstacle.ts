/*
 * @Autor: Rao
 * @Date: 2021-04-09 16:05:38
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-27 10:10:32
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ObstaclePool from "../NodePool/ObstaclePool";
import EventMgr from "../Manager/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Obstacle extends GameComponent {

    // moveVel:number = -350;    
    moveDst:number = 4.5;
    obsNodePool: any = new ObstaclePool();
    type: any;
    isCrashed:boolean = false;
    funcMap = new Map();
    
    getFuncByName(funcName) {
        if (!funcName) {
            return;
        }
        return this.funcMap.get(funcName);
    }

    onLoad () {
        let ground = cc.find('Canvas/Game/RelaxScene/ground');
        let obsScale = Math.round(Math.random()*1)+0.5;
        this.node.scale = obsScale;
        this.node.x = cc.winSize.width;
        this.node.y = ground && ground.height/2+(this.node.height/2)*obsScale;
        this.type = this.node.name.charAt(this.node.name.length - 1);
        this.funcMap.set('rotateSelf', this.rotateSelf);
    }
    
    update (dt) {
        // this.node.x += this.moveVel*dt;
        if(!this.isCrashed) {
            this.node.x -= this.moveDst;
        }
        if (this.node.x < -this.node.width || this.node.x > cc.winSize.width + 10) {
            this.isCrashed = false;
            this.node.destroy();
        }
    }
   
    rotateSelf(heroPos?) {
        this.isCrashed = true;
        let dir = heroPos.x < this.node.x ? 1:-1; // 1--向右，-1向左
        let dstPoint = dir ? cc.winSize.width+50 : 0-50;
        let dstTime = Math.abs(dstPoint - this.node.x)/350;
        cc.tween(this.node)
        .to(0.5, {angle: 320})
        .to(dstTime, {position: cc.v3(dstPoint, 260, 0)})
        .start();

    }
}
