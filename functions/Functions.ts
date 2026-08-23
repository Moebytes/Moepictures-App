/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import ByteFunctions from "./ByteFunctions"
import CacheFunctions from "./CacheFunctions"
import ColorFunctions from "./ColorFunctions"
import CompareFunctions from "./CompareFunctions"
import CryptoFunctions from "./CryptoFunctions"
import DateFunctions from "./DateFunctions"
import FileFunctions from "./FileFunctions"
import HTTPFunctions from "./HTTPFunctions"
import ImageFunctions from "./ImageFunctions"
import JSXFunctions from "./JSXFunctions"
import LinkFunctions from "./LinkFunctions"
import NativeFunctions from "./NativeFunctions"
import PostFunctions from "./PostFunctions"
import RenderFunctions from "./RenderFunctions"
import TagFunctions from "./TagFunctions"
import UtilFunctions from "./UtilFunctions"
import ValidationFunctions from "./ValidationFunctions"
import {CommonActions, NavigationProp, NavigationState} from "@react-navigation/native"
import {PostRating} from "../types/Types"
import clone from "fast-clone"

export type Navigation = Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
    getState(): NavigationState | undefined
}

export default class Functions {
    public static byte = ByteFunctions
    public static cache = CacheFunctions
    public static color = ColorFunctions
    public static compare = CompareFunctions
    public static crypto = CryptoFunctions
    public static date = DateFunctions
    public static file = FileFunctions
    public static http = HTTPFunctions
    public static image = ImageFunctions
    public static jsx = JSXFunctions
    public static link = LinkFunctions
    public static native = NativeFunctions
    public static post = PostFunctions
    public static render = RenderFunctions
    public static tag = TagFunctions
    public static util = UtilFunctions
    public static valid = ValidationFunctions

    public static timeout = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public static multiTrim = (str: string) => {
        return str.replace(/^\s+/gm, "").replace(/\s+$/gm, "").replace(/newline/g, " ")
    }

    public static r13 = () => {
        return "cute" as PostRating
    }

    public static r15 = () => {
        return "sexy" as PostRating
    }

    public static r17 = () => {
        return "erotic" as PostRating
    }

    public static r18 = () => {
        return "lewd" as PostRating
    }

    public static navigateToPost = async (postID: string | number, navigation: Navigation) => {
        const state = navigation.getState()!

        const routes = clone(state.routes) as any
        let lastRoute = routes[routes.length - 1]

        if (lastRoute.name !== "Post") {
            return navigation.navigate("Post", {postID: postID.toString()}, {pop: true})
        }

        const currentPostID = lastRoute.name === "Post"
            ? lastRoute.params?.postID?.toString()
            : undefined

        if (lastRoute.name === "Post" && currentPostID === postID) {
            return
        }

        const newRoute = {
            name: "Post",
            params: {postID: postID},
            key: lastRoute.key
        }

        routes[routes.length - 1].key = `Post-${Date.now()}`

        navigation.dispatch(
            CommonActions.reset({
                index: state.routes.length,
                routes: [...routes, newRoute]
            })
        )
    }

    public static handleAppLink = (url: string, navigation: Navigation) => {
        const prefix = url.replace("moepics://", "")
            .replace("moepictures.com/", "")
            .replace("moepictures.net/", "")
            .replace("moepictures.moe/", "")

        if (prefix.startsWith("post/history")) {
            const postID = prefix.split("/")[2]
            return navigation.navigate("PostHistory", {postID}, {pop: true})
        }

        if (prefix.startsWith("post/")) {
            const postID = prefix.split("/")[1]
            return navigation.navigate("Post", {postID}, {pop: true})
        }

        if (prefix.startsWith("tag/history")) {
            const tag = prefix.split("/")[2]
            return navigation.navigate("TagHistory", {name: tag}, {pop: true})
        }

        if (prefix.startsWith("tag/")) {
            const tag = prefix.split("/")[1]
            return navigation.navigate("Tag", {name: tag}, {pop: true})
        }

        if (prefix.startsWith("group/history")) {
            const slug = prefix.split("/")[2]
            return navigation.navigate("GroupHistory", {slug}, {pop: true})
        }

        if (prefix.startsWith("group/")) {
            const slug = prefix.split("/")[1]
            return navigation.navigate("Group", {slug}, {pop: true})
        }
        
        if (prefix.startsWith("favgroup/")) {
            const username = prefix.split("/")[1]
            const slug = prefix.split("/")[2]
            return navigation.navigate("Favgroup", {username, slug}, {pop: true})
        }

        if (prefix.startsWith("user/")) {
            const username = prefix.split("/")[1]
            return navigation.navigate("User", {username}, {pop: true})
        }

        if (prefix.startsWith("comments")) {
            return navigation.navigate("Comments", undefined, {pop: true})
        }

        if (prefix.startsWith("tags")) {
            return navigation.navigate("Tags", undefined, {pop: true})
        }

        if (prefix.startsWith("groups")) {
            return navigation.navigate("Groups", undefined, {pop: true})
        }

        if (prefix.startsWith("history")) {
            return navigation.navigate("History", undefined, {pop: true})
        }

        if (prefix.startsWith("help")) {
            return navigation.navigate("Help", undefined, {pop: true})
        }

        if (!prefix || prefix.startsWith("posts")) {
            return navigation.navigate("Posts", undefined, {pop: true})
        }
    }
}