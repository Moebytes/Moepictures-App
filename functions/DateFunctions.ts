/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import enLocale from "../assets/locales/en.json"

export default class DateFunctions {
    public static formatDate = (date: Date, yearFirst?: boolean) => {
        if (!date || Number.isNaN(date.getTime())) return ""
        let year = date.getFullYear()
        let month = (1 + date.getMonth()).toString()
        let day = date.getDate().toString()
        if (yearFirst) return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        return `${month}-${day}-${year}`
    }

    public static timeAgo = (input: string, i18n: typeof enLocale) => {
        if (!input) return "?"
        const date = new Date(input.replace(/ +/g, "T"))
        const seconds = Math.floor(((new Date().getTime() / 1000) - (date.getTime() / 1000)))
    
    
        const parseTime = (value: number, unit: string) => {
            return i18n.time.plural ? `${value} ${unit}${value === 1 ? "" : i18n.time.plural} ${i18n.time.ago}` : `${value}${unit}${i18n.time.ago}`
        }
    
        const years = seconds / 31536000
        if (years >= 1) return parseTime(Math.floor(years), i18n.time.year)
    
        const months = seconds / 2592000
        if (months >= 1) return parseTime(Math.floor(months), i18n.time.month)
    
        const days = seconds / 86400
        if (days >= 1) return parseTime(Math.floor(days), i18n.time.day)
    
        const hours = seconds / 3600
        if (hours >= 1) return parseTime(Math.floor(hours), i18n.time.hour)
    
        const minutes = seconds / 60
        if (minutes >= 1) return parseTime(Math.floor(minutes), i18n.time.minute)
    
        return parseTime(seconds, i18n.time.second)
    }

    public static timeUntil = (input: string | null, i18n: typeof enLocale) => {
        if (!input) return "?"
        const date = new Date(input.replace(/ +/g, "T"))
        const now = new Date().getTime()
        const seconds = Math.floor((date.getTime() - now) / 1000)
    
        const parseTime = (value: number, unit: string) => {
            return i18n.time.plural ? `${value} ${unit}${value === 1 ? "" : i18n.time.plural}` : `${value}${unit}`
        }
    
        const years = seconds / 31536000
        if (years >= 1) return parseTime(Math.floor(years), i18n.time.year)
    
        const months = seconds / 2592000
        if (months >= 1) return parseTime(Math.floor(months), i18n.time.month)
    
        const days = seconds / 86400
        if (days >= 1) return parseTime(Math.floor(days), i18n.time.day)
    
        const hours = seconds / 3600
        if (hours >= 1) return parseTime(Math.floor(hours), i18n.time.hour)
    
        const minutes = seconds / 60
        if (minutes >= 1) return parseTime(Math.floor(minutes), i18n.time.minute)
    
        return parseTime(seconds, i18n.time.second)
    }
}