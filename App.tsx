/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {SafeAreaProvider} from "react-native-safe-area-context"
import {ActionSheetProvider} from "@expo/react-native-action-sheet"
import AsyncStorage from "./AsyncStorage"
import Dialogs from "./dialogs/Dialogs"
import Sheets from "./sheets/Sheets"
import SavePrompt from "./ui/SavePrompt"
import PostsScreen from "./screens/search/PostsScreen"
import PostScreen from "./screens/item/PostScreen"
import CommentsScreen from "./screens/search/CommentsScreen"
import NotesScreen from "./screens/search/NotesScreen"
import TagsScreen from "./screens/search/TagsScreen"
import GroupsScreen from "./screens/search/GroupsScreen"
import ProfileScreen from "./screens/settings/ProfileScreen"
import LanguageScreen from "./screens/settings/LanguageScreen"
import AppColorScreen from "./screens/settings/AppColorScreen"
import TermsOfServiceScreen from "./screens/settings/TermsOfServiceScreen"
import PrivacyPolicyScreen from "./screens/settings/PrivacyPolicyScreen"

export type StackParamList = {
  Posts: undefined
  Comments: undefined
  Notes: undefined
  Tags: undefined
  Groups: undefined
  Profile: undefined
  Post: {postID: string}
  Language: undefined
  AppColor: undefined
  Terms: undefined
  Privacy: undefined
  Contact: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}

const Stack = createNativeStackNavigator<StackParamList>()

const App: React.FunctionComponent = () => {
    return (
      <SafeAreaProvider>
      <ActionSheetProvider>
        <NavigationContainer>
          <AsyncStorage/>
          <SavePrompt/>
          <Dialogs/>
          <Sheets/>
          <Stack.Navigator initialRouteName="Posts" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Posts" component={PostsScreen}/>
            <Stack.Screen name="Comments" component={CommentsScreen}/>
            <Stack.Screen name="Notes" component={NotesScreen}/>
            <Stack.Screen name="Tags" component={TagsScreen}/>
            <Stack.Screen name="Groups" component={GroupsScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Post" component={PostScreen}/>
            <Stack.Screen name="Language" component={LanguageScreen}/>
            <Stack.Screen name="AppColor" component={AppColorScreen}/>
            <Stack.Screen name="Terms" component={TermsOfServiceScreen}/>
            <Stack.Screen name="Privacy" component={PrivacyPolicyScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
      </SafeAreaProvider>
    )
}

export default App