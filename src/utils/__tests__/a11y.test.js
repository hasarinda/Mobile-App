import { buttonA11y } from "../a11y";

describe("buttonA11y", () => {
  it("marks the element as an accessible button on both platforms", () => {
    expect(buttonA11y("Log out")).toEqual({
      accessible: true,
      accessibilityLabel: "Log out",
      accessibilityTraits: "button",
      accessibilityComponentType: "button"
    });
  });

  it("announces the selected state", () => {
    expect(buttonA11y("temp", true).accessibilityTraits).toEqual([
      "button",
      "selected"
    ]);
  });
});
