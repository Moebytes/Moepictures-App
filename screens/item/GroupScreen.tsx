/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState, useMemo} from "react"
import {View, StatusBar, Animated, ScrollView, NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import Alert from "@blazejkustra/react-native-alert"
import {useAnimatedRef} from "react-native-reanimated"
import Sortable, {SortableFlexDragEndParams} from "react-native-sortables"
import {UITextView as Text} from "react-native-uitextview"
import Toast from "react-native-toast-message"
import {useNavigation, useNavigationState, RouteProp} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector, useFlagActions,
useSearchSelector, useSearchActions,
useCacheActions} from "../../store"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {StackParamList} from "../../App"
import {useGetGroupQuery, useGetGroupHistoryQuery, useInvalidateGroup, useInvalidateGroups} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import GroupImage from "../../components/image/GroupImage"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import LeftIcon from "../../assets/svg/left.svg"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import ReorderIcon from "../../assets/svg/reorder.svg"
import CancelIcon from "../../assets/svg/cancel.svg"
import AcceptIcon from "../../assets/svg/accept.svg"
import HistoryIcon from "../../assets/svg/history.svg"
import EditIcon from "../../assets/svg/edit.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {createStylesheet} from "./styles/GroupScreen.styles"
import {PostOrdered} from "../../types/Types"
import RevertIcon from "../../assets/svg/backspace.svg"
import CurrentIcon from "../../assets/svg/current.svg"
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
    const {slug, historyID} = route.params
    const [refreshKey, setRefreshKey] = useState(0)
    const {data: currentGroup} = useGetGroupQuery({name: slug, refreshKey})
    const {data: historyGroups} = useGetGroupHistoryQuery({slug, historyID}, {skip: !historyID})
    const [page, setPage] = useState(1)
    const [deleteMode, setDeleteMode] = useState(false)
    const [reorderState, setReorderState] = useState(false)
    const styles = createStylesheet(colors)
    const ref = useAnimatedRef<ScrollView>()
    const [sortKey, setSortKey] = useState(0)
    const [groupPosts, setGroupPosts] = useState([] as PostOrdered[])
    const [orderedPosts, setOrderedPosts] = useState([] as PostOrdered[])
    const loadingRef = useRef(false)
    const navigation = useNavigation()
    const invalidateGroup = useInvalidateGroup()
    const invalidateGroups = useInvalidateGroups()

    const historyGroup = historyID && historyGroups?.length ? historyGroups[0] : null
    let group = historyGroup ?? currentGroup

    const previousRoute = useNavigationState((state) => {
        const index = state.index
        return index > 0 ? state.routes[index - 1] : null
    })

    useEffect(() => {
        setPage(1)
        ref.current?.scrollTo({y: 0})
    }, [route.params, scroll])


    useEffect(() => {
        const updatePosts = async () => {
            if (!group) return
            let groupPosts = [] as PostOrdered[]
            for (let i = 0; i < group.posts.length; i++) {
                const post = group.posts[i]
                if ("images" in post) {
                    groupPosts.push(post)
                } else {
                    const fullPost = await functions.http.get("/api/post", {postID: post.postID}, session)
                    if (!fullPost) continue
                    groupPosts.push({...fullPost, order: post.order})
                }
            }
            setGroupPosts(groupPosts)
        }
        updatePosts()
    }, [group])

    const pageSize = 15

    let postCount = group && "postCount" in group ? 
        group?.postCount || 0 : group?.posts.length

    const totalPages = Math.ceil(Number(postCount) / pageSize)

    let iconSize = 22
    let iconSize2 = 30

    const posts = useMemo(() => {
        if (!groupPosts?.length) return []

        if (scroll) {
            return groupPosts.slice(0, page * pageSize)
        }

        const start = (page - 1) * pageSize
        const end = start + pageSize
        return groupPosts.slice(start, end)
    }, [groupPosts, page, pageSize, scroll])
    
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

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!scroll) return
        const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent

        const threshold = 100

        if (layoutMeasurement.height + contentOffset.y >=
            contentSize.height - threshold) {
            loadMore()
        }
    }

    const onDragEnd = (params: SortableFlexDragEndParams) => {
        if (!group) return
        const newList = params.order(posts)
        const baseOffset = scroll ? 0 : (page - 1) * pageSize

        const updated = [...groupPosts]
        updated.splice(baseOffset, newList.length, ...newList)

        setOrderedPosts(updated)
    }

    const commitReorder = () => {
        if (!group) return
        let posts = [] as {postID: string, order: number}[]
        for (let i = 0; i < orderedPosts.length; i++) {
            const item = orderedPosts[i]
            posts.push({postID: item.postID, order: i + 1})
        }
        functions.http.put("/api/group/reorder", {slug: group.slug, posts}, session)
        setReorderState(false)
        invalidateGroups()
    }

    const changeReorderState = () => {
        if (reorderState) {
            setReorderState(false)
            setSortKey((key) => key + 1)
        } else {
            setReorderState(true)
        }
    }

    const groupHistory = () => {
        if (!group) return
        navigation.navigate("GroupHistory", {slug}, {pop: true})
    }

    const editGroup = () => {
        if (!group) return
        if (!session.emailVerified) {
            return Toast.show({text1: i18n.toast.verificationRequired})
        }
        if (session.banned) {
            return Toast.show({text1: i18n.toast.banned})
        }
        navigation.navigate("EditGroup", {slug}, {pop: true})
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

    const onGroupPress = async (post: PostOrdered) => {
        if (!group) return
        if (deleteMode) {
            if (permissions.isContributor(session)) {
                Alert.alert(i18n.dialogs.deleteGroupPost.title, i18n.dialogs.deleteGroupPost.header, [
                    {text: i18n.buttons.cancel, style: "cancel"},
                    {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                        await functions.http.delete("/api/group/post/delete", {postID: post.postID, name: group.name}, session)
                        invalidateGroup(group.slug)
                        invalidateGroups()
                    }}
                ], {cancelable: true})
            } else {
                Alert.prompt(i18n.dialogs.deleteGroupPost.request, i18n.dialogs.deleteGroupPost.reasonHeader, [
                    {text: i18n.buttons.cancel, style: "cancel"},
                    {text: i18n.buttons.submitRequest, style: "destructive", onPress: async (reason = "") => {
                        let removalItems = [{postID: post.postID, slug: group.slug}]
                        await functions.http.post("/api/group/post/delete/request", {reason, removalItems}, session)
                        Toast.show({text1: i18n.dialogs.deleteGroup.submitText})
                    }}
                ], "plain-text", "", "default", {cancelable: true})
            }
            return
        }
        if (reorderState) return

        navigation.navigate("Post", {postID: post.postID})
        if (group.posts.length) setNavigationPosts(groupPosts)
    }

    const revertHistory = async () => {
        if (!historyGroup) return
        Alert.alert(i18n.dialogs.revertGroupHistory.title, i18n.dialogs.revertGroupHistory.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                await functions.http.put("/api/group/reorder", {slug, posts: historyGroup.posts}, session)
                await functions.http.put("/api/group/edit", {slug, name: historyGroup.name, description: historyGroup.description}, session)
                currentHistory(functions.post.generateSlug(historyGroup.name))
            }}
        ], {cancelable: true})
    }

    const currentHistory = async (key?: string) => {
        invalidateGroup(slug)
        navigation.navigate("Group", {slug: key ? key : slug}, {pop: true})
        setRefreshKey((prev) => prev + 1)
    }

    const historyBarJSX = () => {
        if (!historyID) return null
        return (
            <View style={styles.historyContainer}>
                <Text style={styles.historyText}>{`[${i18n.sidebar.history}: ${historyID}]`}</Text>

                {permissions.isContributor(session) ?
                <PressableHaptic onPress={revertHistory} style={({pressed}) => [
                    styles.historyButton, pressed && styles.historyButtonActive
                ]}>{({pressed}) => (
                    <>
                    <RevertIcon width={17} height={17} color={pressed ? colors.white : colors.black}/>
                    <Text style={[styles.historyButtonText, 
                        pressed && styles.historyButtonTextActive]}>{i18n.buttons.revert}</Text>
                    </>
                )}
                </PressableHaptic> : null}

                <PressableHaptic onPress={() => currentHistory()} style={({pressed}) => [
                    styles.historyButton, pressed && styles.historyButtonActive
                ]}>{({pressed}) => (
                    <>
                    <CurrentIcon width={17} height={17} color={pressed ? colors.white : colors.black}/>
                    <Text style={[styles.historyButtonText, 
                        pressed && styles.historyButtonTextActive]}>{i18n.buttons.current}</Text>
                    </>
                )}
                </PressableHaptic>
            </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.mainColor}}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"}/>
            <Animated.ScrollView ref={ref} style={{flex: 1, backgroundColor: colors.mainColor}}
                onScroll={handleScroll} scrollEventThrottle={16}>
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
                    {historyBarJSX()}
                    <View style={styles.rowContainer}>
                        <Text style={styles.title}>{group.name}</Text>
                        <ScalableHaptic onPress={groupHistory}>
                            <HistoryIcon width={iconSize2} height={iconSize2} color={colors.iconColor}/>
                        </ScalableHaptic>
                        {session.username ? <>
                        <ScalableHaptic onPress={changeReorderState}>
                            <ReorderIcon width={iconSize2} height={iconSize2} color={reorderState ? colors.favoriteColor : colors.iconColor}/>
                        </ScalableHaptic>
                        {reorderState ? <ScalableHaptic onPress={commitReorder}>
                            <AcceptIcon width={iconSize2} height={iconSize2} color={colors.iconColor}/>
                        </ScalableHaptic> : null}
                        <ScalableHaptic onPress={() => setDeleteMode((prev: boolean) => !prev)}>
                            <CancelIcon width={iconSize2} height={iconSize2} color={deleteMode ? colors.favoriteColor : colors.iconColor}/>
                        </ScalableHaptic>
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
                    <Text style={styles.headerTextAlt}>{postCount}</Text>
                    <ScalableHaptic scaleFactor={0.95} icon={scroll ? ScrollIcon : PagesIcon} 
                        size={iconSize} color={colors.iconColor} style={styles.iconContainer}
                        onPress={() => setScroll(!scroll)}>
                        <Text style={styles.headerTextAlt2}>{scroll ? i18n.sortbar.scrolling : i18n.sortbar.pages}</Text>
                    </ScalableHaptic>
                </View>
                </>}
                <View style={{flex: 1, backgroundColor: colors.background}}>
                    <Sortable.Flex key={sortKey} scrollableRef={ref} gap={10} padding={10} sortEnabled={reorderState}
                        justifyContent="space-evenly" alignItems="center" inactiveItemOpacity={1}
                        itemEntering={null} itemExiting={null} itemsLayoutTransitionMode="reorder"
                        onDragEnd={onDragEnd}>
                        {posts.map((item) => <GroupImage post={item} onPress={onGroupPress}/>)}
                    </Sortable.Flex>
                    {!scroll ? <>
                        <PageButtons page={page} setPage={setPage} 
                        totalPages={totalPages} hideEndArrow={true}
                        marginBottom={20}/>
                        <BackToTop ref={ref}/>
                        <TabBar relative={true}/>
                        </> : <>
                        <BackToTop ref={ref}/>
                        <TabBar relative={true}/>
                    </>}
                </View>    
            </Animated.ScrollView>
        </View>
    )
}

export default GroupScreen