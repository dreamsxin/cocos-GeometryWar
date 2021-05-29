/*
 * @Autor: Rao
 * @Date: 2021-05-19 12:59:45
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-28 21:31:19
 * @Description: 
 */

import GameComponent from "../GameComponent";
import Global from "../Global";


const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioMgr extends GameComponent {

    @property(cc.AudioClip)
    bgAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    deiesAudio: cc.AudioClip = null;

    @property({ 'type': cc.AudioClip })
    itemAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    pauseAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    levelUpAudio: cc.AudioClip = null;

    bg: any;
    item: any;
    dies: any;
    pause: any;
    levelUp: any;

    listEvent() {
        return ['playItemAudio', 'playBgAudio', 'playPauseAudio', 'playDiesAudio', 'playLevelUpAudio','closeBgAudio']
    }

    onEvent(event, params) {
        if (Global.isAudioPlaying) {
            if (event === 'playItemAudio') {
                this.playItemAudio();
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
            else if (event === 'playLevelUpAudio') {
                this.playLevelUpAudio();
            }
        }
    }

    onLoad() {
        GameComponent.prototype.onLoad.call(this);
        cc.audioEngine.playMusic(this.bgAudio, true);
        cc.audioEngine.setMusicVolume(0.1);
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
    
    playLevelUpAudio () {
        this.levelUp = cc.audioEngine.play(this.levelUpAudio, false, 0.6);
    }
    
    closeBgAudio() {
        cc.audioEngine.stop(this.bg);
    }

}
