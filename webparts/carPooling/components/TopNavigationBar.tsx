import * as React from "react";
import "../sass/TopNavigationBar.sass";
import MyRidesComponent from "./MyRidesComponent";
import DashBoardComponent from "./DashBoardComponent";
import LoginComponent from "./LoginComponent";

class TopNavigationBar extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showUserActions: true,
      selectedAction: "",
      showDashBoard: true,
      showMyRides: false,
      showLogin: false,
      showTopNavigationBar: true,
    };
    this.showUserActions = this.showUserActions.bind(this);
    this.dashBoardAction = this.dashBoardAction.bind(this);
    this.myRidesAction = this.myRidesAction.bind(this);
    this.logout = this.logout.bind(this);
  }

  showUserActions() {
    this.setState({ showUserActions: !this.state.showUserActions });
  }

  selectedAction(action: string) {
    this.setState({ selectedAction: action, showUserActions: false });
  }

  getFirstName(name) {
    var words = name.split(" ");
    return words[0];
  }

  getProfileName(name) {
    var words = name.split(" ");
    if (words.length == 1) return words[0][0];
    else if (words[1][0] != undefined) return words[0][0] + words[1][0];
    else return words[0][0];
  }

  dashBoardAction() {
    this.setState({
      showDashBoard: true,
      showMyRides: false,
      showLogin: false,
      showTopNavigationBar: true,
    });
  }

  myRidesAction() {
    this.setState({
      showMyRides: true,
      showDashBoard: false,
      showLogin: false,
      showTopNavigationBar: true,
    });
  }

  logout() {
    this.setState({
      showMyRides: false,
      showDashBoard: false,
      showLogin: true,
      showTopNavigationBar: false,
    });
  }

  render() {
    var retrievedUser = localStorage.getItem("currentUser");
    var activeUser = JSON.parse(retrievedUser);
    return this.state.showTopNavigationBar ? (
      <div className="ms-Grid topNavigationBar" dir="ltr">
        <div className="ms-Grid-row">
          <ul>
            <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg1 ms-xl1 logoIcon">
              <li>
                <img src={require("../images/logo.png")} alt="logo-icon" />
              </li>
            </div>
            <div className="ms-Grid-col ms-sm10 ms-md10 ms-lg11 ms-xl11">
              <li className="activeUser">
                <p className="activeUserName">
                  {this.getFirstName(activeUser.Title)}
                </p>
                <input
                  className="activeUserImage"
                  type="button"
                  value={this.getProfileName(activeUser.Title)}
                />
                <div className="actionsPopUp">
                  <input
                    className="popUpButton"
                    type="button"
                    onClick={this.dashBoardAction}
                    value="DashBoard"
                  />
                  <input
                    className="popUpButton"
                    type="button"
                    onClick={this.myRidesAction}
                    value="My Rides"
                  />
                  {/* <input
                    className="popUpButton"
                    type="button"
                    onClick={this.logout}
                    value="Log Out"
                  /> */}
                </div>
              </li>
            </div>
          </ul>
        </div>
        {this.state.showDashBoard ? <DashBoardComponent /> : ""}
        {this.state.showMyRides ? <MyRidesComponent /> : ""}
      </div>
    ) : this.state.showLogin ? (
      <LoginComponent />
    ) : (
      ""
    );
  }
}

export default TopNavigationBar;
