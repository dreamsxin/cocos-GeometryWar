/*
 * @Autor: Rao
 * @Date: 2021-04-15 17:06:17
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-27 10:11:25
 * @Description: 能够承载hero栏杆
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rail extends cc.Component {

    dir: number = -1;
    vel: number = 188;
    scale: number = 1;
    onLoad() {
        // this.node.getComponent(cc.RigidBody).syncPosition(true);
        // let [minX, maxX, minY, maxY] = [100, 540, 280, 450];
        // this.node.x = Math.floor(Math.random()*(maxX - minX) + minX);
        // this.node.y = Math.floor(Math.random()*(maxY - minY) + minY);
        this.node.x = 480;
        this.node.y = 320;
        this.node.scale = this.scale;
    }
    
    

    start() {
        // this.scheduleOnce(function () {
        //     this.node.destory();
        // }, 3);
    }
    
    update(dt) {
        this.node.x += this.vel * dt * this.dir;
        if (this.node.x + this.node.width / 2 > cc.winSize.width || this.node.x - this.node.width / 2 < 0) {
            this.dir *= -1;
        }
    }
}
