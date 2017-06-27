/**
 * Created by xiyuan_fengyu on 2017/6/26.
 */
class ColorUtil {

    static diffColors(): DiffColors {
        return new DiffColors();
    }

    static rgbArrToInt(rgb: number[]): number {
        return rgb[0] << 16 + rgb[1] << 8 + rgb[2];
    }

}

class DiffColors {

    static readonly colors = [
        0x001f3f,
        0xFF851B,
        0x0074D9,
        0xFF4136,
        0x7FDBFF,
        0x85144b,
        0x39CCCC,
        0xF012BE,
        0x3D9970,
        0xB10DC9,
        0x2ECC40,
        0x111111,
        0x01FF70,
        0xAAAAAA,
        0xFFDC00,
        0xDDDDDD
    ];

    private index: number;

    constructor() {
        this.index = -1;
    }

    public next(): number {
        this.index += 1;
        this.index %= DiffColors.colors.length;
        return DiffColors.colors[this.index];
    }

}