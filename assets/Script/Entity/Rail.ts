/*
 * @Autor: Rao
 * @Date: 2021-04-15 17:06:17
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-16 16:01:37
 * @Description: 能够承载hero栏杆
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Rail extends cc.Component {
    onLoad () {
        let [minX, maxX, minY, maxY] = [100, 540, 280, 450];
        this.node.x = Math.floor(Math.random()*(maxX - minX) + minX);
        this.node.y = Math.floor(Math.random()*(maxY - minY) + minY);
        
    }

    start() {
        this.scheduleOnce(function () {
            this.node.destory();
        }, 3);
    }

}
