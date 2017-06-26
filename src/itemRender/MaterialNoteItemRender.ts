/**
 * Created by xiyuan_fengyu on 2017/6/26.
 */
class MaterialNoteItemRender extends eui.ItemRenderer {

    private checker: eui.Rect;

    private label: eui.Label;

    protected createChildren(): void {
        let ui = new MaterialNoteItem();
        this.addChild(ui);

        this.checker = ChildrenFinder.findById<eui.Rect>(ui, "checker");
        this.label = ChildrenFinder.findById<eui.Label>(ui, "label");

        TouchUtil.addTapListener(this, event => {
            this.data.checked = !this.data.checked;
            (<eui.ArrayCollection>(<eui.DataGroup>this.parent).dataProvider).replaceItemAt(this.data, this.itemIndex);
        }, this);
    }

    protected dataChanged(): void {
        this.checker.fillColor = this.data.color;
        this.checker.strokeColor = this.data.color;
        this.checker.fillAlpha = this.data.checked ? 1 : 0;

        this.label.text = this.data.name;
        this.label.textColor = this.data.color;
    }

}