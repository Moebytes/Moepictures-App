/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {SafeAreaProvider} from "react-native-safe-area-context"
import AsyncStorage from "./AsyncStorage"
import PostsScreen from "./screens/search/PostsScreen"
import PostScreen from "./screens/item/PostScreen"
import CommentsScreen from "./screens/search/CommentsScreen"
import ProfileScreen from "./screens/settings/ProfileScreen"
import DummyScreen from "./screens/search/DummyScreen"

export type StackParamList = {
  Posts: undefined
  Comments: undefined
  Notes: undefined
  Tags: undefined
  Groups: undefined
  Profile: undefined
  Post: undefined
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
        <NavigationContainer>
          <AsyncStorage/>
          <Stack.Navigator initialRouteName="Posts" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Posts" component={PostsScreen}/>
            <Stack.Screen name="Comments" component={CommentsScreen}/>
            <Stack.Screen name="Notes" component={DummyScreen}/>
            <Stack.Screen name="Tags" component={DummyScreen}/>
            <Stack.Screen name="Groups" component={DummyScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Post" component={PostScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    )
}

export default App