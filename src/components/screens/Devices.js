//@flow

import { connect } from "react-redux";
import { t } from "../../i18n";
import {
  FlatList,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Clipboard
} from "react-native";
import DeviceComponent from "../devices/DeviceComponent";
import React from "react";
import { MARGIN } from "../../constants/ThingerStyles";
import Screen from "../containers/Screen";
import { navigate } from "../../actions/nav";
import { getResourcesFromApi } from "../../actions/fetch";
import { selectDevice } from "../../actions/device";
import { addDeviceFromToken } from "../../actions/token";
import { removeAllResources } from "../../actions/resource";
import type { Dispatch } from "../../types/Dispatch";
import NavigationBar from "../navigation/NavigationBar";
import type { Device } from "../../types/Device";
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import ID from "../../constants/GoogleAnalytics";
import H1Text from "../texts/H1";
import H2Text from "../texts/H2";
import { DARK_BLUE } from "../../constants/ThingerColors";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  ids: Array<string>,
  devices: Array<Device>,
  onDeviceClick: (device: Device) => Dispatch,
  onQRScannerPress: () => Dispatch,
  onToken: (token: string, devices: Array<string>) => any,
  onSettingsPress: () => Dispatch,
  isUserDevices: boolean,
  isFetching: boolean
};

class DevicesScreen extends React.Component<Props> {
  constructor(props) {
    super(props);
    new GoogleAnalyticsTracker(ID).trackScreenView("Main");
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  onClipboardButtonPress = async () => {
    const { ids, onToken } = this.props;
    onToken(await Clipboard.getString(), ids);
  };

  renderContent() {
    const {
      devices,
      onDeviceClick,
      isUserDevices,
      onQRScannerPress
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {devices.length ? (
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <DeviceComponent
                name={item.name ? item.name : item.dev}
                user={item.usr}
                onClick={() => onDeviceClick(item)}
              />
            )}
            ItemSeparatorComponent={this.renderSeparator}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/no_devices.png")}
              style={{ height: 100, width: 100, margin: MARGIN * 2 }}
            />
            <H1Text>{t("devices.emptyTitle")}</H1Text>
            <H2Text>{t("devices.emptySubtitle")}</H2Text>
          </View>
        )}

        {!isUserDevices && (
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            accessible={true}
            accessibilityLabel={t("a11y.addDevice")}
          >
            <ActionButton.Item
              buttonColor="#9b59b6"
              title={t("devices.addFromClipboard")}
              onPress={this.onClipboardButtonPress}
            >
              <Icon name="content-paste" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#1abc9c"
              title={t("devices.addFromQR")}
              onPress={onQRScannerPress}
            >
              <Icon name="photo-camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        )}
      </View>
    );
  }

  render() {
    const { isFetching, isUserDevices, onSettingsPress } = this.props;

    return (
      <Screen
        navigationBar={
          <NavigationBar
            title={"thinger.io"}
            main={true}
            button={
              isUserDevices
                ? {
                    icon: "cog",
                    label: t("title.settings"),
                    onPress: onSettingsPress
                  }
                : undefined
            }
          />
        }
      >
        {isFetching ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color={DARK_BLUE} />
          </View>
        ) : (
          this.renderContent()
        )}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 22,
    height: 22,
    color: "white"
  }
});

const mapStateToProps = state => {
  const { routes: tabs, index: selectedTab } = state.nav.routes[0];
  const currentTab = tabs[selectedTab].routeName;
  const isUserDevices: boolean = currentTab === "UserDevices";

  return {
    ids: Object.keys(state.devices),
    devices: isUserDevices
      ? (Object.values(state.devices): any).filter(device =>
          state.userDevices.includes(device.id)
        )
      : (Object.values(state.devices): any).filter(
          device => !state.userDevices.includes(device.id)
        ),
    isUserDevices,
    isFetching: state.login.isFetching
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeviceClick: device => {
      dispatch(removeAllResources());
      dispatch(selectDevice(device.id));
      dispatch(getResourcesFromApi(device));
      dispatch(navigate("Device"));
    },
    onSettingsPress: () => dispatch(navigate("Settings")),
    onQRScannerPress: () => dispatch(navigate("Scanner")),
    onToken: (token: string, devices: Array<string>) =>
      dispatch(addDeviceFromToken(token, devices))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesScreen);
