import {Platform} from "react-native"

export const fonts = {
    genEiMGothicV2: Platform.select({
        ios: "GenEi M Gothic v2",
        android: "GenEi-M-Gothic-v2"
    }),
    honokaShinAntiqueKaku: Platform.select({
        ios: "Honoka-Shin-Antique-Kaku",
        android: "Honoka-Shin-Antique-Kaku"
    }),
    irohamaruMikami: Platform.select({
        ios: "irohamaru mikami",
        android: "irohamaru-mikami"
    }),
    jkGothicM: Platform.select({
        ios: "JK-Gothic-M",
        android: "JK-Gothic-M"
    }),
    tsunagiGothicBlack: Platform.select({
        ios: "TsunagiGothic-Black",
        android: "TsunagiGothic-Black"
    })
}