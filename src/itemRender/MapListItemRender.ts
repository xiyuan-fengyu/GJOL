/**
 * Created by xiyuan_fengyu on 2017/6/27.
 */
class MapListItemRender extends eui.ItemRenderer {

    private radio: eui.RadioButton;

    protected createChildren(): void {
        this.radio = new eui.RadioButton();
        this.radio.skinName = "xy.RadioButtonSkin";
        this.addChild(this.radio);

        this.radio.addEventListener(egret.Event.CHANGE, event => {
            this.data.selected = this.radio.selected;
            (<eui.ArrayCollection>(<eui.DataGroup>this.parent).dataProvider).replaceItemAt(this.data, this.itemIndex);
        }, this);
    }

    protected dataChanged(): void {
        this.radio.selected = this.data.selected;
        this.radio.label = this.data.name;
    }

}