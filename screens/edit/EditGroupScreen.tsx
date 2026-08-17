/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {ScrollView, View, Text, TextInput, Animated, StatusBar} from "react-native"
import {useNavigation, RouteProp} from "@react-navigation/native"
import Toast from "react-native-toast-message"
import PagerView from "react-native-pager-view"
import {StackParamList} from "../../App"
import {useGetGroupQuery, useInvalidateGroup, useInvalidateGroups} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import SlidingSelector from "../../ui/SlidingSelector"
import {useThemeSelector, useSessionSelector} from "../../store"
import TitleBar from "../../components/app/TitleBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/EditFavgroupScreen.styles"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"

type Props = {
  route: RouteProp<StackParamList, "EditGroup">
}

const EditGroupScreen: React.FunctionComponent<Props> = ({route}) => {
    const {i18n, theme, colors} = useThemeSelector()
    const {session} = useSessionSelector()
    const {slug} = route.params
    const {data: group} = useGetGroupQuery({name: slug})
    const [page, setPage] = useState("details")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [items, setItems] = useState("")
    const [reason, setReason] = useState("")
    const styles = createStylesheet(colors)
    const navigation = useNavigation()
    const invalidateGroup = useInvalidateGroup()
    const invalidateGroups = useInvalidateGroups()
    const pagerRef = useRef<PagerView>(null)

    const edit = async () => {
        if (!group) return
        if (permissions.isContributor(session)) {
            if (!name) return Toast.show({text1: i18n.dialogs.editGroup.noName})
            await functions.http.put("/api/group/edit", {slug, name, description}, session)
            const newSlug = functions.post.generateSlug(name)
            invalidateGroup(newSlug)
            invalidateGroups()
            navigation.navigate("Group", {slug: newSlug}, {pop: true})
        } else {
            if (!name) return Toast.show({text1: i18n.dialogs.editGroup.noName})
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) return Toast.show({text1: badReason})

            await functions.http.post("/api/group/edit/request", {slug, name, description, reason}, session)
            navigation.navigate("Group", {slug}, {pop: true})
            Toast.show({text1: i18n.toast.editRequest})
        }
    }

    const remap = async () => {
        if (!group) return
        if (permissions.isContributor(session)) {
            const postIDs = items.trim().split(/\s+/g)
            await functions.http.put("/api/group/remap", {slug, postIDs}, session)
            invalidateGroup(slug)
            invalidateGroups()
            navigation.navigate("Group", {slug}, {pop: true})
        } else {
            const badReason = functions.valid.validateReason(reason, i18n)
            if (badReason) return Toast.show({text1: badReason})

            const postIDs = items.trim().split(/\s+/g)
            await functions.http.post("/api/group/request", {name: group.name, postIDs, reason}, session)
            navigation.navigate("Group", {slug}, {pop: true})
            Toast.show({text1: i18n.toast.editRequest})
        }
    }

    let pages = [
        {name: i18n.sidebar.details, value: "details"},
        {name: i18n.buttons.remap, value: "remap"}
    ]

    const changePage = (value: string) => {
        const index = pages.findIndex((page) => page.value === value)
        if (index === -1) return
        setPage(value)
        pagerRef.current?.setPage(index)
    }

    const onPageSelected = (event: any) => {
        const index = event.nativeEvent.position
        const value = pages[index]?.value
        if (value) setPage(value)
    }

    useEffect(() => {
        if (!group) return
        setName(group.name)
        setDescription(group.description)
        setItems(group.posts.map((p) => p.postID).join(" "))
    }, [group])

    let hasPermission = permissions.isContributor(session)

    const DetailsPage: React.FunctionComponent = () => {
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
                    placeholder={i18n.placeholder.enterGroupName}
                    placeholderTextColor={colors.gray}
                    submitBehavior="blurAndSubmit"
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>{i18n.labels.description}</Text>
            </View>
            <View style={styles.row}>
                <TextInput
                    style={styles.bigInput}
                    selectionColor={colors.borderColor}
                    value={description}
                    onChangeText={setDescription}
                    placeholder={i18n.placeholder.enterGroupDescription}
                    placeholderTextColor={colors.gray}
                    multiline={true}
                />
            </View>
            {!hasPermission ? <>
            <View style={styles.row}>
                <Text style={styles.label}>{i18n.labels.reason}</Text>
            </View>
            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    selectionColor={colors.borderColor}
                    value={reason}
                    onChangeText={setReason}
                    placeholder={i18n.placeholder.enterReason}
                    placeholderTextColor={colors.gray}
                    submitBehavior="blurAndSubmit"
                />
            </View></> : null}
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
                            {hasPermission ? i18n.buttons.edit : i18n.buttons.submitRequest}
                        </Animated.Text>
                    )
                }}
                </ScalableHaptic>
            </View>
            </>
        )
    }

    const RemapPage: React.FunctionComponent = () => {
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
            {!hasPermission ? <>
            <View style={styles.row}>
                <Text style={styles.label}>{i18n.labels.reason}</Text>
            </View>
            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    selectionColor={colors.borderColor}
                    value={reason}
                    onChangeText={setReason}
                    placeholder={i18n.placeholder.enterReason}
                    placeholderTextColor={colors.gray}
                    submitBehavior="blurAndSubmit"
                />
            </View></> : null}
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
                            {hasPermission ? i18n.buttons.remap : i18n.buttons.submitRequest}
                        </Animated.Text>
                    )
                }}
                </ScalableHaptic>
            </View>
            </>
        )
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>{i18n.dialogs.editGroup.title}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <View style={styles.outerContainer}>
                <View style={styles.centerRow}>
                    <SlidingSelector
                        data={pages}
                        value={page}
                        onChange={changePage}
                        paddingHorizontal={30}
                    />
                </View>
                
                <PagerView ref={pagerRef} style={{flex: 1}}
                    initialPage={0} onPageSelected={onPageSelected}>
                    <ScrollView key="details" showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.container}>
                        <DetailsPage/>
                    </ScrollView>
                    <ScrollView key="remap" showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.container}>
                        <RemapPage/>
                    </ScrollView>
                </PagerView>
            </View>
        </View>
    )
}

export default EditGroupScreen