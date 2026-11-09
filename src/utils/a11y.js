//@flow

// Accessibility props for a tappable element. React Native 0.54 predates
// accessibilityRole, so the role is given per platform: accessibilityTraits
// (iOS VoiceOver) and accessibilityComponentType (Android TalkBack).
export function buttonA11y(label: string, selected?: boolean) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityTraits: selected ? ["button", "selected"] : "button",
    accessibilityComponentType: "button"
  };
}
