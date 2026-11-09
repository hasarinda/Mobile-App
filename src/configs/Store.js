import { AsyncStorage } from "react-native";
import createSensitiveStorage from "redux-persist-sensitive-storage";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  persistStore,
  persistCombineReducers,
  createTransform,
  getStoredState
} from "redux-persist";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import devices from "../reducers/devices";
import selectedDevice from "../reducers/selectedDevice";
import resources from "../reducers/resources";
import selectedResource from "../reducers/selectedResource";
import selectedAttributes from "../reducers/selectedAttributes";
import lockedAttributes from "../reducers/lockedAttributes";
import streaming from "../reducers/streaming";
import orientation from "../reducers/orientation";
import nav from "../reducers/nav";
import screenTracking from "../middlewares/screenTracking";
import login from "../reducers/login";
import userDevices from "../reducers/userDevices";
import { toastReducer as toast } from "react-native-redux-toast";
import vibrate from "../middlewares/vibrate";

// Never write the plaintext password to disk.
const stripPassword = createTransform(
  inbound => Object.assign({}, inbound, { password: undefined }),
  outbound => Object.assign({}, outbound, { password: undefined }),
  { whitelist: ["login"] }
);

// Tokens and device JWTs are kept in iOS Keychain / Android private
// SharedPreferences instead of plain AsyncStorage.
const storage = createSensitiveStorage({
  keychainService: "thingerioKeychain",
  sharedPreferencesName: "thingerioSharedPrefs"
});

// One-time migration: copy state persisted by older versions in
// AsyncStorage into secure storage. The insecure copy is deleted only
// after the new storage has been written (see configureStore).
const LEGACY_KEY = "persist:root";
let migratedLegacyState = false;

async function migrateFromAsyncStorage(state) {
  if (state) return state;
  try {
    const legacy = await getStoredState({
      key: "root",
      storage: AsyncStorage
    });
    if (legacy) {
      migratedLegacyState = true;
      if (legacy.login) {
        legacy.login = Object.assign({}, legacy.login, { password: undefined });
      }
      return legacy;
    }
  } catch (e) {
    // No legacy state or unreadable: start fresh.
  }
  return state;
}

const config = {
  key: "root",
  storage,
  migrate: migrateFromAsyncStorage,
  whitelist: ["devices", "login"],
  transforms: [stripPassword]
};

const navMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);

function configureStore() {
  const reducer = persistCombineReducers(config, {
    login,
    devices,
    userDevices,
    selectedDevice,
    resources,
    selectedResource,
    selectedAttributes,
    lockedAttributes,
    streaming,
    orientation,
    toast,
    nav
  });
  const middleware = [thunkMiddleware, navMiddleware, screenTracking, vibrate];
  const composeEnhancers =
    (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middleware))
  );
  const persistor = persistStore(store, null, () => {
    if (migratedLegacyState) {
      persistor
        .flush()
        .then(() => AsyncStorage.removeItem(LEGACY_KEY))
        .catch(() => {});
    }
  });

  // For purge the Store
  // persistor.purge();

  return { store, persistor };
}

export default configureStore;
