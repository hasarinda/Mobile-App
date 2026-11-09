//@flow

import React from "react";
import { buttonA11y } from "../utils/a11y";
import { t } from "../i18n";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type Props = {
  id: string,
  value: string | number | boolean,
  color: string,
  selected: boolean,
  locked: boolean,
  onClick: (id: string) => any
};

export default class Label extends React.Component<Props> {
  renderView() {
    const { id, value, color, selected, locked } = this.props;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15
        }}
      >
        <Icon
          name={!locked ? (selected ? "check-circle" : "circle-o") : "ban"}
          size={25}
          style={{
            color: locked ? "gray" : color
          }}
        />

        <View style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 20, color: locked ? "gray" : color }}>
            {id}
          </Text>
          <Text style={{ fontSize: 12, color: locked ? "gray" : color }}>
            {value.toString()}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { id, value, selected, locked, onClick } = this.props;

    return !locked ? (
      <TouchableOpacity
        onPress={() => onClick(id)}
        {...buttonA11y(
          t("a11y.series", { name: id, value: String(value) }),
          selected
        )}
      >
        {this.renderView()}
      </TouchableOpacity>
    ) : (
      <View
        accessible={true}
        accessibilityLabel={t("a11y.locked", {
          name: id,
          value: String(value)
        })}
      >
        {this.renderView()}
      </View>
    );
  }
}
