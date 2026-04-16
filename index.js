/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {AppRegistry, LogBox} from "react-native"
import {SafeAreaProvider} from "react-native-safe-area-context"
import {ActionSheetProvider} from "@expo/react-native-action-sheet"
import {GestureHandlerRootView} from "react-native-gesture-handler"
import {Provider} from "react-redux"
import {name} from "./app.json"
import {Buffer} from "buffer"
import store from "./store"
import App from "./App"

global.Buffer = Buffer

LogBox.ignoreAllLogs()

const Root = () => (
  <Provider store={store}>
    <SafeAreaProvider>
    <ActionSheetProvider>
    <GestureHandlerRootView>
      <App/>
    </GestureHandlerRootView>
    </ActionSheetProvider>
    </SafeAreaProvider>
  </Provider>
)

AppRegistry.registerComponent(name, () => Root)