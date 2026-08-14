/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useRef} from "react"
import {Linking, Platform} from "react-native"
import {NavigationContainer, NavigationContainerRef} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useActiveActions, useActiveSelector, useCacheSelector, useFlagActions, useSessionSelector, useThemeSelector} from "./store"
import Toast from "react-native-toast-message"
import EventSource from "react-native-sse"
import AsyncStorage from "./AsyncStorage"
import Dialogs from "./dialogs/Dialogs"
import EmojiStrip from "./components/tooltip/EmojiStrip"
import Sheets from "./sheets/Sheets"
import SavePrompt from "./ui/SavePrompt"
import ToastUI from "./ui/Toast"
import PostsScreen from "./screens/search/PostsScreen"
import PostScreen from "./screens/item/PostScreen"
import EditPostScreen from "./screens/edit/EditPostScreen"
import PostHistoryScreen from "./screens/history/PostHistoryScreen"
import CommentsScreen from "./screens/search/CommentsScreen"
import NotesScreen from "./screens/search/NotesScreen"
import TagsScreen from "./screens/search/TagsScreen"
import TagScreen from "./screens/item/TagScreen"
import EditTagScreen from "./screens/edit/EditTagScreen"
import TagHistoryScreen from "./screens/history/TagHistoryScreen"
import GroupsScreen from "./screens/search/GroupsScreen"
import GroupScreen from "./screens/item/GroupScreen"
import EditGroupScreen from "./screens/edit/EditGroupScreen"
import GroupHistoryScreen from "./screens/history/GroupHistoryScreen"
import FavgroupsScreen from "./screens/search/FavgroupsScreen"
import FavgroupScreen from "./screens/item/FavgroupScreen"
import EditFavgroupScreen from "./screens/edit/EditFavgroupScreen"
import SearchHistoryScreen from "./screens/history/SearchHistoryScreen"
import ProfileScreen from "./screens/settings/ProfileScreen"
import LanguageScreen from "./screens/settings/LanguageScreen"
import AppColorScreen from "./screens/settings/AppColorScreen"
import TermsOfServiceScreen from "./screens/info/TermsScreen"
import PrivacyPolicyScreen from "./screens/info/PrivacyScreen"
import ContactScreen from "./screens/info/ContactScreen"
import CopyrightRemovalScreen from "./screens/info/CopyrightRemovalScreen"
import LoginScreen from "./screens/settings/LoginScreen"
import SignupScreen from "./screens/settings/SignupScreen"
import $2FAScreen from "./screens/settings/2FAScreen"
import ForgotPasswordScreen from "./screens/settings/ForgotPasswordScreen"
import UserSettingsScreen from "./screens/settings/UserSettingsScreen"
import DeleteAccountScreen from "./screens/settings/DeleteAccountScreen"
import ChangeUsernameScreen from "./screens/settings/ChangeUsernameScreen"
import ChangePasswordScreen from "./screens/settings/ChangePasswordScreen"
import ChangeEmailScreen from "./screens/settings/ChangeEmailScreen"
import VerifyEmailScreen from "./screens/settings/VerifyEmailScreen"
import HelpScreen from "./screens/info/HelpScreen"
import PremiumScreen from "./screens/info/PremiumScreen"
import UserScreen from "./screens/item/UserScreen"
import functions from "./functions/Functions"
import {siteURL} from "./ui/site"

export type StackParamList = {
  Posts: undefined
  Post: {postID: string, historyID?: string}
  EditPost: {postID: string}
  PostHistory: {postID: string}
  Comments: undefined
  Notes: undefined
  Tags: undefined
  Tag: {name: string, historyID?: string}
  EditTag: {name: string}
  TagHistory: {name: string}
  Groups: undefined
  Group: {slug: string, historyID?: string}
  EditGroup: {slug: string}
  GroupHistory: {slug: string}
  History: undefined
  Favgroups: undefined
  Favgroup: {slug: string, username?: string}
  EditFavgroup: {slug: string}
  Profile: undefined
  Language: undefined
  AppColor: undefined
  Terms: undefined
  Privacy: undefined
  Contact: undefined
  Copyright: undefined
  Login: undefined
  SignUp: undefined
  $2FA: undefined
  ForgotPassword: undefined
  UserSettings: undefined
  DeleteAccount: undefined
  ChangeUsername: undefined
  ChangePassword: undefined
  ChangeEmail: undefined
  VerifyEmail: undefined
  Help: undefined
  Premium: undefined
  User: {username: string}
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}

const Stack = createNativeStackNavigator<StackParamList>()

const App: React.FunctionComponent = () => {
    const {session} = useSessionSelector()
    const {setSessionFlag} = useFlagActions()
    const {navigationPosts} = useCacheSelector()
    const {activeFavgroup} = useActiveSelector()
    const {setActiveFavgroup} = useActiveActions()
    const {top} = useSafeAreaInsets()
    const navigationRef = useRef<NavigationContainerRef<StackParamList>>(null)

    useEffect(() => {
      const handleURL = (event: {url: string}) => 
          functions.handleAppLink(event.url, navigationRef.current!)

      Linking.getInitialURL().then((url) => url && 
        functions.handleAppLink(url, navigationRef.current!))

      const sub = Linking.addEventListener("url", handleURL)

      return () => sub.remove()
    }, [])

    useEffect(() => {
        if (!session.username) return
        let headers = {"Accept": "text/event-stream", "Cache-Control": "no-cache"} as {[key: string]: string}
        if (Platform.OS === "android") headers["cookie"] = functions.http.sessionCookie

        let events = new EventSource(`${siteURL}/api/notifications`, {headers, withCredentials: true})

        events.addEventListener("message", (event) => {
            if (event.data === "email verified") setSessionFlag(true)
        })
        return () => {
            events.removeAllEventListeners()
            events.close()
        }
    }, [session.username])

    const destroy2FA = async () => {
        try {
            await functions.http.delete("/api/2fa/delete", null, session)
            functions.http.privateKey = ""
            functions.http.privateKeyLock = false
            setSessionFlag(true)
        } catch {
            // ignore
        }
    }

    const onNavigationChange = () => {
        const currentRoute = navigationRef.current?.getCurrentRoute()?.name
        if (!session.username && session.email) {
          if (currentRoute !== "$2FA") {
            destroy2FA()
          }
        }
    }

    useEffect(() => {
      if (activeFavgroup) {
        const navPosts = new Set(navigationPosts.map(p => p.postID))
        const notFound = activeFavgroup.posts.some((post) => !navPosts.has(post.postID))
        if (notFound) setActiveFavgroup(null)
      }
    }, [activeFavgroup, navigationPosts])

    return (
      <NavigationContainer ref={navigationRef} onStateChange={onNavigationChange}>
        <AsyncStorage/>
        <SavePrompt/>
        <EmojiStrip/>
        <Dialogs/>
        <Sheets/>
        <Stack.Navigator initialRouteName="Posts" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Posts" component={PostsScreen}/>
          <Stack.Screen name="Post" component={PostScreen}/>
          <Stack.Screen name="EditPost" component={EditPostScreen}/>
          <Stack.Screen name="PostHistory" component={PostHistoryScreen}/>
          <Stack.Screen name="Comments" component={CommentsScreen}/>
          <Stack.Screen name="Notes" component={NotesScreen}/>
          <Stack.Screen name="Tags" component={TagsScreen}/>
          <Stack.Screen name="Tag" component={TagScreen}/>
          <Stack.Screen name="EditTag" component={EditTagScreen}/>
          <Stack.Screen name="TagHistory" component={TagHistoryScreen}/>
          <Stack.Screen name="Groups" component={GroupsScreen}/>
          <Stack.Screen name="Group" component={GroupScreen}/>
          <Stack.Screen name="EditGroup" component={EditGroupScreen}/>
          <Stack.Screen name="GroupHistory" component={GroupHistoryScreen}/>
          <Stack.Screen name="Favgroups" component={FavgroupsScreen}/>
          <Stack.Screen name="Favgroup" component={FavgroupScreen}/>
          <Stack.Screen name="EditFavgroup" component={EditFavgroupScreen}/>
          <Stack.Screen name="History" component={SearchHistoryScreen}/>
          <Stack.Screen name="Profile" component={ProfileScreen}/>
          <Stack.Screen name="Language" component={LanguageScreen}/>
          <Stack.Screen name="AppColor" component={AppColorScreen}/>
          <Stack.Screen name="Terms" component={TermsOfServiceScreen}/>
          <Stack.Screen name="Privacy" component={PrivacyPolicyScreen}/>
          <Stack.Screen name="Contact" component={ContactScreen}/>
          <Stack.Screen name="Copyright" component={CopyrightRemovalScreen}/>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="SignUp" component={SignupScreen}/>
          <Stack.Screen name="$2FA" component={$2FAScreen}/>
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
          <Stack.Screen name="UserSettings" component={UserSettingsScreen}/>
          <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen}/>
          <Stack.Screen name="ChangeUsername" component={ChangeUsernameScreen}/>
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
          <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen}/>
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen}/>
          <Stack.Screen name="Help" component={HelpScreen}/>
          <Stack.Screen name="Premium" component={PremiumScreen}/>
          <Stack.Screen name="User" component={UserScreen}/>
        </Stack.Navigator>
        <Toast type="info" visibilityTime={2500} topOffset={top+10} config={{info: ToastUI}}/>
      </NavigationContainer>
    )
}

export default App