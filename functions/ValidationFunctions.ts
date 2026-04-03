/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import gibberish from "../structures/Gibberish"
import enLocale from "../assets/locales/en.json"
import commonPasswords from "../assets/json/common-passwords.json"
import bannedUsernames from "../assets/json/banned-usernames.json"
import badWords from "../assets/json/bad-words.json"
import tempMails from "../assets/json/temp-email.json"

export default class ValidationFunctions {
    public static parseSort = <T>(sortType: T, sortReverse: boolean) => {
        if (sortType === "random") return "random"
        if (sortReverse) {
            return `reverse ${sortType}` as T
        } else {
            return sortType as T
        }
    }

    public static isProfane = (text: string) => {
        const words = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/ +/g)
        for (const word of words) {
            for (const badWord of badWords) {
                if (atob(badWord).length <= word.length 
                && atob(badWord).includes(word.toLowerCase())) return true
            }
        }
        return false
    }

    public static validateUsername = (username: string, i18n: typeof enLocale) => {
        if (!username) return i18n.errors.username.empty
        const alphaNumeric = functions.util.alphaNumeric(username)
        if (!alphaNumeric || /[\n\r\s]+/g.test(username)) return i18n.errors.username.alphanumeric
        if (this.isProfane(username)) return i18n.errors.username.profane
        if (bannedUsernames.includes(username.toLowerCase())) return i18n.errors.username.disallowed
        if (/^\d+$/.test(username)) return i18n.errors.username.numericOnly
        const cleanUsername = functions.util.stripLinks(username).replace(/\d+/g, "")
        if (gibberish(cleanUsername)) return i18n.errors.username.gibberish
        return null
    }

    public static passwordStrength = (password: string) => {
        let counter = 0
        if (/[a-z]/.test(password)) counter++
        if (/[A-Z]/.test(password)) counter++
        if (/[0-9]/.test(password)) counter++
        if (!/^[a-zA-Z0-9]+$/.test(password)) counter++
        if (password.length < 10 || counter < 3) return "weak"
        if (password.length < 15) return "decent"
        return "strong"
    }

    public static validatePassword = (username: string, password: string, i18n: typeof enLocale) => {
        if (!password) return i18n.errors.password.empty
        if (password.toLowerCase().includes(username.toLowerCase())) return i18n.errors.password.username
        if (commonPasswords.includes(password)) return i18n.errors.password.common
        if (/ +/.test(password)) return i18n.errors.password.spaces
        if (password.length < 10) return i18n.errors.password.length
        const strength = this.passwordStrength(password)
        if (strength === "weak") return i18n.errors.password.weak
        return null
    }

    public static validateEmail = (email: string, i18n: typeof enLocale) => {
        if (!email) return i18n.errors.email.empty
        const regex = /^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        if (!regex.test(email)) return i18n.errors.email.invalid
        const domain = email.split("@")[1] || ""
        if (functions.util.arrayIncludes(domain, tempMails)) return i18n.errors.email.invalid
        return null
    }
}