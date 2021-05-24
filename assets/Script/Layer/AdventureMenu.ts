/*
 * @Autor: Rao
 * @Date: 2021-05-01 12:10:32
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-24 10:55:40
 * @Description:
 */

import GameComponent from "../GameComponent";

import EventMgr from "../Manager/EventMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class AdventureMenu extends GameComponent {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        this.uiNodes['_btnStart'].on('click', this.enterAdventureGameScene, this);
        this.uiNodes['_btnSetting'].on('click', this.enterGameSettingScene, this);
        this.uiNodes['_btnReturn'].on('click', this.exitAdventureGameScene, this);
    }

    enterAdventureGameScene () {
        cc.sys.localStorage.setItem('curMapIndex', 1);
        EventMgr.getInstance().EventDispatcher('openAdventureScene', {'curNode': this.node});
    }

    exitAdventureGameScene () {
        EventMgr.getInstance().EventDispatcher('openGameMenu', {'curNode': this.node});
    }
    
    enterGameSettingScene() {
        EventMgr.getInstance().EventDispatcher('openGameSetting', {'curNode': this.node});
    }

    onDestroy () {
        this.uiNodes['_btnStart'].off('click', this.enterAdventureGameScene, this);
        this.uiNodes['_btnReturn'].off('click', this.exitAdventureGameScene, this);
        this.uiNodes['_btnSetting'].off('click', this.enterGameSettingScene, this);
    }
}
