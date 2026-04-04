/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import ByteFunctions from "./ByteFunctions"
import CacheFunctions from "./CacheFunctions"
import ColorFunctions from "./ColorFunctions"
import CryptoFunctions from "./CryptoFunctions"
import DateFunctions from "./DateFunctions"
import FileFunctions from "./FileFunctions"
import HTTPFunctions from "./HTTPFunctions"
import ImageFunctions from "./ImageFunctions"
import LinkFunctions from "./LinkFunctions"
import PostFunctions from "./PostFunctions"
import TagFunctions from "./TagFunctions"
import UtilFunctions from "./UtilFunctions"
import ValidationFunctions from "./ValidationFunctions"
import {CommonActions, NavigationProp, NavigationState} from "@react-navigation/native"
import {PostRating} from "../types/Types"
import clone from "fast-clone"

type Navigation = Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
    getState(): NavigationState | undefined
}

export default class Functions {
    public static byte = ByteFunctions
    public static cache = CacheFunctions
    public static color = ColorFunctions
    public static crypto = CryptoFunctions
    public static date = DateFunctions
    public static file = FileFunctions
    public static http = HTTPFunctions
    public static image = ImageFunctions
    public static link = LinkFunctions
    public static post = PostFunctions
    public static tag = TagFunctions
    public static util = UtilFunctions
    public static valid = ValidationFunctions

    public static timeout = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
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
}