/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useState, useEffect} from "react"
import {View, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {UITextView as Text} from "react-native-uitextview"
import StarRating from "react-native-star-rating-widget"
import {useLayoutActions, useSessionSelector, useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/CutenessMeter.styles"
import DeleteStarIcon from "../../assets/svg/deletestar.svg"
import {PostFull} from "../../types/Types"
import functions from "../../functions/Functions"

interface Props {
    post?: PostFull
}

let cutenessTimer = null as any

const CutenessMeter: React.FunctionComponent<Props> = (props) => {
    const {session} = useSessionSelector()
    const {i18n, colors} = useThemeSelector()
    const {setPostDrawerSwipe} = useLayoutActions()
    const [cuteness, setCuteness] = useState(0)
    const [averageCuteness, setAverageCuteness] = useState(props.post?.cuteness || 0)
    const [isAverage, setIsAverage] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    const getCuteness = async () => {
        if (!props.post) return
        const cuteness = await functions.http.get("/api/cuteness", {postID: props.post.postID}, session)
        if (props.post.cuteness) setAverageCuteness(props.post.cuteness)
        if (cuteness?.cuteness) {
            setCuteness(Number(cuteness.cuteness))
            setIsAverage(false)
        } else {
            setIsAverage(true)
        }
        setLoaded(true)
    }

    const updateCuteness = async () => {
        if (!cuteness || !props.post) return
        await functions.http.post("/api/cuteness/update", {cuteness: Math.round(cuteness), postID: props.post.postID}, session)
        setIsAverage(false)
    }

    const deleteRating = async () => {
        if (!props.post) return
        await functions.http.delete("/api/cuteness/delete", {postID: props.post.postID}, session)
        setIsAverage(true)
    }

    useEffect(() => {
        getCuteness()
    }, [props.post, session])

    useEffect(() => {
        clearTimeout(cutenessTimer)
        cutenessTimer = setTimeout(() => {
            updateCuteness()
        }, 500)
    }, [cuteness, session])

    const ratingStart = () => {
        navigation.setOptions({gestureEnabled: false})
        setPostDrawerSwipe(false)
    }

    const ratingEnd = () => {
        navigation.setOptions({gestureEnabled: true})
        setPostDrawerSwipe(true)
    }

    let iconSize = 30

    if (!session.username || !loaded) return null

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{i18n.sort.cuteness}</Text>
                <Pressable style={styles.iconContainer} onPress={() => deleteRating()}>
                    <DeleteStarIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                </Pressable>
            </View>
            <View style={styles.starContainer}>
                <StarRating 
                    rating={isAverage ? Number(averageCuteness) : cuteness}
                    onChange={setCuteness} 
                    color={isAverage ? colors.cutenessAverageColor : colors.cutenessStarColor}
                    fullFraction={true}
                    multiplier={200}
                    snap={0.025}
                    starSize={50}
                    strokeWidth={1}
                    hitSlopVertical={20}
                    animationConfig={{scale: 1}}
                    onRatingStart={ratingStart}
                    onRatingEnd={ratingEnd}
                />
                <Text style={styles.text}>{Math.round(isAverage ? Number(averageCuteness) : cuteness)}</Text>
            </View>
        </View>
    )
}

export default CutenessMeter