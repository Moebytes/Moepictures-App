/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {AppRegistry, LogBox} from "react-native"
import {Provider} from "react-redux"
import {name} from "./app.json"
import store from "./store"
import App from "./App"

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews"
])

const Root = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)

AppRegistry.registerComponent(name, () => Root)