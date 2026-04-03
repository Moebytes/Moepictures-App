/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useRef} from "react"
import {NavigationContainer, NavigationContainerRef} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {ActionSheetProvider} from "@expo/react-native-action-sheet"
import {useFlagActions, useSessionSelector} from "./store"
import Toast from "react-native-toast-message"
import AsyncStorage from "./AsyncStorage"
import Dialogs from "./dialogs/Dialogs"
import Sheets from "./sheets/Sheets"
import SavePrompt from "./ui/SavePrompt"
import ToastUI from "./ui/Toast"
import PostsScreen from "./screens/search/PostsScreen"
import PostScreen from "./screens/item/PostScreen"
import CommentsScreen from "./screens/search/CommentsScreen"
import NotesScreen from "./screens/search/NotesScreen"
import TagsScreen from "./screens/search/TagsScreen"
import TagScreen from "./screens/item/TagScreen"
import GroupsScreen from "./screens/search/GroupsScreen"
import GroupScreen from "./screens/item/GroupScreen"
import HistoryScreen from "./screens/search/HistoryScreen"
import ProfileScreen from "./screens/settings/ProfileScreen"
import LanguageScreen from "./screens/settings/LanguageScreen"
import AppColorScreen from "./screens/settings/AppColorScreen"
import TermsOfServiceScreen from "./screens/info/TermsScreen"
import PrivacyPolicyScreen from "./screens/info/PrivacyScreen"
import ContactScreen from "./screens/info/ContactScreen"
import CopyrightRemovalScreen from "./screens/info/CopyrightRemovalScreen"
import LoginScreen from "./screens/settings/LoginScreen"
import $2FAScreen from "./screens/settings/2FAScreen"
import functions from "./functions/Functions"

export type StackParamList = {
  Posts: undefined
  Comments: undefined
  Notes: undefined
  Tags: undefined
  Groups: undefined
  History: undefined
  Profile: undefined
  Post: {postID: string}
  Tag: {name: string}
  Group: {slug: string}
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
    const {top} = useSafeAreaInsets()
    const navigationRef = useRef<NavigationContainerRef<StackParamList>>(null)

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

    return (
      <ActionSheetProvider>
        <NavigationContainer ref={navigationRef} onStateChange={onNavigationChange}>
          <AsyncStorage/>
          <SavePrompt/>
          <Dialogs/>
          <Sheets/>
          <Stack.Navigator initialRouteName="Posts" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Posts" component={PostsScreen}/>
            <Stack.Screen name="Post" component={PostScreen}/>
            <Stack.Screen name="Comments" component={CommentsScreen}/>
            <Stack.Screen name="Notes" component={NotesScreen}/>
            <Stack.Screen name="Tags" component={TagsScreen}/>
            <Stack.Screen name="Tag" component={TagScreen}/>
            <Stack.Screen name="Groups" component={GroupsScreen}/>
            <Stack.Screen name="Group" component={GroupScreen}/>
            <Stack.Screen name="History" component={HistoryScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Language" component={LanguageScreen}/>
            <Stack.Screen name="AppColor" component={AppColorScreen}/>
            <Stack.Screen name="Terms" component={TermsOfServiceScreen}/>
            <Stack.Screen name="Privacy" component={PrivacyPolicyScreen}/>
            <Stack.Screen name="Contact" component={ContactScreen}/>
            <Stack.Screen name="Copyright" component={CopyrightRemovalScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="$2FA" component={$2FAScreen}/>
          </Stack.Navigator>
          <Toast type="info" visibilityTime={2000} topOffset={top+10} config={{info: ToastUI}}/>
        </NavigationContainer>
      </ActionSheetProvider>
    )
}

export default App