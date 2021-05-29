/*
 * @Autor: Rao
 * @Date: 2021-04-06 13:29:22
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-26 15:53:28
 * @Description:'
 */

import GameComponent from "../GameComponent";
import UIMgr from "./UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends GameComponent {

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        UIMgr.getInstance().openUINode(this.node, 'GameMenu', 'layer');

        var colliMgr = cc.director.getCollisionManager();
        if (!colliMgr.enabled) {
            colliMgr.enabled = true;
            //colliMgr.enabledDebugDraw = true;
            // colliMgr.enabledDrawBoundingBox = true;
        }
    }
    
    listEvent() {
        return ['openRelaxMenu','openAdventureMenu', 'openRelaxScene', 'openAdventureScene', 
        'openPauseScene','callFuncObstacle','openGameMenu', 'openGameOverScene','openHeroInfoScene','openGameSetting'];
    }
    onEvent(event:string, params) {
        if(event.startsWith('open')) {
            let parentNode = params.parentNode ? params.parentNode : this.node;
            !params.uiType && UIMgr.getInstance().closeUINode(params.curNode);
            UIMgr.getInstance().openUINode(parentNode, event.substr(4), params.uiType);
            //!params.isRetain && UIMgr.getInstance().closeUINode(params.curNode); 
        }
        else if (event.startsWith('callFunc')) {
            let path = 'Canvas/Game/'+params.scene+'/'+params.nodeName;
            let node = cc.find(path);
            let ts:any = node.getComponent(params.tsName);
            let funcName = params.funcName;
            let func = ts.getFuncByName(funcName);
            func.call(ts, params.args);
        }
    }

    

    onDestroy () {
        GameComponent.prototype.removeEvent.call(this);
    }
}
