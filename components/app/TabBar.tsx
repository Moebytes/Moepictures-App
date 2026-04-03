/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef, useEffect} from "react"
import {Text, Pressable, Animated, LayoutChangeEvent} from "react-native"
import {useNavigation, useNavigationState} from "@react-navigation/native"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {StackParamList} from "../../App"
import {SvgProps} from "react-native-svg"
import {useThemeSelector, useLayoutSelector, useLayoutActions} from "../../store"
import {createStylesheet} from "./styles/TabBar.styles"
import PostsIcon from "../../assets/svg/posts.svg"
import CommentsIcon from "../../assets/svg/comments.svg"
import NotesIcon from "../../assets/svg/notes.svg"
import TagsIcon from "../../assets/svg/tags.svg"
import GroupsIcon from "../../assets/svg/groups.svg"
import HistoryIcon from "../../assets/svg/history.svg"
import ProfileIcon from "../../assets/svg/profile.svg"

interface Props {
    relative?: boolean
    visible?: boolean
}

const TabBar: React.FunctionComponent<Props> = (props) => {
    const {i18n, colors} = useThemeSelector()
    const {tablet, tabBarHeight} = useLayoutSelector()
    const {setTabBarHeight} = useLayoutActions()
    const styles = createStylesheet(colors, tablet)
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()
    const translateY = useRef(new Animated.Value(0)).current

    let iconSize = 43

    const activeRoute = useNavigationState(
        (state) => state.routes[state.index].name
    )

    useEffect(() => {
        const visible = props.visible ?? true
        Animated.timing(translateY, {
            toValue: visible ? 0 : tabBarHeight,
            duration: 300,
            useNativeDriver: true
        }).start()
    }, [props.visible])

    const generateTabsJSX = () => {
        let jsx = [] as React.ReactElement[]

        let tabMap: {screen: keyof StackParamList, icon: React.ComponentType<SvgProps>, name: string}[] = [
            {screen: "Posts", icon: PostsIcon, name: i18n.sort.posts},
            {screen: "Comments", icon: CommentsIcon, name: i18n.navbar.comments},
            //{screen: "Notes", icon: NotesIcon, name: i18n.navbar.notes},
            {screen: "Tags", icon: TagsIcon, name: i18n.navbar.tags},
            {screen: "Groups", icon: GroupsIcon, name: i18n.sort.groups},
            {screen: "History", icon: HistoryIcon, name: i18n.sidebar.history},
            {screen: "Profile", icon: ProfileIcon, name: i18n.navbar.profile}
        ]
        for (const tab of tabMap) {
            const Icon = tab.icon
            let active = activeRoute === tab.screen
            if (activeRoute === "Post" && tab.screen === "Posts") active = true
            if (activeRoute === "Tag" && tab.screen === "Tags") active = true
            if (activeRoute === "Group" && tab.screen === "Groups") active = true
            if ((activeRoute === "Terms" || activeRoute === "Privacy" || activeRoute === "Contact"
                || activeRoute === "Copyright") && tab.screen === "Profile") active = true
            if ((activeRoute === "Login" || activeRoute === "SignUp" || activeRoute === "2FA"
                || activeRoute === "ForgotPassword") && tab.screen === "Profile") active = true

            jsx.push(
                <Pressable style={styles.iconContainer} key={tab.screen}
                    onPress={() => navigation.navigate(tab.screen, undefined as any, {pop: true})}>
                    <Icon width={iconSize} height={iconSize} 
                    color={colors.iconColor}/>
                    <Text style={active ? styles.activeText : styles.text}>{tab.name}</Text>
                </Pressable>
            )
        }

        return jsx
    }

    const onLayout = (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height
        if (tabBarHeight !== height) setTabBarHeight(height)
    }

    return (
        <Animated.View onLayout={onLayout} style={{...styles.container, 
            paddingBottom: insets.bottom,
            position: props.relative ? "relative" : "absolute",
            transform: [{translateY}]}}>
            {generateTabsJSX()}
        </Animated.View>
    )
}

export default TabBar