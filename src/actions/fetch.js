//@flow

import {
  addDevice,
  authorizeDevice,
  deauthorizeDevice,
  receiveDevice,
  requestDevice,
  setDeviceServerStatus,
  setDeviceState
} from "./device";
import { receiveResource, requestResource } from "./resource";
import {
  logOut,
  receiveDevices,
  receiveSession,
  receiveSessionFailure,
  requestDevices,
  requestSession
} from "./login";
import API from "../API/API";
import { notifyError } from "./notify";
import { AppError, ErrorCode, isConnectionError } from "../utils/errors";
import { isExpired } from "../utils/jwt";
import type { Device } from "../types/Device";
import type { ThunkAction } from "../types/Dispatch";
import type { Attribute } from "../types/Attribute";

function showError(dispatch, message: string) {
  dispatch(notifyError(message));
}

function handleResponseStatus(device, status, dispatch) {
  switch (status) {
    case 200:
      dispatch(authorizeDevice(device.id));
      dispatch(setDeviceState(device.id, true));
      break;
    case 401:
      dispatch(deauthorizeDevice(device.id));
      break;
    case 404:
      dispatch(authorizeDevice(device.id));
      dispatch(setDeviceState(device.id, false));
      break;
  }
}

export function loginFromApi(
  server: string,
  username: string,
  password: string
): ThunkAction {
  return async dispatch => {
    try {
      dispatch(requestSession());
      const response = await API.login(server, username, password);
      if (response.status === 200) {
        const json = await response.json();
        return dispatch(receiveSession(json.access_token, json.refresh_token));
      } else {
        return dispatch(receiveSessionFailure("credentials"));
      }
    } catch (error) {
      return dispatch(receiveSessionFailure("network"));
    }
  };
}

export function refreshTokenFromApi(
  server: string,
  refreshToken: string
): ThunkAction {
  // Resolves to the new tokens, or null if the session could not be refreshed.
  return async dispatch => {
    try {
      dispatch(requestSession());
      const response = await API.refreshToken(server, refreshToken);
      if (response.status === 200) {
        const json = await response.json();
        dispatch(receiveSession(json.access_token, json.refresh_token));
        return {
          accessToken: json.access_token,
          refreshToken: json.refresh_token
        };
      }
      dispatch(logOut());
    } catch (error) {
      dispatch(receiveSessionFailure());
    }
    return null;
  };
}

export function getDevicesFromApi(
  server: string,
  username: string,
  accessToken: string,
  refreshToken: string,
  isRetry: boolean = false
): ThunkAction {
  return async dispatch => {
    dispatch(requestDevices());
    try {
      const response = await API.getUserDeviceList(
        server,
        username,
        accessToken
      );
      switch (response.status) {
        case 200:
          const devices = await response.json();
          const promises = devices.map(device =>
            dispatch(
              addDevice(
                {
                  [device.device]: {
                    jwt: accessToken,
                    id: device.device,
                    dev: device.device,
                    usr: username,
                    desc: device.description,
                    isFetching: false,
                    isOnline: device.connection === "active",
                    isAuthorized: true,
                    server,
                    hasServerConnection: true
                  }
                },
                true
              )
            )
          );
          await Promise.all(promises);
          break;
        case 401:
          // Refresh once; if that fails the user has already been logged out.
          if (!isRetry) {
            const tokens = await dispatch(
              refreshTokenFromApi(server, refreshToken)
            );
            if (tokens) {
              return dispatch(
                getDevicesFromApi(
                  server,
                  username,
                  tokens.accessToken,
                  tokens.refreshToken,
                  true
                )
              );
            }
          } else {
            dispatch(logOut());
          }
          break;
      }
    } catch (error) {
      showError(dispatch, "Couldn't load your devices. Check your connection.");
    }
    return dispatch(receiveDevices());
  };
}

export function getResourceFromApi(
  device: Device,
  resource: string
): ThunkAction {
  return async dispatch => {
    try {
      dispatch(requestResource(resource));
      const response = await API.getResource(
        device.server,
        device.usr,
        device.dev,
        resource,
        device.jwt
      );
      dispatch(setDeviceServerStatus(device.id, true));
      await handleResponseStatus(device, response.status, dispatch);
      const json = await response.json();
      return dispatch(receiveResource(resource, json));
    } catch (error) {
      if (isConnectionError(error))
        dispatch(setDeviceServerStatus(device.id, false));
    }
  };
}

export function getResourcesFromApi(device: Device): ThunkAction {
  return async dispatch => {
    if (isExpired(device.exp)) {
      // Don't send a request that is guaranteed to fail with 401.
      return dispatch(deauthorizeDevice(device.id));
    }
    try {
      dispatch(requestDevice(device.id));
      let resources;
      if (!device.res) {
        const response = await API.getResources(
          device.server,
          device.usr,
          device.dev,
          device.jwt
        );
        dispatch(setDeviceServerStatus(device.id, true));
        await handleResponseStatus(device, response.status, dispatch);
        const json = await response.json();
        resources = Object.keys(json);
      } else {
        resources = device.res;
      }
      const promises = resources.map(key =>
        dispatch(getResourceFromApi(device, key))
      );
      await Promise.all(promises);
      return dispatch(receiveDevice(device.id));
    } catch (error) {
      dispatch(receiveDevice(device.id));
      if (isConnectionError(error))
        dispatch(setDeviceServerStatus(device.id, false));
    }
  };
}

export function postResource(
  device: Device,
  resource: string,
  value: Attribute | { [attribute: string]: Attribute }
): ThunkAction {
  return async dispatch => {
    dispatch(requestResource(resource));
    try {
      const response = await API.post(
        device.server,
        device.usr,
        device.dev,
        resource,
        value,
        device.jwt
      );
      handleResponseStatus(device, response.status, dispatch);
      if (!response.ok) throw new AppError(ErrorCode.HTTP, response.status);
      // Some resources reply with an empty body.
      let json = {};
      try {
        json = await response.json();
      } catch (e) {
        // Ignore: keep the empty object.
      }
      return dispatch(
        receiveResource(resource, Object.assign({}, { in: value }, json))
      );
    } catch (error) {
      if (isConnectionError(error))
        dispatch(setDeviceServerStatus(device.id, false));
      showError(dispatch, "Couldn't send value to " + resource);
      // Re-fetch so the UI shows the device's real state again.
      return dispatch(getResourceFromApi(device, resource));
    }
  };
}

export function runResource(device: Device, resource: string): ThunkAction {
  return async dispatch => {
    try {
      const response = await API.run(
        device.server,
        device.usr,
        device.dev,
        resource,
        device.jwt
      );
      handleResponseStatus(device, response.status, dispatch);
      if (!response.ok) throw new AppError(ErrorCode.HTTP, response.status);
    } catch (error) {
      if (isConnectionError(error))
        dispatch(setDeviceServerStatus(device.id, false));
      showError(dispatch, "Couldn't run " + resource);
    }
  };
}
