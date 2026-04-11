/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState, useMemo} from "react"
import {View, StatusBar, FlatList, Alert} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation, useNavigationState, RouteProp} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector, useFlagActions,
useSearchSelector, useSearchActions, useActiveActions, useCacheActions} from "../../store"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {StackParamList} from "../../App"
import {useGetFavgroupQuery, useInvalidateFavgroups} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import GroupImage from "../../components/image/GroupImage"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import LeftIcon from "../../assets/svg/left.svg"
import PagesIcon from "../../assets/svg/pages.svg"
import ScrollIcon from "../../assets/svg/scroll.svg"
import LockIcon from "../../assets/svg/lock.svg"
import EditIcon from "../../assets/svg/edit.svg"
import DeleteIcon from "../../assets/svg/delete.svg"
import {createStylesheet} from "./styles/GroupScreen.styles"
import functions from "../../functions/Functions"

type Props = {
  route: RouteProp<StackParamList, "Favgroup">
}

const FavgroupScreen: React.FunctionComponent<Props> = ({route}) => {
    const {session} = useSessionSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {tablet, headerHeight} = useLayoutSelector()
    const {scroll, sizeType, square} = useSearchSelector()
    const {setScroll, setSearch, setSearchTags} = useSearchActions()
    const {setNavigationPosts} = useCacheActions()
    const {setSearchScrollFlag} = useFlagActions()
    const {setActiveFavgroup} = useActiveActions()
    const {slug} = route.params
    const [page, setPage] = useState(1)
    const {data: favgroup} = useGetFavgroupQuery({username: session.username, name: slug})
    const styles = createStylesheet(colors)
    const ref = useRef<FlatList>(null)
    const loadingRef = useRef(false)
    const navigation = useNavigation()
    const invalidateFavgroups = useInvalidateFavgroups()

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

    const onFavgroupPress = () => {
        if (!favgroup) return
        if (favgroup.posts.length) setNavigationPosts(favgroup.posts)
        setActiveFavgroup(favgroup)
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
                </>
            }
            ref={ref}
            key={columns}
            data={posts}
            renderItem={({item}) => <GroupImage post={item} onPress={onFavgroupPress}/>}
            keyExtractor={(item) => item.postID.toString()}
            numColumns={columns}
            columnWrapperStyle={columns !== 1 ? styles.row : undefined}

            onEndReached={scroll ? loadMore : undefined}
            onEndReachedThreshold={scroll ? 0.1 : undefined}

            contentContainerStyle={{backgroundColor: colors.background}}
            ListHeaderComponentStyle={{paddingBottom: 10}}
            ListFooterComponentStyle={{paddingTop: 10}}

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

export default FavgroupScreen