/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {AppRegistry, LogBox} from "react-native"
import {Provider} from "react-redux"
import {name} from "./app.json"
import {Buffer} from "buffer"
import store from "./store"
import App from "./App"

global.Buffer = Buffer

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
  "InteractionManager has been deprecated and will be removed in a future release.",
  "Require cycle:"
])

const Root = () => (
  <Provider store={store}>
      <App/>
  </Provider>
)

AppRegistry.registerComponent(name, () => Root)