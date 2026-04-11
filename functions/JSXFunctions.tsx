/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {View, Text, StyleProp, TextStyle} from "react-native"
import CrownIcon from "../assets/svg/crown.svg"
import CuratorStarIcon from "../assets/svg/curator-star.svg"
import ContributorPencilIcon from "../assets/svg/pencil.svg"
import PremiumStarIcon from "../assets/svg/premium-star.svg"
import {ThemeColors} from "../ui/colors"
import {fonts} from "../ui/fonts"
import {createStylesheet} from "./styles/JSXFunctions.styles"
import functions from "./Functions"
import enLocale from "../assets/locales/en.json"

export default class JSXFunctions {
    public static usernameJSX = (userData: {username: string, role: string, banned: boolean | null, deleted: boolean | null}, 
        colors: ThemeColors, i18n: typeof enLocale, textStyle?: StyleProp<TextStyle>, iconSize = 17) => {
        const styles = createStylesheet(colors)

        const color = functions.tag.getUserColor(userData, colors)
        let iconMap = {
            "admin": CrownIcon,
            "mod": CrownIcon,
            "system": CrownIcon,
            "premium-curator": CuratorStarIcon,
            "curator": CuratorStarIcon,
            "premium-contributor": ContributorPencilIcon,
            "contributor": ContributorPencilIcon,
            "premium": PremiumStarIcon
        } as {[key: string]: React.FunctionComponent<{width: number, height: number, color: string}>}

        let Icon = iconMap[userData.role] || null

        return (
            <View style={styles.container}>
                <Text style={[styles.text, textStyle, {color, textDecorationLine: userData.banned || 
                    userData.deleted ? "line-through" : "none"}]}>
                    {userData.deleted ? i18n.user.deleted : functions.util.toProperCase(userData.username)}</Text>
                {Icon && <Icon width={iconSize} height={iconSize} color={color}/>}
            </View>
        )
    }
}