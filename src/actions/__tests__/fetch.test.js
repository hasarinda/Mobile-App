jest.mock("../../API/API", () => ({
  login: jest.fn(),
  refreshToken: jest.fn(),
  getUserDeviceList: jest.fn(),
  getResources: jest.fn(),
  getResource: jest.fn(),
  post: jest.fn(),
  run: jest.fn()
}));
jest.mock(
  "react-native-redux-toast",
  () => ({
    ToastActionsCreators: {
      displayError: (message, duration) => ({
        type: "@@TOAST/DISPLAY_ERROR",
        message,
        duration
      })
    }
  }),
  { virtual: true }
);

import API from "../../API/API";
import {
  loginFromApi,
  refreshTokenFromApi,
  getDevicesFromApi,
  getResourcesFromApi,
  runResource
} from "../fetch";

const response = (status, body) => ({
  status,
  ok: status >= 200 && status < 300,
  json: () => Promise.resolve(body)
});

// Minimal redux-thunk style dispatch that records plain actions.
function createDispatch() {
  const actions = [];
  const dispatch = action =>
    typeof action === "function"
      ? action(dispatch)
      : (actions.push(action), action);
  return { dispatch, actions, types: () => actions.map(a => a.type) };
}

beforeEach(() => jest.resetAllMocks());

describe("loginFromApi", () => {
  it("receives the session on 200", async () => {
    API.login.mockResolvedValue(
      response(200, { access_token: "a", refresh_token: "r" })
    );
    const { dispatch } = createDispatch();
    const result = await dispatch(loginFromApi("https://s", "u", "p"));
    expect(result).toEqual({
      type: "RECEIVE_SESSION",
      accessToken: "a",
      refreshToken: "r"
    });
  });

  it("reports wrong credentials", async () => {
    API.login.mockResolvedValue(response(401, {}));
    const { dispatch } = createDispatch();
    const result = await dispatch(loginFromApi("https://s", "u", "p"));
    expect(result).toEqual({
      type: "RECEIVE_SESSION_FAILURE",
      reason: "credentials"
    });
  });

  it("reports network errors instead of throwing", async () => {
    API.login.mockRejectedValue(new TypeError("Network request failed"));
    const { dispatch } = createDispatch();
    const result = await dispatch(loginFromApi("https://s", "u", "p"));
    expect(result).toEqual({
      type: "RECEIVE_SESSION_FAILURE",
      reason: "network"
    });
  });
});

describe("refreshTokenFromApi", () => {
  it("resolves to the new tokens", async () => {
    API.refreshToken.mockResolvedValue(
      response(200, { access_token: "a2", refresh_token: "r2" })
    );
    const { dispatch } = createDispatch();
    const tokens = await dispatch(refreshTokenFromApi("https://s", "r"));
    expect(tokens).toEqual({ accessToken: "a2", refreshToken: "r2" });
  });

  it("logs out and resolves to null when refresh is rejected", async () => {
    API.refreshToken.mockResolvedValue(response(400, {}));
    const { dispatch, types } = createDispatch();
    const tokens = await dispatch(refreshTokenFromApi("https://s", "r"));
    expect(tokens).toBeNull();
    expect(types()).toContain("LOG_OUT");
  });
});

describe("getDevicesFromApi", () => {
  it("refreshes the token once and retries after a 401", async () => {
    API.getUserDeviceList
      .mockResolvedValueOnce(response(401, {}))
      .mockResolvedValueOnce(response(200, []));
    API.refreshToken.mockResolvedValue(
      response(200, { access_token: "a2", refresh_token: "r2" })
    );
    const { dispatch, types } = createDispatch();
    await dispatch(getDevicesFromApi("https://s", "u", "a", "r"));
    expect(API.getUserDeviceList).toHaveBeenCalledTimes(2);
    expect(API.getUserDeviceList.mock.calls[1][2]).toBe("a2");
    expect(types()).toContain("LOGIN_RECEIVE_DEVICES");
  });

  it("does not loop when the retried request is still unauthorized", async () => {
    API.getUserDeviceList.mockResolvedValue(response(401, {}));
    API.refreshToken.mockResolvedValue(
      response(200, { access_token: "a2", refresh_token: "r2" })
    );
    const { dispatch, types } = createDispatch();
    await dispatch(getDevicesFromApi("https://s", "u", "a", "r"));
    expect(API.getUserDeviceList).toHaveBeenCalledTimes(2);
    expect(types()).toContain("LOG_OUT");
  });

  it("clears the loading state and shows an error on network failure", async () => {
    API.getUserDeviceList.mockRejectedValue(new TypeError("offline"));
    const { dispatch, types } = createDispatch();
    await dispatch(getDevicesFromApi("https://s", "u", "a", "r"));
    expect(types()).toEqual(
      expect.arrayContaining(["@@TOAST/DISPLAY_ERROR", "LOGIN_RECEIVE_DEVICES"])
    );
  });
});

describe("getResourcesFromApi", () => {
  it("skips requests for expired device tokens", async () => {
    const device = {
      id: "d",
      exp: 1,
      server: "https://s",
      usr: "u",
      dev: "d",
      jwt: "j"
    };
    const { dispatch, types } = createDispatch();
    await dispatch(getResourcesFromApi(device));
    expect(API.getResources).not.toHaveBeenCalled();
    expect(types()).toEqual(["DEVICE_DEAUTHORIZE"]);
  });
});

describe("runResource", () => {
  it("shows an error when the request fails", async () => {
    API.run.mockResolvedValue(response(500, {}));
    const device = {
      id: "d",
      server: "https://s",
      usr: "u",
      dev: "d",
      jwt: "j"
    };
    const { dispatch, types } = createDispatch();
    await dispatch(runResource(device, "led"));
    expect(types()).toContain("@@TOAST/DISPLAY_ERROR");
  });
});
