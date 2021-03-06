/*
 * @Autor: Rao
 * @Date: 2021-05-16 23:22:16
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-26 00:25:12
 * @Description: 
 */


import GameComponent from "../GameComponent";
import EventMgr from "../Manager/EventMgr";
import UIMgr from "../Manager/UIMgr";
import Global from "../Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroInfoScene extends GameComponent {

    callCloseInfoFunc:boolean = false;

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        
        cc.director.pause(); 
        this.uiNodes['_btnReturn'].on('click', this.closeInfo, this);

        let heroInfo = JSON.parse(cc.sys.localStorage.getItem('heroInfo')); 
       
        if (heroInfo) {
            let attrs = ['_level', '_exp', '_life', '_ack'];
            for(let attr of attrs) {
                let attrLab = this.uiNodes[attr].getComponent(cc.Label);
                if (attrLab && attr !== '_exp') {
                    attrLab.string = heroInfo[attr.substr(1)];
                }
                else if (attrLab && attr === '_exp') {
                    attrLab.string = heroInfo['curExp']+"/"+heroInfo['needExp'];
                }
            }
        }

        this.node.y -= this.node.parent.y;
    }

    closeInfo () {
        this.callCloseInfoFunc = true;
        cc.director.resume();
        UIMgr.getInstance().closeUINode(this.node, 'dialog');
    }

    onDisable() {
        // 如果没有关闭info界面就直接按了退出键，则不会执行closeInfo里的方法。导致UIMgr里面的haveDialog值为true。
        // 同时，onDestroy方法也不会执行。但onDisabled会执行。
        cc.director.resume();
        !this.callCloseInfoFunc && UIMgr.getInstance().setIsHaveDialog(false);
    }
    
}
