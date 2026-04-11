/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState, useMemo} from "react"
import {View, StatusBar, FlatList, Alert} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import Toast from "react-native-toast-message"
import {useNavigation, useNavigationState, RouteProp} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector, useFlagActions,
useSearchSelector, useSearchActions,
useCacheActions} from "../../store"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {StackParamList} from "../../App"
import {useGetGroupQuery, useInvalidateGroups} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import GroupImage from "../../components/image/GroupImage"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import LeftIcon from "../../assets/svg/left.svg"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import EditIcon from "../../assets/svg/edit.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {createStylesheet} from "./styles/GroupScreen.styles"
import functions from "../../functions/Functions"
import permissions from "../../structures/Permissions"
import moeText from "../../moetext/MoeText"

type Props = {
  route: RouteProp<StackParamList, "Group">
}

const GroupScreen: React.FunctionComponent<Props> = ({route}) => {
    const {session} = useSessionSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const {scroll, sizeType, square} = useSearchSelector()
    const {setScroll, setSearch, setSearchTags} = useSearchActions()
    const {setNavigationPosts} = useCacheActions()
    const {setSearchScrollFlag} = useFlagActions()
    const {slug} = route.params
    const {data: group} = useGetGroupQuery({name: slug})
    const [page, setPage] = useState(1)
    const styles = createStylesheet(colors)
    const ref = useRef<FlatList>(null)
    const loadingRef = useRef(false)
    const navigation = useNavigation()
    const invalidateGroups = useInvalidateGroups()

    const previousRoute = useNavigationState((state) => {
        const index = state.index
        return index > 0 ? state.routes[index - 1] : null
    })

    useEffect(() => {
        setPage(1)
        ref.current?.scrollToOffset({offset: 0})
    }, [route.params, scroll])

    const pageSize = 15

    const {columns} = functions.image.getImageSize(sizeType, square, tablet)
    const totalPages = Math.ceil(Number(group?.postCount || 0) / pageSize)

    let iconSize = 22
    let iconSize2 = 30

    const posts = useMemo(() => {
        if (!group?.posts) return []

        if (scroll) {
            return group.posts.slice(0, page * pageSize)
        }

        const start = (page - 1) * pageSize
        const end = start + pageSize
        return group.posts.slice(start, end)
    }, [group?.posts, page, pageSize, scroll])
    
    const loadMore = () => {
        if (loadingRef.current) return
        if (scroll && page < totalPages) {
            loadingRef.current = true
            setPage((prev) => prev + 1)

            setTimeout(() => {
                loadingRef.current = false
            }, 1000)
        }
    }

    const editGroup = () => {
        if (!group) return
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        if (session.banned) {
            return Toast.show({text1: i18n.toast.banned})
        }
    }

    const deleteGroup = () => {
        if (!group) return
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        if (session.banned) {
            return Toast.show({text1: i18n.toast.banned})
        }
        if (permissions.isMod(session)) {
            Alert.alert(i18n.dialogs.deleteGroup.title, i18n.dialogs.deleteGroup.header, [
                {text: i18n.buttons.cancel, style: "cancel"},
                {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                    await functions.http.delete("/api/group/delete", {slug: group.slug}, session)
                    navigation.navigate("Groups", undefined, {pop: true})
                    invalidateGroups()
                }}
            ], {cancelable: true})
        } else {
            Alert.prompt(i18n.dialogs.deleteGroup.request, i18n.dialogs.deleteGroup.reasonHeader, [
                {text: i18n.buttons.cancel, style: "cancel"},
                {text: i18n.buttons.submitRequest, style: "destructive", onPress: async (reason = "") => {
                    await functions.http.post("/api/group/delete/request", {slug: group.slug, reason}, session)
                    Toast.show({text1: i18n.dialogs.deleteGroup.submitText})
                }}
            ], "plain-text", "", "default", {cancelable: true})
        }
    }

    const pressAction = () => {
        if (!group) return
        setSearchTags([`group:${group.slug}`])
        setSearch(`group:${group.slug}`)
        navigation.navigate("Posts", undefined, {pop: true})
        setSearchScrollFlag(true)
    }

    const onGroupPress = () => {
        if (!group) return
        if (group.posts.length) setNavigationPosts(group.posts)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <FlatList
            ListHeaderComponent={
                <>
                <TitleBar/>
                <View style={styles.navContainer}>
                    <PressableHaptic style={styles.navTextContainer} onPress={() => navigation.goBack()}>
                    {({pressed}) => (
                        <>
                        <LeftIcon width={24} height={24} color={colors.iconColor}/>
                        <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>
                            {previousRoute?.name === "Post" ? i18n.buttons.post : i18n.sort.groups}
                        </Text>
                        </>
                    )}
                    </PressableHaptic>
                </View>
                {group && <>
                <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.title}>{group.name}</Text>
                        {session.username ? <>
                        <ScalableHaptic onPress={editGroup}>
                            <EditIcon width={iconSize2} height={iconSize2} color={colors.iconColor}/>
                        </ScalableHaptic>
                        <ScalableHaptic onPress={deleteGroup}>
                            <DeleteIcon width={iconSize2} height={iconSize2} color={colors.iconColor}/>
                        </ScalableHaptic></> : null}
                    </View>
                    <View style={styles.rowContainer}>
                        {moeText.renderCommentaryText(group.description, colors)}
                    </View>
                </View>
                <View style={styles.headerContainer}>
                    <PressableHaptic onPress={pressAction}>
                        <Text style={styles.headerText}>{i18n.sort.posts}</Text>
                    </PressableHaptic>
                    <Text style={styles.headerTextAlt}>{group.postCount}</Text>
                    <ScalableHaptic scaleFactor={0.95} icon={scroll ? ScrollIcon : PagesIcon} 
                        size={iconSize} color={colors.iconColor} style={styles.iconContainer}
                        onPress={() => setScroll(!scroll)}>
                        <Text style={styles.headerTextAlt2}>{scroll ? i18n.sortbar.scrolling : i18n.sortbar.pages}</Text>
                    </ScalableHaptic>
                </View>
                </>}
                </>
            }
            ref={ref}
            key={columns}
            data={posts}
            renderItem={({item}) => <GroupImage post={item} onPress={onGroupPress}/>}
            keyExtractor={(item) => item.postID.toString()}
            numColumns={columns}
            columnWrapperStyle={columns !== 1 ? styles.row : undefined}

            onEndReached={scroll ? loadMore : undefined}
            onEndReachedThreshold={scroll ? 0.1 : undefined}

            contentContainerStyle={{backgroundColor: colors.background}}
            ListHeaderComponentStyle={{paddingBottom: 10}}
            ListFooterComponentStyle={{paddingTop: 10}}
            
            showsVerticalScrollIndicator={false}

            ListFooterComponent={!scroll ? <>
                <PageButtons page={page} setPage={setPage} 
                totalPages={totalPages} hideEndArrow={true}
                marginBottom={20}/>
                <BackToTop ref={ref}/>
                <TabBar relative={true}/>
                </> : <>
                <BackToTop ref={ref}/>
                <TabBar relative={true}/>
                </>}
            />
        </View>
    )
}

export default GroupScreen