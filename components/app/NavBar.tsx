import React from "react"
import {View, Text, Pressable} from "react-native"
import {useThemeSelector} from "../../store"
import {createStylesheet} from "./styles/NavBar.styles"
import PostsIcon from "../../assets/svg/posts.svg"
import CommentsIcon from "../../assets/svg/comments.svg"
import NotesIcon from "../../assets/svg/notes.svg"
import TagsIcon from "../../assets/svg/tags.svg"
import GroupsIcon from "../../assets/svg/groups.svg"
import ProfileIcon from "../../assets/svg/profile.svg"

const NavBar: React.FunctionComponent = () => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)

    let iconSize = 43

    return (
        <View style={styles.container}>
            <Pressable style={styles.iconContainer}>
                <PostsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Posts</Text>
            </Pressable>
            <Pressable style={styles.iconContainer}>
                <CommentsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Comments</Text>
            </Pressable>
            <Pressable style={styles.iconContainer}>
                <NotesIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Notes</Text>
            </Pressable>
            <Pressable style={styles.iconContainer}>
                <TagsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Tags</Text>
            </Pressable>
            <Pressable style={styles.iconContainer}>
                <GroupsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Groups</Text>
            </Pressable>
            <Pressable style={styles.iconContainer}>
                <ProfileIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Profile</Text>
            </Pressable>
        </View>
    )
}

export default NavBar