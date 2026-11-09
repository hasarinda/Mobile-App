//@flow

import { connect } from "react-redux";
import { t } from "../../i18n";
import React from "react";
import { MARGIN } from "../../constants/ThingerStyles";
import RoundedButton from "../buttons/RoundedButton";
import CenterView from "../containers/CenterView";
import Screen from "../containers/Screen";
import List from "../lists/List";
import OutputItem from "../lists/OutputItem";
import { ScrollView } from "react-native";
import NavigationBar from "../navigation/NavigationBar";
import type { LoginState } from "../../types/State";
import { logOut } from "../../actions/login";
import type { Dispatch } from "../../types/Dispatch";
import { goBack } from "../../actions/nav";
import { LIGHT_RED } from "../../constants/ThingerColors";

type Props = {
  login: LoginState,
  onLogOut: () => Dispatch
};

class UserSettings extends React.Component<Props> {
  render() {
    const { login, onLogOut } = this.props;
    return (
      <Screen navigationBar={<NavigationBar title={t("title.settings")} />}>
        {login && (
          <ScrollView>
            <List>
              <OutputItem
                name={t("settings.user")}
                value={login.user != null ? login.user : ""}
              />
              <OutputItem
                name={t("settings.server")}
                value={login.server != null ? login.server : ""}
              />
            </List>

            <CenterView style={{ margin: MARGIN }}>
              <RoundedButton
                color={LIGHT_RED}
                text={t("settings.logout")}
                onPress={() => onLogOut()}
              />
            </CenterView>
          </ScrollView>
        )}
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.login
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogOut: () => {
      dispatch(logOut());
      return dispatch(goBack());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
