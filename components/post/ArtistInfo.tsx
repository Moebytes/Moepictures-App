import React from "react"
import {View, Text, Image} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/ArtistInfo.styles"

const pixiv = require("../../assets/icons/pixiv.png")
const artistImage = require("../../assets/images/placeholder/artist.jpg")

const ArtistInfo: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    return (
        <View style={styles.container}>
            <View style={styles.artistContainer}>
                <Image style={styles.artistIcon} source={artistImage}/>
                <Text style={styles.artistText}>mozukun43</Text>
            </View>
            <Image style={styles.sourceIcon} source={pixiv}/>
        </View>
    )
}

export default ArtistInfo