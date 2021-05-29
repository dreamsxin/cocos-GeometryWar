/*
 * @Autor: Rao
 * @Date: 2021-05-16 10:24:27
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-27 10:12:48
 * @Description: 
 */

import GameComponent from "../GameComponent";
import UIMgr from "../Manager/UIMgr";
import EventMgr from "../Manager/EventMgr";
import Global from "../Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends GameComponent {

    heroData:any;
    lastScene:string = '';
    
    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        this.uiNodes['_btnTrayAgain'].on('click', this.trayAgain, this);
        this.uiNodes['_btnReturnMenu'].on('click', this.ReturnMenu, this);
    }

    start () {
        this.lastScene = UIMgr.getInstance().getLastScene();
        
        let heroData = Global.heroData; 
        console.log(heroData);
        if (heroData) {
            let score = this.uiNodes['_score'].getComponent(cc.Label);
            let moneyCount = this.uiNodes['_moneyCount'].getComponent(cc.Label);
            let killCountTitle = this.uiNodes['_killCountTitle'].getComponent(cc.Label);
            let killCount = this.uiNodes['_killCount'].getComponent(cc.Label);

            score.string = heroData.score;
            moneyCount.string = heroData.moneyCount;
            if(this.lastScene === 'RelaxScene') {
                killCountTitle.string = '消灭障碍'
                killCount.string = heroData.obstacleCount;
            }
            else {
                killCountTitle.string = '杀灭怪物'
                killCount.string = heroData.monsterCount;
            }
            
        }
    }

    trayAgain() {
        EventMgr.getInstance().EventDispatcher('open'+this.lastScene, {curNode: this.node});
    }

    ReturnMenu() {
        EventMgr.getInstance().EventDispatcher('openGameMenu', {curNode: this.node});
    }

    onDestroy() {
        this.uiNodes['_btnTrayAgain'].off('click', this.trayAgain, this);
        this.uiNodes['_btnReturnMenu'].off('click', this.ReturnMenu, this);
    }
}
