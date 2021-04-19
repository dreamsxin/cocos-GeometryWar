/*
 * @Autor: Rao
 * @Date: 2021-04-09 16:05:38
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-15 18:32:06
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ObstaclePool from "../NodePool/ObstaclePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Obstacle extends GameComponent {

    // moveVel:number = -350;    
    moveDst:number = 6;
    obsNodePool: any = new ObstaclePool();
    type: any;
    
    onLoad () {
        // let ground = this.node.getChildByName('RelaxScene').getChildByName('ground');
        let ground = cc.find('Canvas/Game/RelaxScene/ground');
        let obsScale = Math.round(Math.random()*2)+0.8;
        this.node.scale = obsScale;
        this.node.x = cc.winSize.width;
        this.node.y = ground && ground.height/2+(this.node.height/2)*obsScale;
        this.type = this.node.name.charAt(this.node.name.length - 1);
    }

    listEvent () {
        return ['rotateObstacle'];
    }
    onEvent(event, params) {
        this.rotateSelf(params);
    }
    
    update (dt) {
        // this.node.x += this.moveVel*dt;
        this.node.x -= this.moveDst;
        if (this.node.x < -this.node.width) {
            this.node.removeFromParent();
            // this.obsNodePool.putObstacle(this.type, this.node);
        }
    }

    rotateSelf(heroPos) {
         
    }
}
