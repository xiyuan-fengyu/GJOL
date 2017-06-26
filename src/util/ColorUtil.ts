/**
 * Created by xiyuan_fengyu on 2017/6/26.
 */
class ColorUtil {

    static readonly colors = [
        0xd81e06,
        0xf4ea29,
        0x0e932e,
        0x0061b2,
        0x112079,
        0xd6204b,
        0xe8989a,
        0xbd8cbb,
        0x87a7d6,
        0x87c38f,
        0xf9f28b,
        0xea986c,
        0x000000,
        0x707070,
        0xcdcdcd,
        0xffffff
    ];

    private index: number;

    private constructor() {
        this.index = -1;
    }

    public next(): number {
        this.index += 1;
        this.index %= ColorUtil.colors.length;
        return ColorUtil.colors[this.index];
    }

    static diffColors(): ColorUtil {
        return new ColorUtil();
    }

}