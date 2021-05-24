/*
 * @Autor: Rao
 * @Date: 2021-05-01 16:43:00
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-24 10:50:16
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ResMgr from "../Manager/ResMgr";
import EventMgr from "../Manager/EventMgr";
import UIMgr from "../Manager/UIMgr";

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

        this._tileMap = this.node.getComponent(cc.TiledMap);
        this._mapIndex = cc.sys.localStorage.getItem('curMapIndex');
        this._tileMap.tmxAsset = ResMgr.getInstance().getTileMap('map' + this._mapIndex);

        this._mapSize = this._tileMap.getMapSize();
        this._tileSize = this._tileMap.getTileSize();
        let mapWidth = this._mapSize.width * this._tileSize.width;
        this._mapHeight = this._mapSize.height * this._tileSize.height;
        this._cameraMaxY = this._mapHeight / 2 - cc.winSize.height / 2;
        this._mainCamera = cc.find('Canvas/Main Camera');

        this.createMoney();
        this.createRail();
        this.createItem();
        this.createHero();
        this.createMonster();

        let follow = cc.follow(this._heroNode, cc.rect(0, 0, mapWidth, this._mapHeight));
        this.node.runAction(follow);

        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    }

    changeMap() {
        this._tileMap.tmxAsset = ResMgr.getInstance().getTileMap('map2');
        let mapSize = this._tileMap.getMapSize();
        let mapWidth = mapSize.width * this._tileSize.width;
        this._mapHeight = mapSize.height * this._tileSize.height;
        this._cameraMaxY = this._mapHeight / 2 - cc.winSize.height / 2;
        this._mainCamera = cc.find('Canvas/Main Camera');

        this.createMoney();
        this.createRail();
        this.createItem();
        this.createHero();
        this.createMonster();

        let follow = cc.follow(this._heroNode, cc.rect(0, 0, mapWidth, this._mapHeight));
        this.node.runAction(follow);
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

    start() {
        var colliMgr = cc.director.getCollisionManager();
        if (!colliMgr.enabled) {
            colliMgr.enabled = true;
            //colliMgr.enabledDebugDraw = true;
            // colliMgr.enabledDrawBoundingBox = true;
        }
    }

    updateCameraPos() {
        // let target = this._heroNode.position;
        // if (target.y > 320) {
        //     target.y = this._cameraMaxY;
        //     this._mainCamera.y = target.y;
        // }
        // else {

        // }

    }

    update(dt) {
        this.updateCameraPos();
        if (this._heroNode.y >= this._mapHeight) {
            this._mapIndex++;
            cc.sys.localStorage.setItem('curMapIndex', this._mapIndex);
            EventMgr.getInstance().EventDispatcher('openAdventureScene', { curNode: this.node });
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                // if(cc.game.isPaused()) {
                //     cc.game.resume();
                // }

                EventMgr.getInstance().EventDispatcher('openAdventureMenu', { 'curNode': this.node });

                //let pfbName = ResMgr.getInstance().getPrefab('PauseScene');
                //let pfbNode = cc.instantiate(pfbName);
                //this.node.addChild(pfbNode);
                //pfbNode.y = this._heroNode.y;
                //pfbNode.addComponent('PauseScene');

                break;
            case cc.macro.KEY.p:
                let isPause = cc.game.isPaused();
                if (isPause) {
                    cc.game.resume();
                }
                else {
                    cc.game.pause();
                }
                break;

        }
    }

    onDestroy() {
        GameComponent.prototype.removeEvent.call(this);
    }
}
