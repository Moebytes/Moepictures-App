/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {ScrollView, View, Text, TextInput, Animated, StatusBar} from "react-native"
import {useNavigation, RouteProp} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import {StackParamList} from "../../App"
import {useGetFavgroupQuery, useInvalidateFavgroup, useInvalidateFavgroups} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import SlidingSelector from "../../ui/SlidingSelector"
import {useThemeSelector, useSessionSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import RadioButtonIcon from "../../assets/svg/radiobutton.svg"
import RadioButtonCheckedIcon from "../../assets/svg/radiobutton-checked.svg"
import {createStylesheet} from "./styles/EditFavgroupScreen.styles"
import functions from "../../functions/Functions"

type Props = {
  route: RouteProp<StackParamList, "EditFavgroup">
}

const EditFavgroupScreen: React.FunctionComponent<Props> = ({route}) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {slug} = route.params
    const {data: favgroup} = useGetFavgroupQuery({username: session.username, name: slug})
    const [page, setPage] = useState("details")
    const [name, setName] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [items, setItems] = useState("")
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const invalidateFavgroup = useInvalidateFavgroup()
    const invalidateFavgroups = useInvalidateFavgroups()

    const edit = async () => {
        if (!favgroup) return
        try {
            if (name) await functions.http.put("/api/favgroup/edit", {key: favgroup.name, name, isPrivate}, session)
            const newSlug = functions.post.generateSlug(name)
            invalidateFavgroup(newSlug)
            invalidateFavgroups()
            navigation.navigate("Favgroup", {slug: newSlug}, {pop: true})
        } catch {
            Toast.show({text1: i18n.toast.error})
        }
    }

    const remap = async () => {
        try {
            const postIDs = items.trim().split(/\s+/g)
            await functions.http.put("/api/favgroup/remap", {name: name, postIDs}, session)
            invalidateFavgroup(name)
            invalidateFavgroups()
            navigation.navigate("Favgroup", {slug: name}, {pop: true})
        } catch {
            Toast.show({text1: i18n.toast.error})
        }
    }

    let pages = [
        {name: i18n.sidebar.details, value: "details"},
        {name: i18n.buttons.remap, value: "remap"}
    ]

    useEffect(() => {
        if (!favgroup) return
        setName(favgroup.name)
        setIsPrivate(favgroup.private)
        setItems(favgroup.posts.map((p) => p.postID).join(" "))
    }, [favgroup, page])

    let iconSize = 25

    const generatePageJSX = () => {
        if (page === "details") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.name}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.textInput}
                        selectionColor={colors.borderColor}
                        value={name}
                        onChangeText={setName}
                        placeholder={i18n.placeholder.enterFavgroupName}
                        placeholderTextColor={colors.gray}
                        submitBehavior="blurAndSubmit"
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.labels.privacy}</Text>
                </View>
                <View style={styles.centerRow}>
                    <PressableHaptic style={styles.box} onPress={() => setIsPrivate(false)}>
                        {isPrivate ? 
                        <RadioButtonIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                        <RadioButtonCheckedIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                        <Text style={styles.label}>{i18n.labels.public}</Text>
                    </PressableHaptic>
                    <PressableHaptic style={styles.box} onPress={() => setIsPrivate(true)}>
                        {isPrivate ? 
                        <RadioButtonCheckedIcon width={iconSize} height={iconSize} color={colors.iconColor}/> :
                        <RadioButtonIcon width={iconSize} height={iconSize} color={colors.iconColor}/>}
                        <Text style={styles.label}>{i18n.sort.private}</Text>
                    </PressableHaptic>
                </View>
                <View style={styles.centerRow}>
                    <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "70%"}} 
                    style={styles.wideButton} onPress={edit}>
                    {({colorAnim}) => {
                        const color = colorAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [colors.white, colors.black],
                        })
                        return (
                            <Animated.Text style={[styles.wideButtonText, {color}]}>
                                {i18n.buttons.edit}
                            </Animated.Text>
                        )
                    }}
                    </ScalableHaptic>
                </View>
                </>
            )
        } else if (page === "remap") {
            return (
                <>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.buttons.remap}</Text>
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.bigInput}
                        selectionColor={colors.borderColor}
                        value={items}
                        onChangeText={setItems}
                        placeholder={i18n.placeholder.enterPostIDs}
                        placeholderTextColor={colors.gray}
                        multiline={true}
                    />
                </View>
                <View style={styles.centerRow}>
                    <ScalableHaptic scaleFactor={0.96} containerStyle={{width: "70%"}} 
                    style={styles.wideButton} onPress={remap}>
                    {({colorAnim}) => {
                        const color = colorAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [colors.white, colors.black],
                        })
                        return (
                            <Animated.Text style={[styles.wideButtonText, {color}]}>
                                {i18n.buttons.remap}
                            </Animated.Text>
                        )
                    }}
                    </ScalableHaptic>
                </View>
                </>
            )
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <TitleBar/>
            <View style={styles.navContainer}>
                <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                {({pressed}) => (
                    <>
                    <LeftIcon width={24} height={24} color={colors.iconColor}/>
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.dialogs.editFavgroup.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} 
                contentContainerStyle={[styles.container, {flex: 1}]}>
                <View style={styles.centerRow}>
                    <SlidingSelector
                        data={pages}
                        value={page}
                        onChange={setPage}
                        paddingHorizontal={30}
                    />
                </View>
                {generatePageJSX()}
            </ScrollView>
        </View>
    )
}

export default EditFavgroupScreen