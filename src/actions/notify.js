//@flow

import { ToastActionsCreators } from "react-native-redux-toast";

// Single entry point for user-facing notifications so durations and
// behaviour (the vibrate middleware listens to these) stay consistent.
const ERROR_DURATION = 2000;
const INFO_DURATION = 1000;

export function notifyError(message: string) {
  return ToastActionsCreators.displayError(message, ERROR_DURATION);
}

export function notifyInfo(message: string) {
  return ToastActionsCreators.displayInfo(message, INFO_DURATION);
}
