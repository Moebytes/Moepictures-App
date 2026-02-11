import React, {useState, useEffect} from "react"
import {View, Image, ImageSourcePropType} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/GridImage.styles"

interface Props {
    img: ImageSourcePropType
}

const GridImage: React.FunctionComponent<Props> = (props) => {
    const [size, setSize] = useState({width: 0, height: 0})
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    useEffect(() => {
        const updateSize = async () => {
            const asset = Image.resolveAssetSource(props.img)
            const size = await Image.getSize(asset.uri)

            const maxSize = 200
            let newWidth = 0
            let newHeight = 0

            if (size.width > size.height) {
                const ratio = size.height / size.width
                newWidth = maxSize
                newHeight = maxSize * ratio
            } else {
                const ratio = size.width / size.height
                newHeight = maxSize
                newWidth = maxSize * ratio
            }

            setSize({width: newWidth, height: newHeight})
        }
        updateSize()
    }, [props.img])

    if (!size.width) return null

    const borderWidth = 1.2
    const landscape = size.width > size.height
    
    const imageSize = landscape ?
        {width: size.width - borderWidth * 2, height: size.height} : 
        {width: size.width, height: size.height - borderWidth * 2}

    return (
        <View style={[styles.container, size, {borderWidth}]}>
            <Image style={imageSize} source={props.img} resizeMode="contain"/>
        </View>
    )
}

export default GridImage