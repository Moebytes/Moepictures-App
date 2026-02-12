import React from "react"
import {View, Text, Pressable, FlatList, ListRenderItem, ImageSourcePropType} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/Related.styles"
import GridImage from "../image/GridImage"
import PageButtons from "../search/PageButtons"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import SquareIcon from "../../assets/svg/square.svg"
import SizeIcon from "../../assets/svg/size.svg"

const related1 = require("../../assets/images/placeholder/related1.jpg")
const related2 = require("../../assets/images/placeholder/related2.jpg")
const related3 = require("../../assets/images/placeholder/related3.jpg")
const related4 = require("../../assets/images/placeholder/related4.jpg")
const related5 = require("../../assets/images/placeholder/related5.jpg")
const related6 = require("../../assets/images/placeholder/related6.jpg")

let images = [
    related1, related2, related3, related4, related5, related6
]

const Related: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const renderItem: ListRenderItem<ImageSourcePropType> = ({item}) => {
        return <GridImage img={item}/>
    }

    let iconSize = 22

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Related</Text>
                <Pressable style={styles.iconContainer}>
                    <PagesIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable style={styles.iconContainer}>
                    <SquareIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
                <Pressable style={styles.iconContainer}>
                    <SizeIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
            <View style={styles.imageContainer}>
                <FlatList 
                    style={{flex: 1}}
                    data={images} 
                    renderItem={renderItem}
                    keyExtractor={(_, i) => i.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    ListFooterComponent={<PageButtons/>}
                    ListFooterComponentStyle={styles.footer}
                />
            </View>
        </View>
    )
}

export default Related