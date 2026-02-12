import React, {useState, useEffect} from "react"
import {View, Image, ImageSourcePropType, useWindowDimensions} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/PostImage.styles"

interface Props {
    img: ImageSourcePropType
}

const PostImage: React.FunctionComponent<Props> = (props) => {
    const [size, setSize] = useState({width: 0, height: 0})
    const {width: deviceWidth} = useWindowDimensions()
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    useEffect(() => {
        const updateSize = async () => {
            const asset = Image.resolveAssetSource(props.img)
            const size = await Image.getSize(asset.uri)

            const maxSize = 500
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

            if (newWidth > deviceWidth) {
                const scale = deviceWidth / newWidth
                newWidth = deviceWidth
                newHeight = newHeight * scale
            }

            setSize({width: newWidth, height: newHeight})
        }
        updateSize()
    }, [props.img])

    if (!size.width) return null

    return (
        <View style={styles.container}>
            <Image style={size} source={props.img} resizeMode="contain"/>
        </View>
    )
}

export default PostImage