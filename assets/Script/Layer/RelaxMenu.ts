/*
 * @Autor: Rao
 * @Date: 2021-04-06 15:13:42
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-13 14:22:52
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
    }

    start () {
        console.log('RelaxMenu:onDestroy:start');
        // let btn = cc.find('Canvas/Game/RelaxMenu/_btnStart');
        // btn.on('click', this.enterRelaxGameScene, this);
        // this.uiNodes['_btnStart'].on('click', this.enterRelaxGameScene, this);
    }
    
    enterRelaxGameScene() {
        UIMgr.getInstance().closeUINode(this.node);
        EventMgr.getInstance().EventDispatcher('openRelaxScene');
        
        // UIMgr.getInstance().closeUINode(this.node);
    }
    // update (dt) {}

    onDisable() {
        
    }
    
    onDestroy() {
        this.uiNodes['_btnStart'].off('click', this.enterRelaxGameScene, this);
        console.log('RelaxMenu:onDestroy');
    }
}
