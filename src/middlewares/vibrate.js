//@flow

import { Vibration } from "react-native";
import type { Middleware } from "redux";

const vibrate: Middleware<any, any> = () => next => action => {
  if (
    action.type !== "@@TOAST/DISPLAY_ERROR" &&
    action.type !== "@@TOAST/DISPLAY_INFO" &&
    action.type !== "@@TOAST/DISPLAY_WARNING"
  ) {
    return next(action);
  }

  Vibration.vibrate();
  return next(action);
};

export default vibrate;
