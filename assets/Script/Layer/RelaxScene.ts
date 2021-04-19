/*
 * @Autor: Rao
 * @Date: 2021-04-06 21:41:57
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-17 18:51:48
 * @Description: 
 */

import GameComponent from "../GameComponent";
import PlayerMgr from "../Manager/PlayerMgr";
import ResMgr from "../Manager/ResMgr";
import UIMgr from "../Manager/UIMgr";
import ObstaclePool from "../NodePool/ObstaclePool";
import ItemPool from "../NodePool/ItemPool";
import EventMgr from "../Manager/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RelaxScene extends GameComponent {
    heroNode: cc.Node;
    heroMgr: any;
    heroLife: cc.RichText;
    runTime: cc.RichText;
    time: number;

    obsCreateIntervel: number = 75;
    obsCreateTime: number = 0;
    obsNode: cc.Node;
    obsPrefabs: {};
    
    itemNodePool: any = ItemPool.getInstance();
    itemCreateIntervel: number = 450;
    itemCreateTime: number = 0;

    railPrefab: any;
    
    listEvent() {
        return ['updateHeroLife', "closeRelaxScene"]
    }
    onEvent(event) {
        if(event === 'updateHeroLife') {
            this.updateHeroLife();
        }
        else if (event === 'closeRelaxScene') {
            this.node.destroy();
        }
    }

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        var colliMgr = cc.director.getCollisionManager();
        if (!colliMgr.enabled) {
            colliMgr.enabled = true;
            //colliMgr.enabledDebugDraw = true;
            // colliMgr.enabledDrawBoundingBox = true;
        }
        this.time = 0;
        this.obsPrefabs = {};
        this.heroLife = this.uiNodes['topBar/hero/_heroLife'].getComponent(cc.RichText); 
        this.runTime = this.uiNodes['topBar/time/_restTime'].getComponent(cc.RichText);
        
    }

    start () {
        let pfbName = ResMgr.getInstance().getPrefab('Hero');
        this.heroNode = cc.instantiate(pfbName);
        this.node.addChild(this.heroNode);
        this.heroNode.addComponent('Hero');
        this.heroMgr = this.heroNode.getComponent('Hero');
        this.heroLife.string = '<color=#DCDCDC>'+this.heroMgr.life+'</color>';
    
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
        this.createObstacle();
        this.createRail();
        this.uiNodes['topBar/_btnReturn'].on('click', function () {
            cc.director.pause();
            EventMgr.getInstance().EventDispatcher('openPauseScene');
        }, this);

       
    }
    
    onClick() {
        this.heroMgr.jump();
    }

    update(dt) {
        //this.heroMgr.update(dt);
        this.time+=dt;
        this.runTime.string = '<color=#696969>'+this.time.toFixed(2)+'</color>'; 
        
        this.obsCreateTime++;
        if (this.obsCreateTime > this.obsCreateIntervel) {
            this.obsCreateTime = 0;
            this.createObstacle();
        }
        
        this.itemCreateTime++;
        if (this.itemCreateTime > this.itemCreateIntervel) {
            this.itemCreateTime = 0;
            this.createItem();
        }
    }

    updateHeroLife() {
        this.heroLife.string = '<color=#DCDCDC>'+this.heroMgr.life+'</color>';

    }
 
    createObstacle() {
        // 生成1-5的随机
        let type = Math.ceil(Math.random()*5);
        if(!this.obsPrefabs.hasOwnProperty(type)) {
            let obsPrefab = ResMgr.getInstance().getPrefab('Obstacle'+type);
            this.obsPrefabs[type] = obsPrefab;
        }
        
        this.obsNode = cc.instantiate(this.obsPrefabs[type]);   //this.obsNodePool.getObstacle(type);
        this.obsNode && this.node.addChild(this.obsNode); 
        this.obsNode && this.obsNode.addComponent('Obstacle');
    }

    createItem() {
        let itemNode = this.itemNodePool.getItem(2);
        itemNode && this.node.addChild(itemNode);
        itemNode && itemNode.addComponent('Item');
        
    }

    createRail() {
        if (!this.railPrefab) {  
            this.railPrefab = ResMgr.getInstance().getPrefab('Rail');
        }

        for (let i = 1; i < 2; i++) {
           let railNode = cc.instantiate(this.railPrefab);
           this.node.addChild(railNode);
           //railNode.addComponent('Rail');
           let [minX, maxX, minY, maxY] = [100, 540, 280, 450];
           railNode.x = Math.floor(Math.random()*(maxX - minX) + minX*i);
           railNode.y = Math.floor(Math.random()*(maxY - minY) + minY*i); 
        } 
    }

    onDestroy() {
        EventMgr.getInstance().removeEventLsitener('updateHeroLife');
        EventMgr.getInstance().removeEventLsitener('closeRelaxScene');
        console.log('Relaxscene:onDestroy');
    }
    
}
