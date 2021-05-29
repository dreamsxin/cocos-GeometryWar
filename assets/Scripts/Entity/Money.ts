/*
 * @Autor: Rao
 * @Date: 2021-04-21 22:42:31
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-17 09:46:08
 * @Description: 
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameComponent from "../GameComponent";
import EventMgr from "../Manager/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Money extends GameComponent {

    vel: number=350;
    isRelaxScene: boolean;
    existTime: number; // 存在时间
    leftTime:number;
    
    onLoad () {
        this.isRelaxScene = this.node.parent.name === 'RelaxScene';
        if(this.isRelaxScene) {
            let posX = Math.ceil(Math.random()*680)+100;
            this.node.x = posX;
            this.node.y = 650;
            this.existTime = 5;
            this.leftTime = this.existTime;
        }
    }

    start () {

    }

    update (dt) {
        if(this.isRelaxScene) {
            this.node.y -= dt*this.vel;
            this.leftTime -= dt;
            if(this.leftTime <= 0) {
                this.node.destroy();
            }
        }
    }

    onCollisionEnter(other) {
        let colliName = other.node.group;
        if(colliName === 'ground') {
            this.node.destroy();
        }
        if (colliName === 'hero') {
            this.node.destroy();
        }
        if(colliName === 'rail') {
            this.vel=0;
            this.node.removeFromParent();
            other.node.addChild(this.node);
            this.node.x = this.node.x - other.node.x;
            this.node.y = other.node.height/2+this.node.height/2;
        }
    }
}
