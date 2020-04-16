import * as React from "react";
import "../sass/RideBookings.sass";
import { toast } from "react-toastify";
import { sp } from "sp-pnp-js";
import MyRidesComponent from "./MyRidesComponent";

class RideBookingsComponent extends React.Component<any, any> {
  userNames = [];

  constructor(props) {
    super(props);
    this.state = {
      showNoBookingsMessage: false,
      rideBookings: [],
      reload: false,
      showMyRides: false,
      userNames: [],
    };
    this.showMyRidesPage = this.showMyRidesPage.bind(this);
    this.getRideBookings = this.getRideBookings.bind(this);
    // this.hideBookings = this.hideBookings.bind(this);
    // this.getBookings = this.getBookings.bind(this);
  }

  componentDidMount() {
    this.getRideBookings(this.props.rideId);
  }

  async getRideBookings(rideId) {
    console.log("Ride Id : ", rideId);
    var queryString: string = "RideId eq " + rideId;
    var bookings = await sp.web.lists
      .getByTitle("Booking")
      .items.filter(queryString)
      .get()
      .then((result) => {
        this.getAllPublisherNames(result);
        return result;
      });
    if (bookings.length == 0) {
      this.setState({ showNoBookingsMessage: true });
    } else {
      this.setState({ rideBookings: bookings, showNoBookingsMessage: false });
    }
  }

  approveBooking(bookingId) {
    var list = sp.web.lists.getByTitle("Booking");
    try {
      list.items
        .getById(bookingId)
        .update({
          Status: "Approved",
        })
        .then((i) => {
          if (i != undefined) {
            window.location.reload();
          } else toast.error("Sorry!! Unable to approve booking");
        });
    } catch (error) {
      toast.error("Sorry!! Some problem occured!!");
    }
  }

  rejectBooking(bookingId) {
    var list = sp.web.lists.getByTitle("Booking");
    try {
      list.items
        .getById(bookingId)
        .update({
          Status: "Rejected",
        })
        .then((i) => {
          if (i != undefined) {
            window.location.reload();
          } else toast.error("Sorry!! Unable to reject booking");
        });
    } catch (error) {
      toast.error("Sorry!! Some problem occured!!");
    }
  }

  getProfileName(name) {
    var words = name.split(" ");
    if (words.length == 1 || words[1][0] == undefined) return words[0][0];
    else return words[0][0] + words[1][0];
  }

  showMyRidesPage() {
    this.setState({ showMyRides: true });
  }

  getUserName(bookings) {
    var index = 0;
    console.log("From UserNames state: ", this.state.bookedRides);
    console.log("From GetUserName : ", bookings);
    return bookings.forEach(async (booking) => {
      var userName: any;
      await sp.web
        .getUserById(booking.AuthorId)
        .get()
        .then((user) => {
          userName = user.Title;
        });
      this.userNames[index] = userName;
      index += 1;
    });
  }

  async getAllPublisherNames(bookings) {
    await this.getUserName(bookings);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState({
      userNames: this.userNames,
    });
  }

  render() {
    // var rideBookings = this.getBookings(this.props.match.params.rideId);
    console.log("Bookings state : ", this.state.rideBookings);
    var bookingsList = this.state.rideBookings.map((booking, index) => (
      <div className="bookingCard">
        <div className="cardRow">
          <div className="ridePublisherName">
            {this.state.userNames.length > 0 ? (
              <div className="ridePublisherName">{this.userNames[index]}</div>
            ) : (
              ""
            )}{" "}
          </div>
          <div className="publisherImage">
            {this.state.userNames.length > 0 ? (
              <div className="ridePublisherName">
                {this.getProfileName(this.userNames[index])}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            <p className="cardLabel">From</p>
          </span>
          <span className="rowElement">
            <p className="cardLabel">To</p>
          </span>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            <p className="rideDetails">{booking.PickUp}</p>
          </span>
          <span className="rowElement">
            <p className="rideDetails">{booking.Drop}</p>
          </span>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            <p className="cardLabel">Number Of Seats </p>
          </span>
          <span className="rowElement">
            <p className="cardLabel">Status </p>
          </span>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            <p className="rideDetails">{booking.Numberofseatsbooked}</p>
          </span>
          <span className="rowElement">
            <p className="rideDetails">{booking.Status}</p>
          </span>
        </div>
        <div className="cardRow">
          {booking.Status == "Pending" ? (
            <div className="bookingActions">
              <input
                type="button"
                className="actionButton"
                onClick={() => this.approveBooking(booking.Id)}
                value="Approve"
              />
              <input
                type="button"
                className="actionButton"
                onClick={() => this.rejectBooking(booking.Id)}
                value="Reject"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    ));

    return this.state.showMyRides == false ? (
      <div className="rideBookingsBody">
        <div className="bookingsHeading">
          <input
            className="bookingsHeading"
            type="button"
            onClick={this.showMyRidesPage}
            value="Go Back to My Rides"
          />
        </div>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md4 ms-lg4 ms-xl4 rideBookings">
              {this.state.showNoBookingsMessage ? (
                <div className="showNoRidesMessage">
                  <div className="message">
                    There are no bookings for this ride
                  </div>
                </div>
              ) : (
                <div className="bookingsList">{bookingsList}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <MyRidesComponent />
    );
  }
}

export default RideBookingsComponent;
