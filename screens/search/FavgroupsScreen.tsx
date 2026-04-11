/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {View, ScrollView, Image, StatusBar, Pressable, FlatList, ListRenderItem} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation} from "@react-navigation/native"
import {useThemeSelector, useSessionSelector, useCacheActions, 
useSearchSelector, useActiveActions} from "../../store"
import {useGetFavgroupsQuery} from "../../api"
import PressableHaptic from "../../ui/PressableHaptic"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/FavgroupsScreen.styles"
import {PostOrdered, Post} from "../../types/Types"
import LockIcon from "../../assets/svg/lock.svg"
import CarouselImage from "../../components/image/CarouselImage"
import functions from "../../functions/Functions"

const noresults = require("../../assets/images/noresults.png")

const FavgroupsScreen: React.FunctionComponent = () => {
    const {session} = useSessionSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {setNavigationPosts} = useCacheActions()
    const {ratingType} = useSearchSelector()
    const {setActiveFavgroup} = useActiveActions()
    const {data: favgroups, isLoading} = useGetFavgroupsQuery(null)
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    let iconSize = 20

    const generateFavgroupJSX = () => {
        let jsx = [] as React.ReactElement[]
        if (!favgroups) return jsx

        if (!isLoading && !favgroups.length) return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50}}>
                <Image source={noresults} style={{width: 350, height: 350, resizeMode: "contain"}}/>
            </View>
        )

        for (const favgroup of favgroups) {
            if (functions.post.isR18(ratingType)) {
                if (!functions.post.isR18(favgroup.rating)) continue
            } else {
                if (functions.post.isR18(favgroup.rating)) continue
            }
            const onPress = (post: Post) => {
                setNavigationPosts(functions.post.appendIfNotExists(post, favgroup.posts))
                setActiveFavgroup(favgroup)
            }

            const renderItem: ListRenderItem<PostOrdered> = ({item}) => {
                return <CarouselImage post={item} onPress={onPress}/>
            }

            jsx.push(
                <View style={styles.itemContainer} key={favgroup.slug}>
                    <Pressable style={styles.headerContainer}
                        onPress={() => navigation.navigate("Favgroup", {slug: favgroup.slug})}>
                        {favgroup.private ? <LockIcon width={iconSize} height={iconSize} color={colors.iconColor} style={{marginTop: 3}}/> : null}
                        <Text style={styles.headerText}>{favgroup.name}</Text>
                        <Text style={styles.headerTextAlt}>{favgroup.postCount}</Text>
                    </Pressable>

                    <FlatList 
                        horizontal
                        data={favgroup.posts}
                        keyExtractor={(item) => item.postID.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderItem}
                        contentContainerStyle={styles.carousel}
                    />
                </View>
            )
        }
        return jsx
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
                    <Text style={[styles.navText, pressed && {color: colors.iconColor}]}>
                        {i18n.help.favoriteGroups.title}
                    </Text>
                    </>
                )}
                </PressableHaptic>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{i18n.help.favoriteGroups.title}</Text>
                </View>
                {generateFavgroupJSX()}
            <TabBar relative={true}/>
            </ScrollView>
        </View>
    )
}

export default FavgroupsScreen