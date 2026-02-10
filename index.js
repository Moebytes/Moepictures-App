import {AppRegistry} from "react-native"
import {Provider} from "react-redux"
import {name} from "./app.json"
import store from "./store"
import App from "./App"

const Root = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)

AppRegistry.registerComponent(name, () => Root)