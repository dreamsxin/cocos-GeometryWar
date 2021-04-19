/*
 * @Autor: Rao
 * @Date: 2021-04-04 12:44:23
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-11 21:06:10
 * @Description: 
 */
import ResMgr from "../Manager/ResMgr";
import GameComponent from "../GameComponent";
import EventMgr from "../Manager/EventMgr";
import UIMgr from "../Manager/UIMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMenu extends GameComponent {

    GameMenuNode: cc.Node;

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
    }

    start() {
       // UIMgr.getInstance().addBtnClickEvent(this.uiNodes['_btnRelax'], this, this.enterRelaxMode);
       this.uiNodes['_btnRelax'].on('click', this.enterRelaxMode, this);
    }

    listEvent() {
        return ['print'];
    }
    onEvent(event, params?) {
        if(event === 'print') { 
            console.log('print'+params);
        } 
    }

    enterRelaxMode() {
        // UIMgr.getInstance().openUINode(this.node.parent, 'RelaxMenu');
        EventMgr.getInstance().EventDispatcher('openRelaxMenu');
        UIMgr.getInstance().closeUINode(this.node);
    }

}
