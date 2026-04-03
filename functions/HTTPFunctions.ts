/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "./Functions"
import asyncStorage from "@react-native-async-storage/async-storage"
import decryption from "../structures/Decryption"
import {GetEndpoint, PostEndpoint, PutEndpoint, DeleteEndpoint, Session} from "../types/Types"
import {siteURL} from "../ui/site"

export default class HTTPFunctions {
    public static privateKey = ""
    public static privateKeyLock = false
    public static publicKey = ""
    public static publicKeyLock = false

    public static updateClientKeys = async (session: Session) => {
        if (this.privateKey) return this.privateKey
        if (this.privateKeyLock) await functions.timeout(100 + Math.random() * 100)
        if (!this.privateKey) {
            this.privateKeyLock = true
            const savedPublicKey = await asyncStorage.getItem("publicKey") as string
            const savedPrivateKey = await asyncStorage.getItem("privateKey") as string
            if (savedPublicKey && savedPrivateKey) {
                await functions.http.post("/api/client-key", {publicKey: savedPublicKey}, session)
                this.privateKey = savedPrivateKey
            } else {
                const keys = decryption.generateKeys()
                await functions.http.post("/api/client-key", {publicKey: keys.publicKey}, session)
                await asyncStorage.setItem("publicKey", keys.publicKey)
                await asyncStorage.setItem("privateKey", keys.privateKey)
                this.privateKey = keys.privateKey
            }
        }
        return this.privateKey
    }

    public static updateServerKey = async (session: Session) => {
        if (this.publicKey) return this.publicKey
        if (this.publicKeyLock) await functions.timeout(100 + Math.random() * 100)
        if (!this.publicKey) {
            this.publicKeyLock = true
            const response = await functions.http.post("/api/server-key", null, session)
            this.publicKey = response.publicKey
        }
        return this.publicKey
    }

    public static arrayBufferToJSON = (arrayBuffer: ArrayBuffer) => {
        if (!arrayBuffer?.byteLength) return

        try {
            const bytes = new Uint8Array(arrayBuffer)
            let text = ""

            for (let i = 0; i < bytes.length; i++) {
                text += String.fromCharCode(bytes[i])
            }

            text = decodeURIComponent(escape(text))
            return JSON.parse(text)
        } catch {
            return null
        }
    }

    public static get = async <T extends string>(endpoint: T, params: GetEndpoint<T>["params"], session: Session) => {
        const privateKey = await this.updateClientKeys(session)
        const publicKey = await this.updateServerKey(session)
        const headers = {"x-csrf-token": session.csrfToken}

        try {
            let parsedURL = functions.util.parseURLParams(siteURL + endpoint, params)
            let response = await fetch(parsedURL, {headers, credentials: "include"})

            if (response.status === 404) throw new Error("404")
            if (response.status === 403) throw new Error("403")
            if (!response.ok) throw new Error(await response.text())

            let arrayBuffer = await response.clone().arrayBuffer()
            const json = functions.http.arrayBufferToJSON(arrayBuffer)
            if (json !== null) return json as GetEndpoint<T>["response"]
            
            let decrypted = decryption.decryptAPI(arrayBuffer, privateKey, publicKey, session)?.toString()
            try {
                decrypted = JSON.parse(decrypted!)
            } catch {}
            return decrypted as GetEndpoint<T>["response"]
        } catch (err: any) {
            return Promise.reject(err)
        }
    }

    public static post = async <T extends string>(endpoint: T, data: PostEndpoint<T>["params"], session: Session) => {
        const headers = {"Content-Type": "application/json", "x-csrf-token": session.csrfToken}
        try {
            let body = data ? JSON.stringify(data) : null
            let response = await fetch(siteURL + endpoint, {method: "POST", headers, credentials: "include", body})
            let text = await response.text()
            if (!response.ok) throw new Error(text)
            try {
                text = JSON.parse(text)
            } catch {}
            return text as PostEndpoint<T>["response"]
        } catch (err: any) {
            return Promise.reject(err)
        }
    }

    public static put = async <T extends string>(endpoint: T, data: PutEndpoint<T>["params"], session: Session) => {
        const headers = {"Content-Type": "application/json", "x-csrf-token": session.csrfToken}
        try {
            let body = data ? JSON.stringify(data) : null
            let response = await fetch(siteURL + endpoint, {method: "PUT", headers, credentials: "include", body})
            let text = await response.text()
            if (!response.ok) throw new Error(text)
            try {
                text = JSON.parse(text)
            } catch {}
            return text as PutEndpoint<T>["response"]
        } catch (err: any) {
            return Promise.reject(err)
        }
    }

    public static delete = async <T extends string>(endpoint: T, params: DeleteEndpoint<T>["params"], session: Session) => {
        const headers = {"x-csrf-token": session.csrfToken}
        try {
            const parsedURL = functions.util.parseURLParams(siteURL + endpoint, params)
            let response = await fetch(parsedURL, {method: "DELETE", headers, credentials: "include"})
            let text = await response.text()
            if (!response.ok) throw new Error(text)
            try {
                text = JSON.parse(text)
            } catch {}
            return text as DeleteEndpoint<T>["response"]
        } catch (err: any) {
            return Promise.reject(err)
        }
    }
}