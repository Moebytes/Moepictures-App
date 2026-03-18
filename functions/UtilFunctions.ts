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

    public static appendURLParams = (url: string, params: {[key: string]: string | boolean | undefined}) => {
        if (!url) return ""
        const [baseUrl, hash] = url.split("#")
        const obj = new URL(baseUrl)
    
        for (const [key, value] of Object.entries(params)) {
            if (typeof value !== "undefined") obj.searchParams.set(key, value.toString())
        }

        const query = obj.searchParams.toString()
        let base = obj.pathname.endsWith("/") ? obj.pathname.slice(0, -1) : obj.pathname
        if (obj.origin) base = obj.origin + base
        const link = query ? `${base}?${query}` : base

        return hash ? `${baseUrl}#${hash.split("?")[0]}?${query}` : link
    }

    public static readableFileSize = (bytes: number) => {
        const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024))
        return `${Number((bytes / Math.pow(1024, i)).toFixed(2))} ${["B", "KB", "MB", "GB", "TB"][i]}`
    }

    public static toProperCase = (str: string) => {
        if (!str) return ""
        return str.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            }
        )
    }
}