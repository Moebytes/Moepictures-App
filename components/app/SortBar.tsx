import React from "react"
import {View, Pressable} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/SortBar.styles"
import RandomIcon from "../../assets/svg/random.svg"
import ImgUploadIcon from "../../assets/svg/imgupload.svg"
import AutoSearchIcon from "../../assets/svg/autosearch.svg"
import BookmarkIcon from "../../assets/svg/bookmark.svg"
import HeartIcon from "../../assets/svg/heart.svg"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import SquareIcon from "../../assets/svg/square.svg"
import FiltersIcon from "../../assets/svg/filters.svg"
import SizeIcon from "../../assets/svg/size.svg"
import SortIcon from "../../assets/svg/sort.svg"

const SortBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let iconSize = 23

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Pressable>
                    <RandomIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <ImgUploadIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <AutoSearchIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <BookmarkIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <HeartIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
            <View style={styles.iconContainer}>
                <Pressable>
                    <PagesIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <SquareIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <FiltersIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <SizeIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable>
                    <SortIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
        </View>
    )
}

export default SortBar