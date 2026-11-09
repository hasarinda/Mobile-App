import reducer from "../login";
import {
  setUser,
  setPassword,
  setServer,
  receiveSession,
  receiveSessionFailure,
  logOut
} from "../../actions/login";

const init = reducer(undefined, { type: "@@INIT" });

describe("login reducer", () => {
  it("stores user and server", () => {
    let state = reducer(init, setUser("me"));
    state = reducer(state, setServer("https://my.server"));
    expect(state.user).toBe("me");
    expect(state.server).toBe("https://my.server");
  });

  it("clears the password once a session is received", () => {
    let state = reducer(init, setPassword("secret"));
    expect(state.password).toBe("secret");
    state = reducer(state, receiveSession("access", "refresh"));
    expect(state.password).toBeUndefined();
    expect(state).toMatchObject({
      accessToken: "access",
      refreshToken: "refresh",
      isLogged: true,
      isFetching: false
    });
  });

  it("keeps the password after a failed login so the user can retry", () => {
    let state = reducer(init, setPassword("secret"));
    state = reducer(state, receiveSessionFailure("credentials"));
    expect(state.password).toBe("secret");
    expect(state.isLogged).toBe(false);
  });

  it("resets everything on log out", () => {
    let state = reducer(init, receiveSession("a", "r"));
    expect(reducer(state, logOut())).toEqual(init);
  });
});
