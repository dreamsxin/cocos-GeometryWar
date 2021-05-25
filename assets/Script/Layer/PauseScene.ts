/*
 * @Autor: Rao
 * @Date: 2021-04-12 17:06:36
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-25 17:20:50
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
        cc.director.pause();
        this.uiNodes['_btnContinue'].on('click', this.continueGame, this);
        this.uiNodes['_btnReturn'].on('click', this.exitGame, this);
        this.node.y -= this.node.parent.y;
    }

    continueGame() {
        cc.director.resume();
        UIMgr.getInstance().closeUINode(this.node, 'dialog');
    }

    exitGame() {
        cc.director.resume();
        let sceneName = this.node.parent.name;
        let scenePrefix = sceneName.substr(0, sceneName.length-5);
        UIMgr.getInstance().closeUINode(this.node, 'dialog');
        EventMgr.getInstance().EventDispatcher('close'+sceneName);
        EventMgr.getInstance().EventDispatcher('open'+scenePrefix+'Menu', {'curNode': this.node});
        console.log(sceneName+scenePrefix);
    }

}
