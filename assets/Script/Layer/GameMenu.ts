/*
 * @Autor: Rao
 * @Date: 2021-04-04 12:44:23
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-19 14:32:26
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
       this.uiNodes['_btnAdventure'].on('click', this.enterAdventureMode, this);
       this.uiNodes['_btnExit'].on('click', this.exitGame, this);
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
        EventMgr.getInstance().EventDispatcher('openRelaxMenu', {'curNode': this.node});
        //UIMgr.getInstance().closeUINode(this.node);
    }

    enterAdventureMode() {
        EventMgr.getInstance().EventDispatcher('openAdventureMenu', {'curNode': this.node});
        //UIMgr.getInstance().closeUINode(this.node);
    }

    

    exitGame() {
        cc.game.end();
    }
}
