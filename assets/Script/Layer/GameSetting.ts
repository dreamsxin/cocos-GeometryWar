import GameComponent from "../GameComponent";
import UIMgr from "../Manager/UIMgr";
import EventMgr from "../Manager/EventMgr";

/*
 * @Autor: Rao
 * @Date: 2021-05-19 14:12:27
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-19 15:40:12
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
        this.isBtnClicked = !UIMgr.getInstance().isAudioPlaying;
        if (!UIMgr.getInstance().isAudioPlaying) {
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
        UIMgr.getInstance().isAudioPlaying = !UIMgr.getInstance().isAudioPlaying;
    }

    onBtnExit() {
        EventMgr.getInstance().EventDispatcher('open'+UIMgr.getInstance().getLastScene(), {curNode:this.node});
    }
    // update (dt) {}
}
