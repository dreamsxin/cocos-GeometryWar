/*
 * @Autor: Rao
 * @Date: 2021-05-06 18:23:16
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-13 11:52:22
 * @Description: 
 */

import ResMgr from "../Manager/ResMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletPool extends cc.Component {

    bulletNodes = new Map();
    
    static instance: BulletPool = null;
    static getInstance() {
        if (!BulletPool.instance) {
            BulletPool.instance = new BulletPool();
        }
        return BulletPool.instance;
    }

    private constructor() {
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
        for (let i = 1; i <= 3; i++) { 
            let bulletNodePool: cc.NodePool = new cc.NodePool(); 
            for (let j = 0; j < 15; j++) {
                let bulletPrefab = ResMgr.getInstance().getPrefab('Bullet'+i); // bullet2
                let bulletNode = cc.instantiate(bulletPrefab);
                bulletNode.addComponent('Bullet');
                bulletNodePool.put(bulletNode);
            }
            this.bulletNodes.set('bullet'+i, bulletNodePool);
        }
    }
    
    getBullet(type:number) {
        if (this.bulletNodes.has('bullet'+type) && this.bulletNodes.get('bullet'+type)) {
            let bulletNodePool = this.bulletNodes.get('bullet'+type);
            if (bulletNodePool.size() > 0) {
                return bulletNodePool.get();
            }
            else {
                let bulletPrefab = ResMgr.getInstance().getPrefab('bullet'+type); 
                let bulletNode = cc.instantiate(bulletPrefab);
                bulletNodePool.put(bulletNode);
            }
        }
    }

    putBullet(type:number, bulletNode:cc.Node) {
        if (this.bulletNodes.has('bullet'+type) && this.bulletNodes.get('bullet'+type)) {
            let bulletNodePool = this.bulletNodes.get('bullet'+type);
            bulletNodePool && bulletNodePool.put(bulletNode);
        }
    }
}
