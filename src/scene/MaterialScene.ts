/**
 * Created by xiyuan_fengyu on 2017/6/26.
 */
class MaterialScene extends eui.UILayer {

    private ui: MaterialUI;

    private map: eui.Image;

    private materialItems: eui.Group;

    private positionLabels: eui.Group;

    private toolPanel: ToolPanel;

    private showPoint: eui.CheckBox;

    private mapList: eui.DataGroup;

    private mapListDataProvider: eui.ArrayCollection;

    private materialNote: eui.DataGroup;

    private materialNoteDataProvider: eui.ArrayCollection;

    private data: any;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.ui = new MaterialUI();
        this.addChild(this.ui);

        this.map = ChildrenFinder.findById<eui.Image>(this.ui, "map");
        this.materialItems = ChildrenFinder.findById<eui.Group>(this.ui, "materialItems");
        this.positionLabels = ChildrenFinder.findById<eui.Group>(this.ui, "positionLabels");
        this.initToolPanel();

        this.data = RES.getRes("materials_json");
        this.initMapList();
    }

    private initMapList() {
        this.mapListDataProvider.removeAll();
        let index = 0;
        Object.keys(this.data).forEach(key => {
           this.mapListDataProvider.addItem({
                name: key,
               selected: index++ == 0
           });
        });
    }

    private initToolPanel() {
        this.toolPanel = ChildrenFinder.findById<ToolPanel>(this.ui, "toolPanel");
        let content = ChildrenFinder.findById<eui.Group>(this.toolPanel, "content");
        this.showPoint = ChildrenFinder.findById<eui.CheckBox>(this.toolPanel, "showPoint");
        this.showPoint.addEventListener(egret.Event.CHANGE, event => {
            this.setMaterialsLabelVisibility(this.showPoint.selected);
        }, this);

        this.mapList = ChildrenFinder.findById<eui.DataGroup>(this.toolPanel, "mapList");
        this.mapList.itemRenderer = MapListItemRender;
        this.mapList.dataProvider = this.mapListDataProvider = new eui.ArrayCollection();
        this.mapListDataProvider.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, event => {
            let index = event.location;
            if (index < this.mapListDataProvider.length) {
                let item = this.mapListDataProvider.getItemAt(index);
                if (item.selected) {
                    this.replaceMap(item.name);
                }
            }
        }, this);

        this.materialNote = ChildrenFinder.findById<eui.DataGroup>(this.toolPanel, "materialNote");
        this.materialNote.itemRenderer = MaterialNoteItemRender;
        this.materialNote.dataProvider = this.materialNoteDataProvider = new eui.ArrayCollection();
        this.materialNoteDataProvider.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, event => {
            let index = event.location;
            if (index < this.materialNoteDataProvider.length) {
                let item = this.materialNoteDataProvider.getItemAt(index);
                this.setMaterialsVisibility(item.name, item.checked);
            }
        }, this);

        TouchUtil.addTapListener(ChildrenFinder.findById(this.toolPanel, "close"), event => {
           if (this.toolPanel["closed"] == true) {
               FadeUtil.fadeIn(content, () => {
                   this.toolPanel["closed"] = false;
               });
           }
           else {
                FadeUtil.fadeOut(content, () => {
                    this.toolPanel["closed"] = true;
                });
           }
        }, this);
    }

    private replaceMap(mapName: string) {
        let mapData = this.data[mapName];
        let materials = mapData.materials;
        this.map.source = RES.getRes(mapData.mapImg);
        let mapRect = mapData.mapRect;

        let diffColors = ColorUtil.diffColors();
        let positionLabelVisible = this.showPoint.selected;
        this.materialNoteDataProvider.removeAll();
        this.materialItems.removeChildren();
        this.positionLabels.removeChildren();
        Object.keys(materials).forEach(name => {
            let color = diffColors.next();
            this.materialNoteDataProvider.addItem({
                name: name,
                color: color,
                checked: true
            });

            materials[name].forEach(point => {
                let s = 14;
                let pointItem = new eui.Rect(s, s, color);
                pointItem.anchorOffsetX = pointItem.anchorOffsetY = s / 2;
                pointItem.ellipseWidth = pointItem.ellipseHeight = s;
                pointItem["type"] = name;
                let pos = this.mapPoint(mapRect, point);
                pointItem.x = pos[0];
                pointItem.y = pos[1];
                this.materialItems.addChild(pointItem);

                let label = new PositionLabel();
                (<eui.Label>label["label"]).text = `(${point[0]}, ${point[1]})`;
                this.positionLabels.addChild(label);
                label.x = pointItem.x + pointItem.width;
                label.y = pointItem.y - label.height / 2;
                label.visible = positionLabelVisible;

                pointItem["label"] = label;

                TouchUtil.addHoverInListener(pointItem, event => {
                    if (!this.showPoint.selected) {
                        FadeUtil.fadeIn(pointItem["label"]);
                    }
                }, this);
                TouchUtil.addHoverOutListener(pointItem, event => {
                    if (!this.showPoint.selected) {
                        FadeUtil.fadeOut(pointItem["label"]);
                    }
                }, this);
            });
        });
    }

    private setMaterialsVisibility(type: string, visible: boolean) {
        for (let i = 0, len = this.materialItems.numChildren; i < len; i++) {
            let child = this.materialItems.getChildAt(i);
            if (child["type"] == type) {
                child.visible = visible;
                (<PositionLabel>child["label"]).visible = visible;
            }
        }
    }

    private setMaterialsLabelVisibility(visible) {
        for (let i = 0, len = this.materialItems.numChildren; i < len; i++) {
            let child = this.materialItems.getChildAt(i);
            let label = <PositionLabel>child["label"];
            label.visible = child.visible && visible;
            label.alpha = 1;
        }
    }

    private mapPoint(mapRect: number[], point: number[]): number[] {
        return [
            (point[0] - mapRect[0]) / (mapRect[2] - mapRect[0]) * this.map.width,
            (point[1] - mapRect[1]) / (mapRect[3] - mapRect[1]) * (this.map.height - 48) + 48
        ];
    }

}