/*
 * @Autor: Rao
 * @Date: 2021-04-06 21:41:57
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-24 10:52:10
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ResMgr from "../Manager/ResMgr";
import ItemPool from "../NodePool/ItemPool";
import EventMgr from "../Manager/EventMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RelaxScene extends GameComponent {
    heroNode: cc.Node;
    heroMgr: any;
    heroLife: cc.RichText;
    runTime: cc.RichText;
    time: number;
    score: any;

    obsCreateIntervel: number = 75;
    obsCreateTime: number = 0;
    obsNode: cc.Node;
    obsPrefabs: {};
    obsTypes: number[];
    obsTypesLen: number = 0;

    itemNodePool: any = ItemPool.getInstance();
    itemCreateIntervel: number = 450;
    itemCreateTime: number = 0;

    moneyPrefab: any;
    moneyCreateIntervel: number = 120;
    moneyCreateTime: number = 0;

    railPrefab: any;

    listEvent() {
        return ['updateHeroLife', "closeRelaxScene", 'updateScore', 'gameover'];
    }
    onEvent(event, params) {
        if (event === 'updateHeroLife') {
            this.updateHeroLife();
        }
        else if (event === 'closeRelaxScene') {
            this.node.destroy();
        }
        else if (event === 'updateScore') {
            this.updateScore(params);
        }
        else if (event === 'gameover') {
            EventMgr.getInstance().EventDispatcher('openGameOverScene', { curNode: this.node });
        }
    }

    onLoad() {
        GameComponent.prototype.onLoad.call(this);
        var colliMgr = cc.director.getCollisionManager();
        if (!colliMgr.enabled) {
            colliMgr.enabled = true;
            //colliMgr.enabledDebugDraw = true;
            // colliMgr.enabledDrawBoundingBox = true;
        }
        this.time = 0;
        this.obsPrefabs = {};
        this.obsTypes = [];
        this.heroLife = this.uiNodes['topBar/hero/_heroLife'].getComponent(cc.RichText);
        this.runTime = this.uiNodes['topBar/time/_restTime'].getComponent(cc.RichText);
        this.score = this.uiNodes['topBar/_score'].getComponent(cc.Label);
        this.pushObsTypes();

        // EventMgr.getInstance().EventDispatcher('playBgAudio');
    }

    start() {
        let pfbName = ResMgr.getInstance().getPrefab('Hero');
        this.heroNode = cc.instantiate(pfbName);
        this.node.addChild(this.heroNode);
        this.heroNode.addComponent('Hero');
        this.heroMgr = this.heroNode.getComponent('Hero');
        this.heroLife.string = '<color=#DCDCDC>' + this.heroMgr.life + '</color>';

        this.node.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
        this.createObstacle();
        this.createRail();
        this.uiNodes['topBar/_btnReturn'].on('click', function () { // 'parentNode': this.node, 
            EventMgr.getInstance().EventDispatcher('openPauseScene', { 'curNode': this.node, 'parentNode': this.node, 'uiType': 'dialog' });
            EventMgr.getInstance().EventDispatcher('playPauseAudio');
        }, this);

        this.score.string = 'Score：0';
    }

    onClick() {
        this.heroMgr.jump();
    }

    update(dt) {
        //this.heroMgr.update(dt);
        this.time += dt;
        this.runTime.string = '<color=#696969>' + this.time.toFixed(2) + '</color>';

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

        this.moneyCreateTime++;
        if (this.moneyCreateTime > this.moneyCreateIntervel) {
            this.moneyCreateTime = 0;
            this.createMoney();
        }
    }

    updateHeroLife() {
        this.heroLife.string = '<color=#DCDCDC>' + this.heroMgr.life + '</color>';
    }

    createObstacle() {
        let type = this.obsTypes[this.obsTypesLen++];
        if (this.obsTypesLen === 5) {
            //this.shuffleObsTypes();
            this.obsTypesLen = 0;
        }
        // 生成1-5的随机
        //let type = Math.ceil(Math.random()*5);
        if (!this.obsPrefabs.hasOwnProperty(type)) {
            let obsPrefab = ResMgr.getInstance().getPrefab('Obstacle' + type);
            this.obsPrefabs[type] = obsPrefab;
        }

        this.obsNode = cc.instantiate(this.obsPrefabs[type]);   //this.obsNodePool.getObstacle(type);
        this.obsNode && this.node.addChild(this.obsNode);
        this.obsNode && this.obsNode.addComponent('Obstacle');
    }

    createItem() {
        let type = Math.ceil(Math.random() * 3);
        let itemNode = this.itemNodePool.getItem(type);
        itemNode && this.node.addChild(itemNode);
        itemNode && itemNode.addComponent('Item');

    }

    createRail() {
        if (!this.railPrefab) {
            this.railPrefab = ResMgr.getInstance().getPrefab('Rail');
        }
        let railNode = cc.instantiate(this.railPrefab);
        this.node.addChild(railNode);
        railNode.addComponent('Rail');
    }

    createMoney() {
        if (!this.moneyPrefab) {
            this.moneyPrefab = ResMgr.getInstance().getPrefab('Money');
        }
        let moneyNode = cc.instantiate(this.moneyPrefab);
        this.node.addChild(moneyNode);
        moneyNode.addComponent('Money');
    }

    pushObsTypes() {
        for (let i = 1; i <= 5; i++) {
            this.obsTypes.push(i);
        }
    }
    shuffleObsTypes() {
        for (let i = this.obsTypes.length - 1; i >= 0; i--) {
            let index = Math.floor(Math.random() * i);
            [this.obsTypes[i], this.obsTypes[index]] = [this.obsTypes[index], this.obsTypes[i]];
        }
    }

    updateScore(score) {
        this.score.string = 'Score：' + score;
    }

    onDestroy() {
        // EventMgr.getInstance().removeEventListener('updateHeroLife');
        // EventMgr.getInstance().removeEventListener('closeRelaxScene');
        GameComponent.prototype.removeEvent.call(this);
    }

}
