import * as React from "react";
import "../sass/Login.sass";
import "../sass/SignUp.sass";
import "office-ui-fabric-react/dist/css/fabric.css";
import { initializeIcons } from "@uifabric/icons";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import DashBoardComponent from "./DashBoardComponent";
import MyRidesComponent from "./MyRidesComponent";

initializeIcons();
class LoginComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showEmailField: false,
      showPasswordField: false,
      showPassword: false,
      showLogin: true,
      showSignUp: false,
      showDashBoard: false,
      errors: {
        email: "*",
        password: "*",
      },
      email: "",
      password: "",
      validationMessage: "",
    };
    this.readEmail = this.readEmail.bind(this);
    this.readPassword = this.readPassword.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
  }

  readEmail() {
    this.setState({ showEmailField: true });
  }

  readPassword() {
    this.setState({ showPasswordField: true });
  }

  showPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  handleChange(event) {
    const target = event.target;
    const fieldName = target.name;
    this.setState({ [fieldName]: event.target.value });
    this.validateField(fieldName, event.target.value);
  }

  validateField(fieldName: string, fieldValue: string) {
    const name = fieldName,
      value = fieldValue;
    let errors = this.state.errors;

    switch (name) {
      case "email":
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/;
        errors.email = regex.test(value) ? "" : "* Email is not valid";
        break;

      case "password":
        if (value.length == 0) errors.password = "Password cannot be empty";
        else errors.password = "";

      default:
        break;
    }
    this.setState({ errors, [name]: value });
  }

  validateForm() {
    let count = 0;
    let errors = this.state.errors;

    Object.keys(errors).forEach((key: any) => {
      if (errors[key].length > 0) count += 1;
    });

    if (count > 0) {
      this.setState({
        validationMessage: "* Please fill the below fields with valid data",
        errors: errors,
      });
      return false;
    } else this.setState({ validationMessage: "", errors: errors });
    return true;
  }

  submitForm() {
    if (this.validateForm()) {
      this.setState({
        showDashBoard: true,
        showLogin: false,
        showSignUp: false,
      });
      //   const url = "user/GetUserByMail/" + this.state.email;
      //   GetData(url).then((data) => {
      //     if (data == "") {
      //       this.setState({
      //         validationMessage: "Sorry!! You don't have an account with us..",
      //       });
      //     } else if (this.state.password == data.password) {
      //       var activeUser = new User(
      //         data.id,
      //         data.name,
      //         data.email,
      //         data.phoneNumber,
      //         this.state.password,
      //         data.address
      //       );
      //       // const setCurrentUser = this.props.setCurrentUser;
      //       // this.props.history.push("/dashBoard");
      //       setCurrentUser(activeUser);
      //       // localStorage.setItem('activeUser',JSON.stringify(activeUser));
      //       this.props.history.push("/dashBoard");
      //     } else
      //       this.setState({
      //         validationMessage:
      //           "Invalid Credentials!! Please enter valid credentials",
      //       });
      // });
    }
  }

  showSignUp(event) {
    event.preventDefault();
    this.setState({ showLogin: false, showSignUp: true, showDashBoard: false });
  }

  render() {
    let errors = this.state.errors;

    return this.state.showLogin ? (
      <div className="loginBody">
        <div className="ms-Grid-row heightStyle">
          <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg8 ms-xl8 leftContent">
            <img src={require("../images/logo.png")} alt="logo"></img>
            <div className="tagLine">
              <span className="grayText">turn</span>
              <span className="orangeText">miles</span>
              <div>
                <span className="grayText">into</span>
                <span className="violetText">money</span>
              </div>
            </div>
            <div className="grayText subTag">Rides on tap</div>
          </div>
          <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg4 ms-xl4 logInForm">
            <div className="logInHeading">Log In</div>
            {this.state.validationMessage.length > 0 ? (
              <div className="logInValidationMessage">
                {this.state.validationMessage}
              </div>
            ) : (
              ""
            )}
            {this.state.showEmailField ? (
              <div className="inputTextField">
                <p className="textFieldName">
                  Enter Email Id
                  {errors.email.length > 0 ? (
                    <span className="error">{errors.email}</span>
                  ) : (
                    ""
                  )}
                </p>
                <div>
                  <input
                    type="text"
                    name="email"
                    onChange={this.handleChange}
                    className="textField"
                    value={this.state.email}
                  />
                </div>
              </div>
            ) : (
              <input
                type="text"
                className="inputTextField"
                onFocus={this.readEmail}
                placeholder="Enter Email Id *"
              />
            )}
            {this.state.showPasswordField ? (
              <div className="inputTextField">
                <p className="textFieldName">
                  Enter Password
                  {errors.password.length > 0 ? (
                    <span className="error">{errors.password}</span>
                  ) : (
                    ""
                  )}
                </p>
                <div className="passwordField">
                  <input
                    type={this.state.showPassword ? "text" : "password"}
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    className="textField"
                  />
                  <button className="hideIcon" onClick={this.showPassword}>
                    <Icon
                      iconName={this.state.showPassword ? "Hide" : "RedEye"}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="text"
                className="inputTextField"
                onFocus={this.readPassword}
                placeholder="Enter Password *"
              />
            )}
            <input
              type="button"
              onClick={this.submitForm}
              className="logInButton"
              value="Submit"
            />
            <div className="redirect">
              <p> Not a member yet? </p>
              <a onClick={this.showSignUp}>
                <u>SIGN UP</u>
              </a>
            </div>
          </div>
        </div>
      </div>
    ) : this.state.showSignUp ? (
      <MyRidesComponent />
    ) : this.state.showDashBoard ? (
      <DashBoardComponent />
    ) : (
      ""
    );
  }
}

export default LoginComponent;
