//@flow

import React from "react";
import { buttonA11y } from "../../utils/a11y";
import { t } from "../../i18n";
import { TouchableOpacity } from "react-native";
import AttributeView from "./Attribute";
import { DARK_BLUE } from "../../constants/ThingerColors";
import Icon from "react-native-vector-icons/FontAwesome";

type Props = {
  id: string,
  isSimple?: boolean,
  onRun: () => any
};

export default class RunAttribute extends React.Component<Props> {
  renderValue() {
    const { id, onRun } = this.props;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "flex-end",
          marginRight: 15
        }}
        onPress={onRun}
        {...buttonA11y(t("resource.run", { resource: id }))}
      >
        <Icon name="paper-plane" size={22} style={{ color: DARK_BLUE }} />
      </TouchableOpacity>
    );
  }

  render() {
    const { id, isSimple } = this.props;

    return (
      <AttributeView id={id} isSimple={isSimple}>
        {this.renderValue()}
      </AttributeView>
    );
  }
}
