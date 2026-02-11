import React from "react"
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import PostsScreen from "./screens/search/PostsScreen"
import PostScreen from "./screens/item/PostScreen"
import DummyScreen from "./screens/search/DummyScreen"

type RootStackParamList = {
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
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App: React.FunctionComponent = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Posts" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Posts" component={PostsScreen}/>
          <Stack.Screen name="Comments" component={DummyScreen}/>
          <Stack.Screen name="Notes" component={DummyScreen}/>
          <Stack.Screen name="Tags" component={DummyScreen}/>
          <Stack.Screen name="Groups" component={DummyScreen}/>
          <Stack.Screen name="Profile" component={DummyScreen}/>
          <Stack.Screen name="Post" component={PostScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
}

export default App