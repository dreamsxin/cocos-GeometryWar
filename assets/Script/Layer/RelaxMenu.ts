/*
 * @Autor: Rao
 * @Date: 2021-04-06 15:13:42
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-19 14:36:50
 * @Description: 
 */

import GameComponent from "../GameComponent";
import UIMgr from "../Manager/UIMgr";
import EventMgr from "../Manager/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RelaxMenu extends GameComponent {

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        this.uiNodes['_btnStart'].on('click', this.enterRelaxGameScene, this);
        this.uiNodes['_btnReturn'].on('click', this.exitRelaxGameScene, this);
        this.uiNodes['_btnSetting'].on('click', this.enterGameSettingScene, this);
    }

    start () {
        console.log('RelaxMenu:onDestroy:start');
        // let btn = cc.find('Canvas/Game/RelaxMenu/_btnStart');
        // btn.on('click', this.enterRelaxGameScene, this);
        // this.uiNodes['_btnStart'].on('click', this.enterRelaxGameScene, this);
    }
    
    enterRelaxGameScene() {
        //UIMgr.getInstance().closeUINode(this.node);
        EventMgr.getInstance().EventDispatcher('openRelaxScene', {'curNode': this.node});
    }

    exitRelaxGameScene () {
        //UIMgr.getInstance().closeUINode(this.node);
        EventMgr.getInstance().EventDispatcher('openGameMenu', {'curNode': this.node});
    }
    
    enterGameSettingScene() {
        EventMgr.getInstance().EventDispatcher('openGameSetting', {'curNode': this.node});
    }

    onDestroy() {
        this.uiNodes['_btnStart'].off('click', this.enterRelaxGameScene, this);
        this.uiNodes['_btnReturn'].off('click', this.exitRelaxGameScene, this);
        this.uiNodes['_btnSetting'].off('click', this.enterGameSettingScene, this);
    }
}
