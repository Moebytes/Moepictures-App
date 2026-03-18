/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export default class DateFunctions {
    public static formatDate = (date: Date, yearFirst?: boolean) => {
        if (!date || Number.isNaN(date.getTime())) return ""
        let year = date.getFullYear()
        let month = (1 + date.getMonth()).toString()
        let day = date.getDate().toString()
        if (yearFirst) return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        return `${month}-${day}-${year}`
    }

    public static timeAgo = (input: string) => {
        if (!input) return "?"
        const date = new Date(input.replace(/ +/g, "T"))
        const seconds = Math.floor(((new Date().getTime() / 1000) - (date.getTime() / 1000)))
    
        const parseTime = (value: number, unit: string) => {
            return `${value} ${unit}${value === 1 ? "" : "s"} ago`
        }
    
        const years = seconds / 31536000
        if (years >= 1) return parseTime(Math.floor(years), "year")
    
        const months = seconds / 2592000
        if (months >= 1) return parseTime(Math.floor(months), "month")
    
        const days = seconds / 86400
        if (days >= 1) return parseTime(Math.floor(days), "day")
    
        const hours = seconds / 3600
        if (hours >= 1) return parseTime(Math.floor(hours), "hour")
    
        const minutes = seconds / 60
        if (minutes >= 1) return parseTime(Math.floor(minutes), "minute")
    
        return parseTime(seconds, "second")
    }
}