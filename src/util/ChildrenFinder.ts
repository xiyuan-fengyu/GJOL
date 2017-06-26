/**
 * Created by xiyuan_fengyu on 2017/4/19.
 */
class ChildrenFinder {

    static find<T extends egret.DisplayObject>(from: egret.DisplayObjectContainer, regex: string): Array<T> {
        if (from && regex) {
            return Object.keys(from).filter(key => key.match(regex)).map(key => {
                let item = from[key];
                item.id = key;
                return <T> item;
            });
        }
        else return [];
    }

    static findById<T extends egret.DisplayObject>(from: egret.DisplayObjectContainer, id: string): T {
        if (from && id) {
            let obj = from[id];
            if (obj) {
                obj.id = id;
                return <T>obj;
            }
        }
        return null;
    }

    static findByType<T extends egret.DisplayObject>(from: egret.DisplayObjectContainer, type: {new(...args): T}): Array<T> {
        let result: Array<T> = [];
        for (let i = 0; i < from.numChildren; i++) {
            let child = from.getChildAt(i);
            if (child instanceof type) {
                result.push(child);
            }
        }
        return result;
    }

}