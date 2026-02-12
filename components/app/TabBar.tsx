import React from "react"
import {View, Text, Pressable} from "react-native"
import {useNavigation, useNavigationState} from "@react-navigation/native"
import {RootStackParamList} from "../../App"
import {SvgProps} from "react-native-svg"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/TabBar.styles"
import PostsIcon from "../../assets/svg/posts.svg"
import CommentsIcon from "../../assets/svg/comments.svg"
import NotesIcon from "../../assets/svg/notes.svg"
import TagsIcon from "../../assets/svg/tags.svg"
import GroupsIcon from "../../assets/svg/groups.svg"
import ProfileIcon from "../../assets/svg/profile.svg"

const TabBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const navigation = useNavigation()

    let iconSize = 43

    const activeRoute = useNavigationState(
        (state) => state.routes[state.index].name
    )

    const generateTabsJSX = () => {
        let jsx = [] as React.ReactElement[]

        let tabMap: {name: keyof RootStackParamList, icon: React.ComponentType<SvgProps>}[] = [
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
                    onPress={() => navigation.navigate(tab.name, undefined, {pop: true})}>
                    <Icon width={iconSize} height={iconSize} 
                    color={colors.iconColor}/>
                    <Text style={active ? styles.activeText : styles.text}>{tab.name}</Text>
                </Pressable>
            )
        }

        return jsx
    }

    return (
        <View style={styles.container}>
            {generateTabsJSX()}
        </View>
    )
}

export default TabBar