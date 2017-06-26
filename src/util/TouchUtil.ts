/**
 * Created by xiyuan_fengyu on 2017/5/9.
 */
class TouchUtil {

    static addTapListener(obj: egret.DisplayObject, callback: any, target: any, stopPropagation: boolean = true) {
        if (obj && callback && target) {
            obj.touchEnabled = true;
            if (stopPropagation) {
                obj.addEventListener(egret.TouchEvent.TOUCH_TAP, event => {
                    event.stopPropagation();
                    callback.call(target, event);
                }, target);
            }
            else {
                obj.addEventListener(egret.TouchEvent.TOUCH_TAP, callback, target);
            }
        }
    }

    static addHoverInListener(obj: egret.DisplayObject, callback: any, target: any, stopPropagation: boolean = true) {
        if (obj && callback && target) {
            obj.touchEnabled = true;
            if (stopPropagation) {
                obj.addEventListener(mouse.MouseEvent.MOUSE_OVER, event => {
                    event.stopPropagation();
                    callback.call(target, event);
                }, target);
            }
            else {
                obj.addEventListener(mouse.MouseEvent.MOUSE_OVER, callback, target);
            }
        }
    }

    static addHoverOutListener(obj: egret.DisplayObject, callback: any, target: any, stopPropagation: boolean = true) {
        if (obj && callback && target) {
            obj.touchEnabled = true;
            if (stopPropagation) {
                obj.addEventListener(mouse.MouseEvent.MOUSE_OUT, event => {
                    event.stopPropagation();
                    callback.call(target, event);
                }, target);
            }
            else {
                obj.addEventListener(mouse.MouseEvent.MOUSE_OUT, callback, target);
            }
        }
    }

}