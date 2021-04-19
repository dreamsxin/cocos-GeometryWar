/*
 * @Autor: Rao
 * @Date: 2021-04-06 21:36:44
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-19 13:43:25
 * @Description: 
 */

import GameComponent from "../GameComponent";
import ResMgr from "../Manager/ResMgr";
import EventMgr from "../Manager/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends GameComponent {
    private _Dir: cc.Vec2;
    private _velX: number;
    private _velY: number;
    private _aclY: number;
    
    private _life: number;
    private _hp: number;
    private _ack: number;
    private _isUltra: boolean = false; 
    
    private _curExp: number;
    private _needExp:number;
    private _anim: cc.Animation;
    private _scale: number;
    private _isRailColli: boolean;
    private _railNode:cc.Node = null;
    props = {
        life: this._life,
        hp: this._hp,
        ack: this._ack,
        curExp: this._curExp,
        needExp: this._needExp
    }
    
    onLoad() {
        let heroConfig = ResMgr.getInstance().getConfig('heroDt')[0];
        this.init(heroConfig);
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    init(heroConfig) {
        for (const key in this.props) {
            this.props[key] = heroConfig[key];
        }
        this.node.x = 200;
        this.node.y = 200;
        this._velX = 0;
        this._velY = 0;
        this._aclY = -1280;
        this._Dir = cc.v2(0,-1);
        this._anim = this.getComponent(cc.Animation);
        this._anim.play('HeroNormal');
        this._scale = 1;
        this._isRailColli = false;
    }
    
    get dirX() {
        return this._Dir.x;
    }
    set dirX(num:number) {
        this._Dir.x = num;
    }

    get dirY() {
        return this._Dir.y;
    }
    set dirY(num:number) {
        this._Dir.y = num;
    }
    
    get life() {
        return this.props['life'];
    }
    set life(num: number) {
        this.props['life'] = num;
    }

    get hp() {
        return this.props['hp'];
    }
    set hp(num: number) {
        this.props['hp'] = num;
    }

    get ack() {
        return this.props['ack'];
    }
    set ack(num: number) {
        this.props['ack'] = num;
    }

    get aclY() {
        return this._aclY;
    }
    
    get velY() {
        return this._velY;
    }
    set velY(num: number) {
        this._velY = num;
    }
    
    get velX() {
        return this._velX;
    }
    set velX(num: number) {
        this._velX = num;
    }

    get needExp() {
        return this.props['needExp'];
    }
    set needExp(num: number) {
        this.props['needExp'] = num;
    }

    get curExp() {
        return this.props['curExp'];
    }
    set curExp(num: number) {
        this.props['curExp'] = num;
    }

    update(dt) {
         this.updateVel(dt);
         this.updatePosition(dt);
         this.checkRailColli();
    }
    
    checkRailColli() {
        if (this._isRailColli) {
            let isLeave = Math.abs(this._railNode.x - this.node.x)+5 > this._railNode.width/2+this.node.width*this._scale/2;
            if (isLeave) {
                this.dirY = -1;
                this._isRailColli=false;
            }
        }
    }
    
    updateVel(dt) {
        this.velY += dt*this.aclY*this.dirY;
        if(this.velY <= 0) {
            this.dirY = -1;
        }
    }

    updatePosition(dt) {
        this.node.y += this.velY*dt*this.dirY;
        this.node.x += this.velX*dt*this.dirX;  
    }

    onCollisionEnter(other) {
        let colliName = other.node.group;
        if(colliName === 'ground') {
            this.velY = 0;
            this.dirY = 0;
            if (this.node.y - other.node.y <= this.node.height*this._scale/2 + other.node.height/2) {
                // this.node.getScale(cc.v2())
                this.node.y = other.node.height/2+this.node.height*this._scale/2 - 2;
            } 
        }
        else if (colliName === 'rail') {
            if (this.dirY === 1) {
                this.dirY = -1;
                this.dirX = 0;
            }
            else if(this.dirY === -1) {
                // Math.abs(other.node.x - this.node.x) < other.node.width/2+this.node.width*this._scale/2 - 2
                if (this.node.y >= other.node.y+(other.node.height/2+this.node.height*this._scale/2) - 10) {
                    this.node.y = other.node.y+other.node.height/2+this.node.height*this._scale/2;
                    this.dirY = 0;
                    this._railNode = other.node;
                    this._isRailColli=true;
                }
                else {
                    this.dirX = 0;
                }
            }
        }

        else if (colliName === 'item') {
            this.node.scale = 1.8;
            this._scale = 1.8;
            this._isUltra = true;
            
            this.scheduleOnce(function () {
                this.node.scale = 1;
                this._scale = 1;
                this._isUltra = false;
            }, 3);
        }

        else if (colliName === 'obstacle') {
            if (this._isUltra) {
                EventMgr.getInstance().EventDispatcher('rotateObstacle', this.node.getPosition());
                return;
            }
            this.life--;
            EventMgr.getInstance().EventDispatcher('updateHeroLife');
            
        }
        
        // else if (colliName === 'rail') {
        //     this._velY = 0;
        //     this._aclY = 0; 
        //     if (this.node.y - other.node.y <= this.node.height*this.node.getScale(cc.v2()).x/2 + other.node.height/2) {
        //         this.node.y = other.node.height/2+this.node.height*this.node.getScale(cc.v2()).x/2 - 2;
        //     } 
        // }
    }
    onCollisionStay(other) {
        let colliName = other.node.group;
        if(colliName === 'ground') {
            this.node.y = other.node.height/2+this.node.height*this.node.getScale(cc.v2()).x/2 - 2;
        }
    }
    onCollisionExit(other) {
        let colliName = other.node.group;
        // if(colliName === 'ground') {
        //     this.dirY = 1;
        // }
        // else if(colliName === 'rail') {
        //     this.dirY = -1;
        // }
        // if (colliName === 'item') {
        //     // EventMgr.getInstance().EventDispatcher('removeItem');
        // }
        // if(colliName === 'rail') {
        //     this.dirY = -1;
        // }
    }

    jump() {
        this.velY = 850;
        this.dirY = 1;
    }

    changeAniamtion(isRight) {
        !isRight && this._anim.play('HeroTurnLeft');
        isRight && this._anim.play('HeroNormal');
    }

    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.d:
                this.velX = 200;
                this.dirX = 1;
                this.changeAniamtion(true); 
                break;
            case cc.macro.KEY.a:
                this.velX = 250;
                this.dirX = -1;
                this.changeAniamtion(false);   
                break;
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.d:
                this.velX = 0;
                this.dirX = 0;
                break;
            case cc.macro.KEY.a:
                this._velX = 0;
                this.dirX = 0;
                break;
        }
    }
}
