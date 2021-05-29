/*
 * @Autor: Rao
 * @Date: 2021-05-01 16:43:00
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-27 11:42:24
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ResMgr from "../Manager/ResMgr";
import EventMgr from "../Manager/EventMgr";
import UIMgr from "../Manager/UIMgr";
import Global from "../Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventureScene extends GameComponent {

    // LIFE-CYCLE CALLBACKS:
    private _tileMap: cc.TiledMap;
    private _moneyObjs: any;
    private _railObjs: any;
    private _itemObjs: any;
    private _monsterObjs: any;
    private _heroNode: cc.Node;

    private _cameraMaxY: number = 0;
    private _mainCamera: cc.Node;

    private _mapIndex: number = 1;
    private _mapSize: cc.Size;
    private _tileSize: cc.Size;
    private _mapHeight: number = 0;

    listEvent() {
        return ['closeAdventureScene', 'gameover'];
    }
    onEvent(event, params) {
        if (event === 'closeAdventureScene') {
            this.node.destroy();
        }
        else if (event === 'gameover') {
            EventMgr.getInstance().EventDispatcher('openGameOverScene', { curNode: this.node });
        }
    }

    onLoad() {
        GameComponent.prototype.onLoad.call(this);
        // cc.sys.localStorage.setItem('curGameScene', this.node.name);
        
        this._tileMap = this.node.getComponent(cc.TiledMap);
        this._mapIndex = Global.curMapIndex;
        this._tileMap.tmxAsset = ResMgr.getInstance().getTileMap('map' + this._mapIndex);

        this._mapSize = this._tileMap.getMapSize();
        this._tileSize = this._tileMap.getTileSize();
        let mapWidth = this._mapSize.width * this._tileSize.width;
        this._mapHeight = this._mapSize.height * this._tileSize.height;

        //this._cameraMaxY = this._mapHeight / 2 - cc.winSize.height / 2;
        //this._mainCamera = cc.find('Canvas/Main Camera');

        this.createMoney();
        this.createRail();
        this.createItem();
        this.createHero();
        this.createMonster();

        let follow = cc.follow(this._heroNode, cc.rect(0, 0, mapWidth, this._mapHeight));
        this.node.runAction(follow);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    }

    changeMap() {
        this._mapIndex++;
        if (this._mapIndex > Global.mapCount) {
            this._mapIndex = 1;
            // TODO： 其实可以在通关后再次进入地图时将难度升级
        }
        Global.curMapIndex = this._mapIndex;
        EventMgr.getInstance().EventDispatcher('saveInfo');
        EventMgr.getInstance().EventDispatcher('openAdventureScene', { curNode: this.node });
    }

    createMoney() {
        this._moneyObjs = this._tileMap.getObjectGroup('money').getObjects();
        let moneyPfb = ResMgr.getInstance().getPrefab('Money');
        for (let money of this._moneyObjs) {
            let moneyN = cc.instantiate(moneyPfb);
            moneyN.addComponent('Money');
            this.node.addChild(moneyN);
            moneyN.x = money['x'];
            moneyN.y = money['y'];
        }
    }

    createRail() {
        this._railObjs = this._tileMap.getObjectGroup('rail').getObjects();
        let railPfb = ResMgr.getInstance().getPrefab('Rail');
        for (let rail of this._railObjs) {
            let railN = cc.instantiate(railPfb);
            this.node.addChild(railN);
            railN.x = rail['x'];
            railN.y = rail['y'];
        }
    }

    createItem() {
        this._itemObjs = this._tileMap.getObjectGroup('item').getObjects();
        for (let item of this._itemObjs) {
            let itemName = 'Item' + item.name.substr(4);
            let itemPfb = ResMgr.getInstance().getPrefab(itemName);
            let itemN = cc.instantiate(itemPfb);
            itemN.addComponent('Item');
            this.node.addChild(itemN);
            itemN.x = item['x'];
            itemN.y = item['y'];
            itemN.scale = 2;
        }
    }

    createHero() {
        let pfbName = ResMgr.getInstance().getPrefab('Hero');
        this._heroNode = cc.instantiate(pfbName);
        this.node.addChild(this._heroNode);
        this._heroNode.addComponent('Hero');
    }

    createMonster() {
        this._monsterObjs = this._tileMap.getObjectGroup('monster').getObjects();
        for (let monster of this._monsterObjs) {
            let monsterPfb = ResMgr.getInstance().getPrefab('Monster1');
            let monsterN = cc.instantiate(monsterPfb);
            monsterN.addComponent('Monster');
            this.node.addChild(monsterN);
            monsterN.x = monster['x'];
            monsterN.y = monster['y'];
        }
    }

    updateCameraPos() {
        // 实际上我这次使用使用cc.follow它移动的并不是Camera，而是整个Adventure节点
        // let target = this._heroNode.position;
        // 还有一种已经到达最顶部的情况没有考虑
        // if (target.y > cc.winSize.height/2) {
        //     target.y = this._cameraMaxY;
        //     this._mainCamera.y = target.y;
        // }
        // else {
        //      this._mainCamera.y = cc.winSize.height/2;
        // }
    }

    update(dt) {
        this.updateCameraPos();
        if (this._heroNode.y >= this._mapHeight) {
            this.changeMap();
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                // if(cc.game.isPaused()) {
                //     cc.game.resume();
                // }

                EventMgr.getInstance().EventDispatcher('openAdventureMenu', { 'curNode': this.node });

                // 之前用来让暂停界面一直处于界面中央的代码。但是这种方法并没有用。
                // 其实用了follow后只要一句话就可以解决
                //let pfbName = ResMgr.getInstance().getPrefab('PauseScene');
                //let pfbNode = cc.instantiate(pfbName);
                //this.node.addChild(pfbNode);
                //pfbNode.y = this._heroNode.y;
                //pfbNode.addComponent('PauseScene');

                break;
            case cc.macro.KEY.p:
                // let isPause = cc.game.isPaused();
                // if (isPause) {
                //     cc.game.resume();
                // }
                // else {
                //     cc.game.pause();
                // }
                
                EventMgr.getInstance().EventDispatcher('openPauseScene', { 'curNode': this.node, 'parentNode': this.node, 'uiType': 'dialog' });
                break;
        }
    }

    onDestroy() {
        GameComponent.prototype.removeEvent.call(this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
}
