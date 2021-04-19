/*
 * @Autor: Rao
 * @Date: 2021-04-05 14:32:02
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-12 18:47:09
 * @Description: 
 */
import ResMgr from "./ResMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIMgr {
    static instance: UIMgr = null;
    static getInstance() {
        if (!UIMgr.instance) {
            UIMgr.instance = new UIMgr();
        }
        return UIMgr.instance;
    }

    openUINode(parentNode, uiName) {
        let pfbName = ResMgr.getInstance().getPrefab(uiName);
        let pfbNode = cc.instantiate(pfbName);
        parentNode.addChild(pfbNode);
        pfbNode.addComponent(uiName);
    }

    closeUINode(curNode) {
        curNode.destroy();
    }

    addBtnClickEvent(btnNode: cc.Node, target, callFunc) {
        let botton = btnNode.getComponent(cc.Button);
        if(!botton) {
            return;
        }
        btnNode.on('click', callFunc, target);
    }
}
