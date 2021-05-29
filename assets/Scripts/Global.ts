/*
 * @Autor: Rao
 * @Date: 2021-05-25 14:17:41
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-28 22:29:14
 * @Description: 
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Global {
    static mapCount: number = 0;    // 地图（关卡）数量 
    static isAudioPlaying: boolean = true;
    static isHeroRevive: boolean = false;   // 是否刚刚复活？为了应对map>2时玩家重新生成时的heroInfo初始化问题
    static heroInfo: any;    // Info是玩家在换一个关卡时需要的。
    static heroData:any;    // data是玩家复活（未回到菜单界面）时一直需要存在的。
    static curMapIndex : number = 0;
    static heroDirX:number = 1;

}
