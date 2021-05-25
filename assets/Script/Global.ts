/*
 * @Autor: Rao
 * @Date: 2021-05-25 14:17:41
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-25 14:24:08
 * @Description: 
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Global {
    static shiftY: number = 0;  // hero的Y轴偏移量
    static mapCount: number = 1;    // 地图（关卡）数量
 
}
