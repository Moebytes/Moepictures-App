import React from "react"
import {View, Text, Pressable} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/PostImageOptions.styles"
import StarIcon from "../../assets/svg/star.svg"
import StarGroupIcon from "../../assets/svg/stargroup.svg"
import InfoIcon from "../../assets/svg/info.svg"
import DownloadIcon from "../../assets/svg/download.svg"
import FiltersIcon from "../../assets/svg/filters.svg"

const TabBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let iconSize = 35

    return (
        <View style={styles.container}>
            <Pressable style={styles.iconContainer} onPress={() => null}>
                <StarIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Favorite</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => null}>
                <StarGroupIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Favgroup</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => null}>
                <InfoIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Info</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => null}>
                <DownloadIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Download</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => null}>
                <FiltersIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Filters</Text>
            </Pressable>
        </View>
    )
}

export default TabBar