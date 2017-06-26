package com.xiyuan.data;

import java.util.Scanner;

/**
 * Created by xiyuan_fengyu on 2017/6/26.
 */
public class PointsToArr {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line;
        while ((line = scanner.nextLine()) != null && !line.equals("quit")) {
            replace(line);
        }
    }

    private static void replace(String line) {
        //(-401,532) (-271,480) (102,263)
        line = line.replaceAll("(\\(|（)(-?\\d+) ?, ?(-?\\d+) ?(\\)|）) *", "[$2, $3], ");
        System.out.println(line.substring(0, line.length() - 2));
    }

}
