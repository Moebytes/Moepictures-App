/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export default class UtilFunctions {
    public static arrayIncludes = (str: string | undefined, arr: string[]) => {
        for (let i = 0; i < arr.length; i++) {
            if (str?.includes(arr[i])) return true
        }
        return false
    }

    public static parseURLParams = (url: string, params?: object | null) => {
        if (!params) return url
        const parsed = new URL(url)
        Object.entries(params).forEach(([key, value]) => {
            parsed.searchParams.delete(key)
            if (value === undefined || value === null) return

            if (Array.isArray(value)) {
                value.forEach((v) => parsed.searchParams.append(key, String(v)))
            } else {
                parsed.searchParams.set(key, String(value))
            }
        })
        return parsed.toString()
    }
}