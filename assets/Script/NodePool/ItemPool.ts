/*
 * @Autor: Rao
 * @Date: 2021-04-10 09:18:32
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-12 09:59:15
 * @Description: 
 */

const {ccclass, property} = cc._decorator;

import GameComponent from "../GameComponent";
import ResMgr from "../Manager/ResMgr";

@ccclass
export default class ItemPool extends cc.Component {

    itemNodes = new Map();
    
    static instance: ItemPool = null;
    static getInstance() {
        if (!ItemPool.instance) {
            ItemPool.instance = new ItemPool();
        }
        return ItemPool.instance;
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
            let itemNodePool: cc.NodePool = new cc.NodePool(); 
            for (let j = 0; j < 15; j++) {
                let itemPrefab = ResMgr.getInstance().getPrefab('Item'+i); // item2
                let itemNode = cc.instantiate(itemPrefab);
                itemNode.addComponent('Item');
                itemNodePool.put(itemNode);
            }
            this.itemNodes.set('item'+i, itemNodePool);
        }
    }
    
    getItem(type:number) {
        if (this.itemNodes.has('item'+type) && this.itemNodes.get('item'+type)) {
            let itemNodePool = this.itemNodes.get('item'+type);
            if (itemNodePool.size() > 0) {
                return itemNodePool.get();
            }
            else {
                let itemPrefab = ResMgr.getInstance().getPrefab('item'+type); 
                let itemNode = cc.instantiate(itemPrefab);
                itemNodePool.put(itemNode);
            }
        }
    }

    putItem(type:number, itemNode:cc.Node) {
        if (this.itemNodes.has('item'+type) && this.itemNodes.get('item'+type)) {
            let itemNodePool = this.itemNodes.get('item'+type);
            itemNodePool && itemNodePool.put(itemNode);
        }
    }
}
