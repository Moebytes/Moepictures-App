import React from "react"
import {View, Text, Pressable} from "react-native"
import {useNavigation} from "@react-navigation/native"
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

    return (
        <View style={styles.container}>
            <Pressable style={styles.iconContainer} onPress={() => navigation.navigate("Posts")}>
                <PostsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Posts</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => navigation.navigate("Comments")}>
                <CommentsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Comments</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => navigation.navigate("Notes")}>
                <NotesIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Notes</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => navigation.navigate("Tags")}>
                <TagsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Tags</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => navigation.navigate("Groups")}>
                <GroupsIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Groups</Text>
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={() => navigation.navigate("Profile")}>
                <ProfileIcon width={iconSize} height={iconSize} color={colors.iconColor}/>
                <Text style={styles.text}>Profile</Text>
            </Pressable>
        </View>
    )
}

export default TabBar