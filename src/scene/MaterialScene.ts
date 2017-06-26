/**
 * Created by xiyuan_fengyu on 2017/6/26.
 */
class MaterialScene extends eui.UILayer {

    private ui: MaterialUI;

    private map: eui.Image;

    private materialItems: eui.Group;

    private toolPanel: ToolPanel;

    private showPoint: eui.CheckBox;

    private materialNote: eui.DataGroup;

    private materialNoteDataProvider: eui.ArrayCollection;

    private data: any;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.ui = new MaterialUI();
        this.addChild(this.ui);

        this.map = ChildrenFinder.findById<eui.Image>(this.ui, "map");
        this.materialItems = ChildrenFinder.findById<eui.Group>(this.ui, "materialItems");
        this.initToolPanel();

        this.data = RES.getRes("materials_json");
        this.replaceMap(Object.keys(this.data)[0])
    }

    private initToolPanel() {
        this.toolPanel = ChildrenFinder.findById<ToolPanel>(this.ui, "toolPanel");
        let content = ChildrenFinder.findById<eui.Group>(this.toolPanel, "content");
        this.showPoint = ChildrenFinder.findById<eui.CheckBox>(this.toolPanel, "showPoint");
        this.showPoint.addEventListener(egret.Event.CHANGE, event => {
            this.setMaterialsLabelVisibility(this.showPoint.selected);
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
        this.materialNoteDataProvider.removeAll();
        this.materialItems.removeChildren();
        Object.keys(materials).forEach(name => {
            let color = diffColors.next();
            this.materialNoteDataProvider.addItem({
                name: name,
                color: color,
                checked: true
            });

            materials[name].forEach(point => {
                let pointItem = new PositionItem();
                (<eui.Rect>pointItem["bg"]).fillColor = color;
                (<eui.Label>pointItem["label"]).text = `(${point[0]}, ${point[1]})`;
                pointItem["type"] = name;

                let pos = MaterialScene.mapPoint(mapRect, point);
                pointItem.x = pos[0] * this.map.width;
                pointItem.y = pos[1] * (this.map.height - 48) + 48;

                TouchUtil.addHoverInListener(pointItem, event => {
                    if (!this.showPoint.selected) {
                        FadeUtil.fadeIn(<eui.Group>pointItem["pointBox"]);
                    }
                }, this);
                TouchUtil.addHoverOutListener(pointItem, event => {
                    if (!this.showPoint.selected) {
                        FadeUtil.fadeOut(<eui.Group>pointItem["pointBox"]);
                    }
                }, this);
                this.materialItems.addChild(pointItem);
            });
        });
    }

    private setMaterialsVisibility(type: string, visible: boolean) {
        for (let i = 0, len = this.materialItems.numChildren; i < len; i++) {
            let child = this.materialItems.getChildAt(i);
            if (child["type"] == type) {
                child.visible = visible;
            }
        }
    }

    private setMaterialsLabelVisibility(visible) {
        for (let i = 0, len = this.materialItems.numChildren; i < len; i++) {
            let child = this.materialItems.getChildAt(i);
            (<eui.Group>child["pointBox"]).visible = visible;
        }
    }

    private static mapPoint(mapRect: number[], point: number[]): number[] {
        return [
            (point[0] - mapRect[0]) / (mapRect[2] - mapRect[0]),
            (point[1] - mapRect[1]) / (mapRect[3] - mapRect[1])
        ];
    }

}