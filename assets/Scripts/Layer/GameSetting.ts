import GameComponent from "../GameComponent";
import UIMgr from "../Manager/UIMgr";
import EventMgr from "../Manager/EventMgr";
import Global from "../Global";

/*
 * @Autor: Rao
 * @Date: 2021-05-19 14:12:27
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-27 10:13:09
 * @Description: 
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameSetting extends GameComponent {

    isBtnClicked: boolean = false;
    labChoose:any = null;

    onLoad () {
        GameComponent.prototype.onLoad.call(this);
        
        this.uiNodes['_btnChoose'].on('click', this.onBtnChoose, this);
        this.uiNodes['_btnExit'].on('click', this.onBtnExit, this);
        this.labChoose = this.uiNodes['_btnChoose/Background/_labChoose'].getComponent(cc.Label);
        this.isBtnClicked = !Global.isAudioPlaying;
        if (!Global.isAudioPlaying) {
            this.labChoose.string = '否';    
        }
    }

    onBtnChoose () {
        if (!this.isBtnClicked) {
            this.labChoose.string = '否';
            cc.audioEngine.pauseMusic();
            // cc.audioEngine.stopMusic();
            // cc.audioEngine.stopAllEffects();
        }
        else {
            this.labChoose.string = '是';
            cc.audioEngine.resumeMusic();
        }
        this.isBtnClicked = !this.isBtnClicked;
        Global.isAudioPlaying = !Global.isAudioPlaying;
    }

    onBtnExit() {
        EventMgr.getInstance().EventDispatcher('open'+UIMgr.getInstance().getLastScene(), {curNode:this.node});
    }

    onDestroy(){
        this.uiNodes['_btnChoose'].off('click', this.onBtnChoose, this);
        this.uiNodes['_btnExit'].off('click', this.onBtnExit, this);
    }
}
