import React from "react"
import {View, FlatList, ListRenderItem, ImageSourcePropType} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/ImageGrid.styles"
import GridImage from "../image/GridImage"
import PageButtons from "./PageButtons"

const placeholder1 = require("../../assets/images/placeholder/placeholder1.jpg")
const placeholder2 = require("../../assets/images/placeholder/placeholder2.jpg")
const placeholder3 = require("../../assets/images/placeholder/placeholder3.jpg")
const placeholder4 = require("../../assets/images/placeholder/placeholder4.jpg")
const placeholder5 = require("../../assets/images/placeholder/placeholder5.jpg")
const placeholder6 = require("../../assets/images/placeholder/placeholder6.jpg")

let images = [
    placeholder1, placeholder2, placeholder3, placeholder4, placeholder5, placeholder6,
    placeholder1, placeholder2, placeholder3, placeholder4, placeholder5, placeholder6,
    placeholder1, placeholder2, placeholder3, placeholder4, placeholder5, placeholder6
]

const ImageGrid: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    const renderItem: ListRenderItem<ImageSourcePropType> = ({item}) => {
        return <GridImage img={item}/>
    }

    return (
        <View style={styles.container}>
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
    )
}

export default ImageGrid