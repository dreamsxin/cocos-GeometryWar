/*
 * @Autor: Rao
 * @Date: 2021-04-03 14:44:31
 * @LastEditors: Rao
 * @LastEditTime: 2021-05-28 07:21:46
 * @Description: 
 */

const {ccclass, property} = cc._decorator;


import ResMgr from './Manager/ResMgr';
import Global from './Global';
@ccclass
export default class Loading extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar=null;
    
    onLoad () {
        let progressCountN = this.node.getChildByName('progressCount');
        let progressCountLab = progressCountN.getComponent(cc.Label);

        cc.resources.loadDir('./', (finishCount: number, totalCount: number, item):void=>{
                this.progressBar.progress = finishCount/totalCount; 
                progressCountLab.string = finishCount+'/'+totalCount;
            }, 
            (err, assets)=>{
                if(err) {
                    return;
                } 
                for(let i = 0; i < assets.length; i++) {
                    let asset = assets[i];
                    if(asset instanceof cc.JsonAsset) {
                        ResMgr.getInstance().addData('config', asset.name, asset.json); 
                    }
                    else if (asset instanceof cc.TiledMapAsset) {
                        ResMgr.getInstance().addData('tileMap', asset.name, asset);
                        Global.mapCount++;
                    }
                    else if(asset instanceof cc.SpriteFrame) {
                        ResMgr.getInstance().addData('spriteFrame', asset.name, asset);
                    }
                    else if(asset instanceof cc.Prefab) {
                        ResMgr.getInstance().addData('prefab', asset.name, asset);
                    }
                }
                cc.director.loadScene('GameScene');
            });
    }
}
