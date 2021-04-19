/*
 * @Autor: Rao
 * @Date: 2021-04-04 13:40:17
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-12 21:42:02
 * @Description: 
 */
import EventMgr from "./Manager/EventMgr";
import ResMgr from "./Manager/ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameComponent extends cc.Component {
    uiNodes = {};
    
    onLoad() {
        this.bindUINodes(this.node, '');
        this.addEventListner();
    }
    start() {
        //this.start();
    }
    bindUINodes(root: cc.Node, path: string) {
        let nodes = root.children;
        for (let i = 0; i < nodes.length; ++i) {
            this.bindUINodes(nodes[i], path + nodes[i].name + "/");
            if (nodes[i].name.startsWith('_')) {
                this.uiNodes[path + nodes[i].name] = nodes[i];
                
            }
        }
    }
    getRootNode() {
        let root = this.node.getChildByName('Game');
        if (root) {
            return root
        }
    }
    
    bindBtnEvent(btnNode:cc.Node, caller, callFunc) {
        if (!btnNode || !caller || !callFunc || typeof callFunc !== 'function') {
            return;
        }
        let btn = btnNode.getComponent(cc.Button);
        if(!btn) {
            return;
        }
        btnNode.on('click', callFunc, caller);
    }
    
    listEvent():any {
        return;
    }
    onEvent(event, params) {
        return;
    }
    
    addEventListner() {
        if (this.listEvent && this.onEvent) {
            let events = this.listEvent();
            if (events) {
                for (let i=0; i<events.length; ++i) {
                    EventMgr.getInstance().addEventListener(events[i], this.onEvent, this);
                }
            }
        }
    }


    
}
