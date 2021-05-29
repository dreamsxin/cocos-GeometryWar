/*
 * @Autor: Rao
 * @Date: 2021-04-04 21:58:48
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-22 23:03:05
 * @Description: 
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventMgr {

    static instance: EventMgr = null;
    static getInstance() {
        if (!EventMgr.instance) {
            EventMgr.instance = new EventMgr();
        }
        return EventMgr.instance;
    }

    _events = new Map();

    addEventListener(event, callFunc, target) {
        if(typeof event !== 'string' || typeof callFunc !== 'function' || !target) {
            cc.error('Error of Null');
            return;
        }
        if(!this._events.has(event)) {
            this._events.set(event, []);
        }
        let listener = this._events.get(event);
        let len = listener.length;
        listener[len] = {
            target: target,
            callFunc: callFunc
        }
    }
    EventDispatcher(event, params ?){
        if (!event || typeof event !== 'string' || !this._events.has(event)) {
            return;
        }
        let listeners = this._events.get(event);
        listeners.forEach( function(listener) {
            listener && listener.callFunc.call(listener.target, event, params); 
        }.bind(this)); 
    }
    removeEventListener(event,  target?) {
        if (!event || typeof event !== 'string' || !this._events.has(event)) {
            return;
        }
        let len = arguments.length;
        if (len === 1) {
            this._events.delete(event);
        }
        else if (len === 2) {
            let targets = this._events.get(event);
            for(let i=targets.length-1; i>=0; --i) {
                if (targets[i].target === target) {
                    targets.splice(i, 1);
                    break;
                }
            }
        }
    }
}
// let EventMgr = { 
//     _events: new Map(),

//     addEventListener(event, callFunc, target) {
//         if (typeof event !== 'string' || typeof callFunc !== 'function' || !target) {
//             cc.error('Error of Null');
//             return;
//         }
//         if (!this._events.has(event)) {
//             this._events.set(event, []);
//         }
//         let listener = this._events.get(event);
//         let len = listener.length;
//         listener[len] = {
//             target: target,
//             callFunc: callFunc
//         }
//     },
//     EventDispatcher(event, params?) {
//         if (!event || typeof event !== 'string' || !this._events.has(event)) {
//             return;
//         }
//         let listeners = this._events.get(event);
//         listeners.forEach(function (listener) {
//             listener && listener.callFunc.call(listener.target, event, params);
//         }.bind(this));
//     },
//     removeEventListener(event, callFunc, target) {
//         if (!event || typeof event !== 'string' || !this._events.has(event)) {
//             return;
//         }

//     }
// }

// export default EventMgr; 