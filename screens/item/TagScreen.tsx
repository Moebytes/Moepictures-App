/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef, useState} from "react"
import {View, Image, StatusBar, FlatList, Linking} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import {useNavigation, useNavigationState, RouteProp} from "@react-navigation/native"
import {useThemeSelector, useLayoutSelector, useSessionSelector, 
useSearchSelector, useSearchActions, useFlagActions} from "../../store"
import PressableHaptic from "../../ui/PressableHaptic"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {StackParamList} from "../../App"
import {useGetTagQuery} from "../../api"
import TitleBar from "../../components/app/TitleBar"
import TabBar from "../../components/app/TabBar"
import GridImage from "../../components/image/GridImage"
import Related, {useRelatedItems} from "../../components/post/Related"
import BackToTop from "../../components/post/BackToTop"
import PageButtons from "../../components/search/PageButtons"
import LeftIcon from "../../assets/svg/left.svg"
import {createStylesheet} from "./styles/TagScreen.styles"
import functions from "../../functions/Functions"

const pixiv = require("../../assets/icons/pixiv.png")
const twitter = require("../../assets/icons/twitter.png")
const website = require("../../assets/icons/website.png")
const wikipedia = require("../../assets/icons/wikipedia.png")
const fandom = require("../../assets/icons/fandom.png")

type Props = {
  route: RouteProp<StackParamList, "Tag">
}

const TagScreen: React.FunctionComponent<Props> = ({route}) => {
    const {session} = useSessionSelector()
    const {i18n, theme, colors} = useThemeSelector()
    const {tablet} = useLayoutSelector()
    const {scroll, sizeType, square} = useSearchSelector()
    const {setSearchTags, setSearch} = useSearchActions()
    const {setSearchScrollFlag} = useFlagActions()
    const {name} = route.params
    const {data: tag} = useGetTagQuery({tag: name})
    const styles = createStylesheet(colors)
    const [activePixivTag, setActivePixivTag] = useState("")
    const [activeAlias, setActiveAlias] = useState("")
    const ref = useRef<FlatList>(null)
    const navigation = useNavigation()

    const previousRoute = useNavigationState((state) => {
        const index = state.index
        return index > 0 ? state.routes[index - 1] : null
    })

    useEffect(() => {
        ref.current?.scrollToOffset({offset: 0})
    }, [route.params])
    
    const related = useRelatedItems({tag: name})

    const {columns} = functions.image.getImageSize(sizeType, square, tablet)

    const socialIcons = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx
        if (tag.website) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.website)}>
                    <Image style={styles.icon} source={website}/>
                </ScalableHaptic>
            )
        }
        if (tag.fandom) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.fandom)}>
                    <Image style={styles.icon} source={fandom}/>
                </ScalableHaptic>
            )
        }
        if (tag.social) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.social)}>
                    <Image style={styles.icon} source={pixiv}/>
                </ScalableHaptic>
            )
        }
        if (tag.twitter) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.twitter)}>
                    <Image style={styles.icon} source={twitter}/>
                </ScalableHaptic>
            )
        }
        if (tag.wikipedia) {
            jsx.push(
                <ScalableHaptic scaleFactor={0.95} onPress={() => functions.link.openSocialLink(tag.wikipedia)}>
                    <Image style={styles.icon} source={wikipedia}/>
                </ScalableHaptic>
            )
        }
        return jsx
    }

    const pixivTags = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx

        for (const pixivTag of tag.pixivTags ?? []) {
            const isActive = activePixivTag === pixivTag

            const onPress = async () => {
                Linking.openURL(`https://www.pixiv.net/tags/${encodeURIComponent(pixivTag)}/artworks`)
                setActivePixivTag("")
            }

            jsx.push(
                <PressableHaptic key={pixivTag} delayLongPress={200} onLongPress={() => null}
                    onPressIn={() => setActivePixivTag(pixivTag)} onPress={onPress} onPressOut={() => setActivePixivTag("")}
                    style={[styles.pixivTagContainer, isActive && styles.pixivTagContainerActive]}>
                    <Text style={[styles.pixivTag, isActive && styles.pixivTagActive]}>{pixivTag}</Text>
                </PressableHaptic>
            )
        }
        return jsx
    }

    const aliases = () => {
        let jsx = [] as React.ReactElement[]
        if (!tag) return jsx

        for (const alias of tag.aliases ?? []) {
            if (!alias) continue
            let aliasTag = alias.alias
            const isActive = activeAlias === aliasTag

            const onPress = async () => {
                setSearchTags([aliasTag])
                setSearch(aliasTag)
                navigation.navigate("Posts", undefined, {pop: true})
                setActiveAlias("")
            }

            jsx.push(
                <PressableHaptic key={aliasTag} delayLongPress={200} onLongPress={() => null}
                    onPressIn={() => setActiveAlias(aliasTag)} onPress={onPress} onPressOut={() => setActiveAlias("")}
                    style={[styles.aliasTagContainer, isActive && styles.aliasTagContainerActive]}>
                    <Text style={[styles.aliasTag, isActive && styles.aliasTagActive]}>{aliasTag}</Text>
                </PressableHaptic>
            )
        }
        return jsx
    }

    const pressAction = () => {
        if (!tag) return
        ReactNativeHapticFeedback.trigger("impactMedium")
        setSearchTags([tag.tag])
        setSearch(tag.tag)
        navigation.navigate("Posts", undefined, {pop: true})
        setSearchScrollFlag(true)
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
                            {previousRoute?.name === "Post" ? i18n.buttons.post : i18n.navbar.tags}
                        </Text>
                        </>
                    )}
                    </PressableHaptic>
                </View>
                {tag && <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        {tag.image && <Image style={styles.image} source={{uri: functions.link.getTagLink(tag)}}/>}
                        <Text style={[styles.tag, {color: functions.tag.getTagColor(tag, colors)}]}>
                            {functions.util.toProperCase(tag.tag.replace(/-/g, " "))}
                        </Text>
                        {socialIcons()}
                    </View>

                    {tag.pixivTags?.length && <View style={styles.rowContainer}>
                        {pixivTags()}
                    </View>}

                    {tag.aliases?.length && <View style={styles.rowContainer}>
                        {aliases()}
                    </View>}

                    <View style={styles.rowContainer}>
                        <Text style={styles.text} selectable uiTextView
                        selectionColor={colors.borderColor}>{tag.description}</Text>
                    </View>
                </View>}
                <Related count={related.totalItems} pressAction={pressAction}/>
                </>
            }
            ref={ref}
            key={columns}
            data={related.posts}
            renderItem={({item}) => <GridImage post={item}/>}
            keyExtractor={(item) => item.postID.toString()}
            numColumns={columns}
            columnWrapperStyle={columns !== 1 ? styles.row : undefined}

            onEndReached={scroll ? related.loadMore : undefined}
            onEndReachedThreshold={scroll ? 0.1 : undefined}

            contentContainerStyle={{backgroundColor: colors.background}}
            ListHeaderComponentStyle={{paddingBottom: 10}}
            ListFooterComponentStyle={{paddingTop: 10}}
            
            showsVerticalScrollIndicator={false}

            ListFooterComponent={!scroll ? <>
                <PageButtons page={related.page} setPage={related.setPage} 
                totalPages={related.totalPages} hideEndArrow={true}
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

export default TagScreen