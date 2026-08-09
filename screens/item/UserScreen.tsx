/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef} from "react"
import {View, Image, StatusBar, FlatList} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import {useNavigation, RouteProp} from "@react-navigation/native"
import {useThemeSelector, useSessionSelector, useCacheSelector, useSearchSelector} from "../../store"
import PressableHaptic from "../../ui/PressableHaptic"
import {StackParamList} from "../../App"
import {useGetUserQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import TabBar from "../../components/app/TabBar"
import FavoriteTags from "../../components/user/FavoriteTags"
import FavoriteGroups from "../../components/user/FavoriteGroups"
import Favorites from "../../components/user/Favorites"
import Uploads from "../../components/user/Uploads"
import UserComments, {useUserCommentItems} from "../../components/user/UserComments"
import Comment from "../../components/search/Comment"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/UserScreen.styles"
import functions from "../../functions/Functions"
import moeText from "../../moetext/MoeText"

type Props = {
  route: RouteProp<StackParamList, "User">
}

const UserScreen: React.FunctionComponent<Props> = ({route}) => {
    const {session} = useSessionSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {scroll} = useSearchSelector()
    const {emojis} = useCacheSelector()
    const {username} = route.params
    const {data: user} = useGetUserQuery({username})
    const styles = createStylesheet(colors)
    const ref = useRef<FlatList>(null)
    const navigation = useNavigation()

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0})
    }, [route.params])

    const bioText = () => {
        let fragment = moeText.renderText(session.bio, emojis, colors)[0] as React.ReactElement<React.FragmentProps>
        const rendered = fragment.props.children as React.ReactElement[]
        return rendered.map((element: any, index: number) => {
            if (element.type === Text) {
                return React.cloneElement(element, {
                    key: index,
                    style: [element.props.style, {fontSize: 20}]
                })
            }

            if (element.type === Image) {
                return React.cloneElement(element, {
                    key: index,
                    style: [element.props.style, {width: 35, height: 35}]
                })
            }

            return element
        })
    }

    const {comments, loadMore, page, setPage, 
        refetch, totalItems, totalPages} = useUserCommentItems({username})
    
    let pfp = user ? functions.link.getFolderLink("pfp", user.image, user.imageHash) : ""
    let pfpSize = 70

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
                                {i18n.roles.user}
                            </Text>
                            </>
                        )}
                        </PressableHaptic>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.rowContainer}>
                            <Image style={{width: pfpSize, height: pfpSize, borderRadius: 5}} src={pfp} resizeMode="contain"/>
                            {user ? functions.jsx.usernameJSX(user, colors, i18n, {fontSize: 30, 
                                marginRight: 5}, 35, undefined, undefined, undefined, false) : null}
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.bioContainer}>
                                <Text style={styles.labelText}>{i18n.user.bio}: </Text>
                                {bioText()}
                            </View>
                            {user ? <Text style={styles.labelText}>
                                {i18n.user.joinDate}: {functions.date.prettyDate(user.joinDate, i18n)}
                            </Text> : null}
                        </View>
                        <FavoriteTags username={username}/>
                        <FavoriteGroups username={username}/>
                        <Favorites username={username}/>
                        <Uploads username={username}/>
                        <UserComments username={username} count={totalItems}/>
                    </View>
                </>
                }
                ref={ref}
                data={comments}
                renderItem={({item}) => <Comment comment={item} image={true} padding={20} refetch={refetch}/>}
                keyExtractor={(item) => item.commentID.toString()}

                onEndReached={scroll ? loadMore : undefined}
                onEndReachedThreshold={scroll ? 0.1 : undefined}

                contentContainerStyle={{backgroundColor: colors.background}}
                showsVerticalScrollIndicator={false}

                ListFooterComponent={!scroll ? 
                <>
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

export default UserScreen