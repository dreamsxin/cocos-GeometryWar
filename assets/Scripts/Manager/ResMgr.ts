/*
 * @Autor: Rao
 * @Date: 2021-04-04 09:31:17
 * @LastEditors: Rao
 * @LastEditTime: 2021-04-09 13:52:56
 * @Description: 
 */

export default class ResMgr{
    
    static instance: ResMgr = null;

    static getInstance() {
        if (!ResMgr.instance) {
            ResMgr.instance =  new ResMgr();
        }
        return ResMgr.instance;
    }

    private constructor(){}
    
    allCache = {
        spriteFrame: new Map(),
        prefab: new Map(),
        config: new Map(),
        tileMap: new Map(),
    }
   
    addData(type, key, data) {
        if (!type || typeof(type)!=='string' || !key || typeof(key) !== 'string' || !data) {
            return;
        }
        this.allCache[type].set(key, data);
    }

    getData(type, key){
        if (!type || typeof(type)!=='string' || !key || typeof(key) !== 'string') {
            return;
        }
        this.allCache[type].get(key);
    }

    getSpriteFrame(key) {
        return this.allCache['spriteFrame'].get(key); 
    }

    getConfig(key) {
        return this.allCache['config'].get(key);
    }
    
    getPrefab(key) {
        return this.allCache['prefab'].get(key);
    }
    
    getTileMap(key) {
        return this.allCache['tileMap'].get(key);
    }
}
