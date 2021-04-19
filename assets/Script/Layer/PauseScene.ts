/*
 * @Autor: Rao
 * @Date: 2021-04-12 17:06:36
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-13 14:57:55
 * @Description: 
 */

import GameComponent from "../GameComponent";
import EventMgr from "../Manager/EventMgr";
import UIMgr from "../Manager/UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseScene extends GameComponent {

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        this.uiNodes['_btnContinue'].on('click', this.continueGame, this);
        this.uiNodes['_btnReturn'].on('click', this.exitGame, this);
    }

    continueGame() {
        cc.director.resume();
        UIMgr.getInstance().closeUINode(this.node);
    }

    exitGame() {
        cc.director.resume();
        EventMgr.getInstance().EventDispatcher('closeRelaxScene');
        EventMgr.getInstance().EventDispatcher('openRelaxMenu');
        UIMgr.getInstance().closeUINode(this.node);
    }

    // update (dt) {}
    onDisable() {
        
    }
}
