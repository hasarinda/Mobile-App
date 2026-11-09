//@flow

import React from "react";
import { t } from "../../i18n";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { PADDING } from "../../constants/ThingerStyles";
import Screen from "../containers/Screen";
import { goBack } from "../../actions/nav";
import { addDeviceFromToken } from "../../actions/token";
import NavigationBar from "../navigation/NavigationBar";
import { RNCamera } from "react-native-camera";
import { DARK_BLUE } from "../../constants/ThingerColors";

type Props = {
  devices: Array<string>,
  onToken: (token: string, devices: Array<string>) => any
};

type State = {
  scanning: boolean
};

class QRScanner extends React.Component<Props, State> {
  state = {
    scanning: false
  };

  handleOnBarCodeRead(data: { data: string }) {
    const { devices, onToken } = this.props;
    this.setState({ scanning: true });
    onToken(data.data, devices);
    // Debounce: the camera reports the same code many times per second.
    setTimeout(() => this.setState({ scanning: false }), 1000);
  }

  renderCamera() {
    return (
      <RNCamera
        style={{
          flex: 1,
          backgroundColor: "transparent"
        }}
        type={RNCamera.Constants.Type.back}
        permissionDialogTitle={t("qr.permissionTitle")}
        permissionDialogMessage={t("qr.permissionMessage")}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        onBarCodeRead={data => {
          if (!this.state.scanning) this.handleOnBarCodeRead(data);
        }}
      />
    );
  }

  render() {
    return (
      <Screen navigationBar={<NavigationBar title={t("title.qrScanner")} />}>
        {this.renderCamera()}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: PADDING,
            backgroundColor: DARK_BLUE
          }}
        >
          <Text style={{ color: "white" }}>{t("qr.hint")}</Text>
        </View>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  return {
    devices: Object.keys(state.devices)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onToken: async (token: string, devices: Array<string>) => {
      const added = await dispatch(addDeviceFromToken(token, devices));
      if (added) dispatch(goBack());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QRScanner);
