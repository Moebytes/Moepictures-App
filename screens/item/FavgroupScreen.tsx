/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState, useMemo} from "react"
import {View, StatusBar, Alert, Animated, ScrollView, NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import {useAnimatedRef} from "react-native-reanimated"
import Sortable, {SortableFlexDragEndParams} from "react-native-sortables"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation, useNavigationState, RouteProp} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector, useFlagActions,
useSearchSelector, useSearchActions, useActiveActions, useCacheActions} from "../../store"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {StackParamList} from "../../App"
import {useGetFavgroupQuery, useInvalidateFavgroup, useInvalidateFavgroups} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import GroupImage from "../../components/image/GroupImage"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import LeftIcon from "../../assets/svg/left.svg"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import LockIcon from "../../assets/svg/lock.svg"
import ReorderIcon from "../../assets/svg/reorder.svg"
import CancelIcon from "../../assets/svg/cancel.svg"
import AcceptIcon from "../../assets/svg/accept.svg"
import EditIcon from "../../assets/svg/edit.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {createStylesheet} from "./styles/GroupScreen.styles"
import {PostOrdered, PostSearchOrdered} from "../../types/Types"
import functions from "../../functions/Functions"

type Props = {
  route: RouteProp<StackParamList, "Favgroup">
}

const FavgroupScreen: React.FunctionComponent<Props> = ({route}) => {
    const {session} = useSessionSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {scroll} = useSearchSelector()
    const {setScroll, setSearch, setSearchTags} = useSearchActions()
    const {setNavigationPosts} = useCacheActions()
    const {setSearchScrollFlag} = useFlagActions()
    const {setActiveFavgroup} = useActiveActions()
    const {slug} = route.params
    const [page, setPage] = useState(1)
    const [deleteMode, setDeleteMode] = useState(false)
    const [reorderState, setReorderState] = useState(false)
    const {data: favgroup} = useGetFavgroupQuery({username: session.username, name: slug})
    const styles = createStylesheet(colors)
    const ref = useAnimatedRef<ScrollView>()
    const [sortKey, setSortKey] = useState(0)
    const [orderedPosts, setOrderedPosts] = useState([] as PostSearchOrdered[])
    const loadingRef = useRef(false)
    const navigation = useNavigation()
    const invalidateFavgroup = useInvalidateFavgroup()
    const invalidateFavgroups = useInvalidateFavgroups()

    const previousRoute = useNavigationState((state) => {
        const index = state.index
        return index > 0 ? state.routes[index - 1] : null
    })

    useEffect(() => {
        setPage(1)
        ref.current?.scrollTo({y: 0})
    }, [route.params, scroll])

    const pageSize = 15

    const totalPages = Math.ceil(Number(favgroup?.postCount || 0) / pageSize)

    let iconSize = 22
    let iconSize2 = 30

    const posts = useMemo(() => {
        if (!favgroup?.posts) return []

        if (scroll) {
            return favgroup.posts.slice(0, page * pageSize)
        }

        const start = (page - 1) * pageSize
        const end = start + pageSize
        return favgroup.posts.slice(start, end)
    }, [favgroup?.posts, page, pageSize, scroll])
    
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
        if (!favgroup) return
        const newList = params.order(posts)
        const baseOffset = scroll ? 0 : (page - 1) * pageSize

        const updated = [...favgroup.posts]
        updated.splice(baseOffset, newList.length, ...newList)

        setOrderedPosts(updated)
    }

    const commitReorder = () => {
        if (!favgroup) return
        let posts = [] as {postID: string, order: number}[]
        for (let i = 0; i < orderedPosts.length; i++) {
            const item = orderedPosts[i]
            posts.push({postID: item.postID, order: i + 1})
        }
        functions.http.put("/api/favgroup/reorder", {name: favgroup.name, posts}, session)
        setReorderState(false)
        invalidateFavgroups()
    }

    const changeReorderState = () => {
        if (reorderState) {
            setReorderState(false)
            setSortKey((key) => key + 1)
        } else {
            setReorderState(true)
        }
    }

    const editFavgroup = () => {
        if (!favgroup) return
        navigation.navigate("EditFavgroup", {slug}, {pop: true})
    }

    const deleteFavgroup = () => {
        if (!favgroup) return
        Alert.alert(i18n.dialogs.deleteFavgroup.title, i18n.dialogs.deleteFavgroup.header, [
            {text: i18n.buttons.cancel, style: "cancel"},
            {text: i18n.buttons.delete, style: "destructive", onPress: async () => {
                await functions.http.delete("/api/favgroup/delete", {name: favgroup.name}, session)
                navigation.navigate("Favgroups", undefined, {pop: true})
                invalidateFavgroups()
            }}
        ], {cancelable: true})
    }

    const pressAction = () => {
        if (!favgroup) return
        setSearchTags([`favgroup:${session.username}:${favgroup.slug}`])
        setSearch(`favgroup:${session.username}:${favgroup.slug}`)
        navigation.navigate("Posts", undefined, {pop: true})
        setSearchScrollFlag(true)
    }

    const onFavgroupPress = async (post: PostOrdered) => {
        if (!favgroup) return
        if (deleteMode) {
            await functions.http.delete("/api/favgroup/post/delete", {postID: post.postID, name: favgroup.name}, session)
            invalidateFavgroup(favgroup.slug)
            invalidateFavgroups()
            return
        }
        if (reorderState) return

        navigation.navigate("Post", {postID: post.postID})
        if (favgroup.posts.length) setNavigationPosts(favgroup.posts)
        setActiveFavgroup(favgroup)
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
                            {previousRoute?.name === "Post" ? i18n.buttons.post : i18n.labels.favoriteGroup}
                        </Text>
                        </>
                    )}
                    </PressableHaptic>
                </View>
                {favgroup && <>
                <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        {favgroup.private ? <LockIcon width={iconSize} height={iconSize} color={colors.iconColor} style={{marginTop: 3}}/> : null}
                        <Text style={styles.title}>{favgroup.name}</Text>
                        <ScalableHaptic onPress={changeReorderState}>
                            <ReorderIcon width={iconSize2} height={iconSize2} color={reorderState ? colors.favoriteColor : colors.iconColor}/>
                        </ScalableHaptic>
                        {reorderState ? <ScalableHaptic onPress={commitReorder}>
                            <AcceptIcon width={iconSize2} height={iconSize2} color={colors.iconColor}/>
                        </ScalableHaptic> : null}
                        <ScalableHaptic onPress={() => setDeleteMode((prev: boolean) => !prev)}>
                            <CancelIcon width={iconSize2} height={iconSize2} color={deleteMode ? colors.favoriteColor : colors.iconColor}/>
                        </ScalableHaptic>
                        <ScalableHaptic onPress={editFavgroup}>
                            <EditIcon width={iconSize2} height={iconSize2} color={colors.iconColor}/>
                        </ScalableHaptic>
                        <ScalableHaptic onPress={deleteFavgroup}>
                            <DeleteIcon width={iconSize2} height={iconSize2} color={colors.iconColor}/>
                        </ScalableHaptic>
                    </View>
                </View>
                <View style={styles.headerContainer}>
                    <PressableHaptic onPress={pressAction}>
                        <Text style={styles.headerText}>{i18n.sort.posts}</Text>
                    </PressableHaptic>
                    <Text style={styles.headerTextAlt}>{favgroup.postCount}</Text>
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
                        {posts.map((item) => <GroupImage post={item} onPress={onFavgroupPress}/>)}
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

export default FavgroupScreen