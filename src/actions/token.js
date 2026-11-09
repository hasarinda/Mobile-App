//@flow

import { addDevice } from "./device";
import { t } from "../i18n";
import { notifyError, notifyInfo } from "./notify";
import { parseJWT } from "../utils/jwt";
import { AppError, ErrorCode, deviceTokenErrorMessage } from "../utils/errors";
import type { ThunkAction } from "../types/Dispatch";

// Adds a device from a token scanned as QR or pasted from the clipboard.
// Resolves to true when the device was added.
export function addDeviceFromToken(
  token: string,
  existingIds: Array<string>
): ThunkAction {
  return dispatch => {
    try {
      const device = parseJWT(token);
      const id = Object.keys(device)[0];
      if (existingIds.includes(id)) {
        throw new AppError(ErrorCode.DEVICE_EXISTS);
      }
      dispatch(addDevice(device, false));
      dispatch(notifyInfo(t("devices.added")));
      return true;
    } catch (error) {
      dispatch(notifyError(deviceTokenErrorMessage(error)));
      return false;
    }
  };
}
