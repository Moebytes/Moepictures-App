/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {View, Text, StyleProp, TextStyle, ViewStyle} from "react-native"
import CrownIcon from "../assets/svg/crown.svg"
import CuratorStarIcon from "../assets/svg/curator-star.svg"
import ContributorPencilIcon from "../assets/svg/pencil.svg"
import PremiumStarIcon from "../assets/svg/premium-star.svg"
import {ThemeColors} from "../ui/colors"
import {createStylesheet} from "./styles/JSXFunctions.styles"
import functions from "./Functions"
import enLocale from "../assets/locales/en.json"

export default class JSXFunctions {
    public static usernameJSX = (userData: {username: string, role: string, premium: boolean | null, banned: boolean | null, 
        deleted: boolean | null}, colors: ThemeColors, i18n: typeof enLocale, textStyle?: StyleProp<TextStyle>, iconSize = 17,
        rowStyle?: StyleProp<ViewStyle>, editText?: string, date?: string) => {
        const styles = createStylesheet(colors)

        const color = functions.tag.getUserColor(userData, colors)
        let iconMap = {
            "admin": CrownIcon,
            "mod": CrownIcon,
            "system": CrownIcon,
            "curator": CuratorStarIcon,
            "contributor": ContributorPencilIcon
        } as {[key: string]: React.FunctionComponent<{width: number, height: number, color: string}>}

        let Icon = iconMap[userData.role] || null

        if (userData.role === "user" && userData.premium) {
            Icon = PremiumStarIcon
        }

        let timeString = editText && date ? `${editText} ${functions.date.timeAgo(date, i18n)} ${i18n.time.by} `  : ""

        return (
            <View style={[styles.container, rowStyle]}>
                <Text style={[styles.text, textStyle, {color, textDecorationLine: userData.banned || 
                    userData.deleted ? "line-through" : "none"}]}>
                    {timeString}{userData.deleted ? i18n.user.deleted : functions.util.toProperCase(userData.username)}</Text>
                {Icon && <Icon width={iconSize} height={iconSize} color={color}/>}
            </View>
        )
    }
}