/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export default class ValidationFunctions {
    public static parseSort = <T>(sortType: T, sortReverse: boolean) => {
        if (sortType === "random") return "random"
        if (sortReverse) {
            return `reverse ${sortType}` as T
        } else {
            return sortType as T
        }
    }
}