
import GameComponent from "../GameComponent";
import UIMgr from "./UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends GameComponent {

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        UIMgr.getInstance().openUINode(this.node, 'GameMenu');
    }

    listEvent() {
        return ['openRelaxMenu','openAdventureMenu', 'openRelaxScene', 'openAdventureScene', 'openPauseScene'];
    }
    onEvent(event:string, params) {
        if(event.startsWith('open')) {
            let parentNode = params ? params : this.node;
            UIMgr.getInstance().openUINode(parentNode, event.substr(4));
        }
        else if (true) {
            
        }
    }

    start () {

    }
}
