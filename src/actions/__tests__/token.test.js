jest.mock(
  "react-native-redux-toast",
  () => ({
    ToastActionsCreators: {
      displayError: message => ({ type: "@@TOAST/DISPLAY_ERROR", message }),
      displayInfo: message => ({ type: "@@TOAST/DISPLAY_INFO", message })
    }
  }),
  { virtual: true }
);

import base64 from "base-64";
import { addDeviceFromToken } from "../token";

const token = payload => "h." + base64.encode(JSON.stringify(payload)) + ".s";

function run(thunk) {
  const actions = [];
  const result = thunk(action => actions.push(action));
  return { result, actions };
}

describe("addDeviceFromToken", () => {
  it("adds a valid device and confirms", () => {
    const { result, actions } = run(
      addDeviceFromToken(token({ dev: "d", usr: "u", jti: "j" }), [])
    );
    expect(result).toBe(true);
    expect(actions.map(a => a.type)).toEqual([
      "DEVICE_ADD",
      "@@TOAST/DISPLAY_INFO"
    ]);
  });

  it("rejects devices that already exist", () => {
    const { result, actions } = run(
      addDeviceFromToken(token({ dev: "d", usr: "u", jti: "j" }), ["j"])
    );
    expect(result).toBe(false);
    expect(actions).toEqual([
      { type: "@@TOAST/DISPLAY_ERROR", message: "This device already exists" }
    ]);
  });

  it("explains expired tokens", () => {
    const { actions } = run(
      addDeviceFromToken(token({ dev: "d", usr: "u", jti: "j", exp: 1 }), [])
    );
    expect(actions[0].message).toBe("This device token has expired");
  });

  it("rejects garbage", () => {
    const { actions } = run(addDeviceFromToken("hello", []));
    expect(actions[0].message).toBe("This isn't a valid device token");
  });
});
