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
import ProfileIcon from "../../assets/svg/profile.svg"

interface Props {
    visible?: boolean
}

const TabBar: React.FunctionComponent<Props> = (props) => {
    const {colors} = useThemeSelector()
    const {tabBarHeight} = useLayoutSelector()
    const {setTabBarHeight} = useLayoutActions()
    const styles = createStylesheet(colors)
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

        let tabMap: {name: keyof StackParamList, icon: React.ComponentType<SvgProps>}[] = [
            {name: "Posts", icon: PostsIcon},
            {name: "Comments", icon: CommentsIcon},
            {name: "Notes", icon: NotesIcon},
            {name: "Tags", icon: TagsIcon},
            {name: "Groups", icon: GroupsIcon},
            {name: "Profile", icon: ProfileIcon}
        ]
        for (const tab of tabMap) {
            const Icon = tab.icon
            const active = activeRoute === tab.name

            jsx.push(
                <Pressable style={styles.iconContainer} key={tab.name}
                    onPress={() => navigation.navigate(tab.name, undefined as any, {pop: true})}>
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
            transform: [{translateY}]}}>
            {generateTabsJSX()}
        </Animated.View>
    )
}

export default TabBar