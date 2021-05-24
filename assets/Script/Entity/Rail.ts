/*
 * @Autor: Rao
 * @Date: 2021-04-15 17:06:17
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-17 11:34:21
 * @Description: 能够承载hero栏杆
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rail extends cc.Component {

    dir: number = -1;
    vel: number = 206;
    onLoad() {
        let [minX, maxX, minY, maxY] = [100, 540, 280, 450];
        // this.node.x = Math.floor(Math.random()*(maxX - minX) + minX);
        // this.node.y = Math.floor(Math.random()*(maxY - minY) + minY);
        this.node.x = 480;
        this.node.y = 320;
    }

    start() {
        // this.scheduleOnce(function () {
        //     this.node.destory();
        // }, 3);
    }

    getVel() {
        return this.vel;
    }
    
    update(dt) {
        this.node.x += this.vel * dt * this.dir;
        if (this.node.x + this.node.width / 2 > cc.winSize.width || this.node.x - this.node.width / 2 < 0) {
            this.dir *= -1;
        }
    }
}
