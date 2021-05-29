/*
 * @Autor: Rao
 * @Date: 2021-04-09 16:24:30
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-09 21:01:25
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ResMgr from "../Manager/ResMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ObstaclePool extends GameComponent {

    obstacleNodes = new Map();
    
    constructor() {
        super();
        this.init();
    }
    
    /**
     * @description: 
     * @for-i {节点池预制体个数}
     * @for-j {预制体类型}
     * @author: Rao
     */
    init() {
        for (let i = 1; i <= 2; i++) { 
            let obsNodePool: cc.NodePool = new cc.NodePool(); 
            for (let j = 0; j < 15; j++) {
                let obsPrefab = ResMgr.getInstance().getPrefab('Obstacle'+i); // Obstacle2
                let obsNode = cc.instantiate(obsPrefab);
                obsNodePool.put(obsNode);
            }
            this.obstacleNodes.set('obstacle'+i, obsNodePool);
        }
    }
    
    getObstacle(type:number) {
        if (this.obstacleNodes.has('obstacle'+type) && this.obstacleNodes.get('obstacle'+type)) {
            let obsNodePool = this.obstacleNodes.get('obstacle'+type);
            if (obsNodePool.size() > 0) {
                return obsNodePool.get();
            }
            else {
                let obsPrefab = ResMgr.getInstance().getPrefab('Obstacle'+type); 
                let obsNode = cc.instantiate(obsPrefab);
                obsNodePool.put(obsNode);
            }
        }
    }

    putObstacle(type:number, obsNode:cc.Node) {
        if (this.obstacleNodes.has('obstacle'+type) && this.obstacleNodes.get('obstacle'+type)) {
            let obsNodePool = this.obstacleNodes.get('obstacle'+type);
            obsNodePool && obsNodePool.put();
        }
    }
}
