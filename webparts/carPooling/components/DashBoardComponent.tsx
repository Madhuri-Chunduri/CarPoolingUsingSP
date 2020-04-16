import * as React from "react";
import "../sass/DashBoard.sass";
import OfferRideComponent from "./OfferRideComponent";
import BookRideComponent from "./BookRideComponent";
import AddRideComponent from "./AddRideComponent";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

class DashBoardComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showBookRidePage: false,
      showOfferRidePage: false,
      showDashBoard: true,
    };
    this.showBookRidePage = this.showBookRidePage.bind(this);
    this.showOfferRidePage = this.showOfferRidePage.bind(this);
    this.getFirstName = this.getFirstName.bind(this);
  }

  getFirstName(name) {
    var words = name.split(" ");
    return words[0];
  }

  showBookRidePage() {
    this.setState({
      showBookRidePage: true,
      showOfferRidePage: false,
      showDashBoard: false,
    });
  }

  showOfferRidePage() {
    this.setState({
      showOfferRidePage: true,
      showBookRidePage: false,
      showDashBoard: false,
    });
  }

  render() {
    var retrievedObject = localStorage.getItem("currentUser");
    var currentUserName = JSON.parse(retrievedObject);
    //let user = sp.web.currentUser;
    return this.state.showDashBoard ? (
      <div className="dashBoardBody">
        <div className="greeting">
          <p>Hey {this.getFirstName(currentUserName.Title)}!</p>
        </div>
        <div className="dashBoardActions">
          {/* <div className="ms-Grid heightStyle" dir="ltr">
                        <div className="ms-Grid-row heightStyle">
                            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 ms-xl6 heightStyle"> */}

          <input
            className="bookRideButton"
            onClick={this.showBookRidePage}
            type="button"
            value="Book a ride"
          />

          <input
            className="offerRideButton"
            onClick={this.showOfferRidePage}
            type="button"
            value="Offer a ride"
          />
        </div>
      </div>
    ) : (
      <div>
        {this.state.showOfferRidePage ? <AddRideComponent /> : ""}
        {this.state.showBookRidePage ? <BookRideComponent /> : ""}
      </div>
    );
  }
}

export default DashBoardComponent;
