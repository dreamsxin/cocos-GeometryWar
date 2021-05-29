/*
 * @Autor: Rao
 * @Date: 2021-04-05 14:32:02
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-26 15:47:54
 * @Description: 
 */
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIMgr {

    lastScene: string = '';
    haveDialog: boolean = false;    // 弹窗的数量。同一界面只能有一个弹窗
    
    static instance: UIMgr = null;
    static getInstance() {
        if (!UIMgr.instance) {
            UIMgr.instance = new UIMgr();
        }
        return UIMgr.instance;
    }

    openUINode(parentNode, uiName, uiType) {
        if (!this.haveDialog) {
            let pfbName = ResMgr.getInstance().getPrefab(uiName);
            let pfbNode = cc.instantiate(pfbName);
            parentNode.addChild(pfbNode);
            pfbNode.addComponent(uiName);
            if (uiType==='dialog') {
                this.haveDialog = true;
            }
        } 
    }

    closeUINode(curNode, uiType?) {
        this.lastScene = curNode.name;
        if (uiType==='dialog') {
            this.haveDialog = false;
        }
        curNode.destroy();
    }

    setIsHaveDialog(rst:boolean) {
        this.haveDialog = rst;
    }
    
    getLastScene() {
        return this.lastScene;
    }

    addBtnClickEvent(btnNode: cc.Node, target, callFunc) {
        let botton = btnNode.getComponent(cc.Button);
        if (!botton) {
            return;
        }
        btnNode.on('click', callFunc, target);
    }

}
