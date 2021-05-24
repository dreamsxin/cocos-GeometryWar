/*
 * @Autor: Rao
 * @Date: 2021-05-19 12:59:45
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-19 15:54:07
 * @Description: 
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameComponent from "../GameComponent";
import UIMgr from "./UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioMgr extends GameComponent {

    @property(cc.AudioClip)
    bgAudio: cc.AudioClip

    @property(cc.AudioClip)
    deiesAudio: cc.AudioClip

    @property({ 'type': cc.AudioClip })
    itemAudio: cc.AudioClip

    @property(cc.AudioClip)
    pauseAudio: cc.AudioClip

    bg: any;
    item: any;
    dies: any;
    pause: any;

    listEvent() {
        return ['playItemAudio', 'playBgAudio', 'playPauseAudio', 'playDiesAudio', 'closeBgAudio']
    }

    onEvent(event, params) {
        if (UIMgr.getInstance().isAudioPlaying) {
            if (event === 'playItemAudio') {
                this.playItemAudio();
            }
            else if (event === 'playBgAudio') {
                this.playBgAudio();
            }
            else if (event === 'playPause') {
                this.playPauseAudio();
            }
            else if (event === 'playDiesAudio') {
                this.playDiesAudio();
            }
            else if (event === 'closeBgAudio') {
                this.closeBgAudio();
            }
        }
    }

    onLoad() {
        GameComponent.prototype.onLoad.call(this);
        cc.audioEngine.playMusic(this.bgAudio, true);
        cc.audioEngine.setMusicVolume(0.2);
    }
    playBgAudio() {
        
    }
    playItemAudio() {
        // this.item = this.node.getComponent(cc.AudioSource);
        // this.item.play();
        this.item = cc.audioEngine.play(this.itemAudio, false, 0.3);
    }

    playPauseAudio() {
        this.pause = cc.audioEngine.play(this.pauseAudio, false, 0.3);
    }

    playDiesAudio() {
        this.dies = cc.audioEngine.play(this.deiesAudio, false, 0.6);
    }
    closeBgAudio() {
        cc.audioEngine.stop(this.bg);
    }

    start() {

    }

    // update (dt) {}
}
