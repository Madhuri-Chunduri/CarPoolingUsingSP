import * as React from "react";
import "../sass/MyRides.sass";
import "../sass/BookRide.sass";
import "office-ui-fabric-react";
import "office-ui-fabric-react/dist/css/fabric.css";
import { User } from "../models/User";
import { Booking } from "../models/Booking";
import { toast } from "react-toastify";
import { Ride } from "../models/Ride";
import RideBookingsComponent from "./RideBookingsComponent";
import { Status } from "../models/Status";
import { DocumentCard } from "office-ui-fabric-react";
import { sp } from "sp-pnp-js";
import { ISPLists } from "../ISPLists";

class MyRidesComponent extends React.Component<any, any> {
  bookedRides: any = [];
  offeredRides: any = [];
  rideBookings = [];
  bookedRidesList: any;
  offeredRidesList: any;
  userNames = [];

  constructor(props) {
    super(props);
    this.state = {
      showRides: false,
      offeredRides: [],
      bookedRides: [],
      showNoBookedRidesMessage: false,
      showNoOfferedRidesMessage: false,
      viewRideBookings: false,
      rideBookings: [],
      userNames: [],
    };
    this.hasBookings = this.hasBookings.bind(this);
    this.getUserName = this.getUserName.bind(this);
    this.getAllPublisherNames = this.getAllPublisherNames.bind(this);
  }

  async componentDidMount() {
    this.getBookedRides();
    this.getRidesList();

    // if (this.state.bookedRides.length > 0) {
    //   this.getUserName();
    // }
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState({ showRides: true });
  }

  //   this.getViewQueryForList("Ride", "RideListView").then(async (res: any) => {
  //     await this.getItemsByViewQuery("Ride", res).then((items) => {
  //       this.setState({ offeredRides: items });
  //     });
  //   });
  //   if (this.state.offeredRides.length == 0) {
  //     this.setState({ showNoOfferedRidesMessage: true });
  //   } else {
  //     this.state.offeredRides.forEach((ride) => {
  //       this.rideBookings.push(this.hasBookings(ride));
  //       console.log(this.rideBookings);
  //     });
  //   }

  //   this.getViewQueryForList("Booking", "BookingListView").then(
  //     async (res: any) => {
  //       await this.getItemsByViewQuery("Booking", res).then((items) => {
  //         this.setState({ bookedRides: items });
  //       });
  //     }
  //   );

  //   if (this.state.bookedRides.length == 0) {
  //     this.bookedRides = [];
  //     this.setState({ showNoBookedRidesMessage: true });
  //   }
  //   this.setState({ showRides: true });
  // }

  public getRidesList(): void {
    let listName = "Ride"; //The display name of the sharepoint list.
    let viewName = "RideListView"; //The View Name
    let rideBookingsList = [];
    MyRidesComponent.getViewQueryForList(listName, viewName)
      .then((res: any) => {
        MyRidesComponent.getItemsByViewQuery(listName, res).then(
          async (items) => {
            items.forEach((item) => {
              rideBookingsList.push(item);
            });
            //this.setState({ offeredRides: rideBookingsList });
            this.hasBookings(rideBookingsList);
            this.setState({ offeredRides: rideBookingsList });
            console.log(
              "Offered Rides : ",
              this.state.offeredRides,
              "Bookings List : ",
              this.rideBookings
            );
          }
        );
      })
      .catch(console.error);
  }

  public getBookedRides() {
    let listName = "Booking"; //The display name of the sharepoint list.
    let viewName = "BookingListView"; //The View Name
    let bookingsList = [];
    MyRidesComponent.getViewQueryForList(listName, viewName).then(
      (res: any) => {
        MyRidesComponent.getItemsByViewQuery(listName, res).then((items) => {
          items.forEach((item) => {
            bookingsList.push(item);
            console.log(item);
          });
          this.getAllPublisherNames(bookingsList);
          this.setState({ bookedRides: bookingsList });
          console.log("Booked rides : ", this.state.bookedRides);
        });
      }
    );
  }

  //First method that retrieves the View Query
  public static getViewQueryForList(listName: string, viewName: string) {
    let listViewData = "";
    if (listName && viewName) {
      return sp.web.lists
        .getByTitle(listName)
        .views.getByTitle(viewName)
        .select("ViewQuery")
        .get()
        .then((v) => {
          return v.ViewQuery;
        });
    } else {
      console.log("Data insufficient!");
      listViewData = "Error";
    }
  }

  //Second method that retrieves the View data based on the View Query and List name
  public static getItemsByViewQuery(listName: string, query: string) {
    const xml = "<View><Query>" + query + "</Query></View>";
    return sp.web.lists
      .getByTitle(listName)
      .getItemsByCAMLQuery({ ViewXml: xml })
      .then((res) => {
        return res;
      });
  }

  getDate(date: string) {
    date = date.substring(0, 10);
    return (
      date.substring(8, 10) +
      "/" +
      date.substring(5, 7) +
      "/" +
      date.substring(0, 4)
    );
  }

  capitalise(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  getFormattedDate = (date): string => {
    // return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear());
    var today = new Date(date);
    var dd = today.getDate().toString();
    var mm = (today.getMonth() + 1).toString();
    var yyyy = today.getFullYear();
    if (parseInt(dd) < 10) {
      dd = "0" + dd.toString();
    }
    if (parseInt(mm) < 10) {
      mm = "0" + mm.toString();
    }
    var hours = today.getHours().toString();
    var minutes = today.getMinutes().toString();
    var seconds = today.getSeconds().toString();

    return (
      yyyy + "-" + mm + "-" + dd + "T" + hours + ":" + minutes + ":" + seconds
    );
  };

  cancelBooking(bookedRideId) {
    var list = sp.web.lists.getByTitle("Booking");
    try {
      list.items
        .getById(bookedRideId)
        .update({
          Status: "Cancelled",
        })
        .then((i) => {
          if (i != undefined) {
            window.location.reload();
          } else toast.error("Sorry!! Unable to cancel booking");
        });
    } catch (error) {
      toast.error("Sorry!! Some problem occured!!");
    }
  }

  updateRideStatus(rideId) {
    var list = sp.web.lists.getByTitle("Ride");
    try {
      list.items
        .getById(rideId)
        .update({
          Status: "Completed",
        })
        .then((i) => {
          if (i != undefined) {
            window.location.reload();
          } else toast.error("Sorry!! Unable to update ride status");
        });
    } catch (error) {
      toast.error("Sorry!! Some problem occured!!");
    }
  }

  cancelRide(rideId) {
    var list = sp.web.lists.getByTitle("Ride");
    try {
      list.items
        .getById(rideId)
        .update({
          Status: "Cancelled",
        })
        .then((i) => {
          if (i != undefined) {
            window.location.reload();
          } else toast.error("Sorry!! Unable to update ride status");
        });
    } catch (error) {
      toast.error("Sorry!! Some problem occured!!");
    }
  }

  viewBookings(rideId: string) {
    this.setState({ selectedRideId: rideId, viewRideBookings: true });
  }

  getProfileName(name) {
    var words = name.toUpperCase().split(" ");
    if (words.length == 1) return words[0][0];
    if (words.length > 1 && words[1][0] == undefined) return words[0][0];
    else return words[0][0] + words[1][0];
  }

  async getUserId(booking) {
    return await sp.web.lists
      .getByTitle("Ride")
      .items.getById(booking.RideIdId)
      .get()
      .then((ride) => {
        return ride.AuthorId;
      });
  }

  getUserName(bookings) {
    var index = 0;
    console.log("From UserNames state: ", this.state.bookedRides);
    console.log("From GetUserName : ", bookings);
    return bookings.forEach(async (booking) => {
      var userId = await this.getUserId(booking);
      var userName: any;
      await sp.web
        .getUserById(userId)
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
      bookedRides: bookings,
      showRides: true,
      userNames: this.userNames,
    });
  }

  async hasBookings(offeredRides) {
    offeredRides.forEach(async (ride) => {
      var queryString: string = "RideId eq " + ride.Id;
      await sp.web.lists
        .getByTitle("Booking")
        .items.filter(queryString)
        .get()
        .then((result) => {
          if (result.length > 0) {
            this.rideBookings.push(true);
          } else this.rideBookings.push(false);
        });
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState({ rideBookings: this.rideBookings });
  }

  render() {
    var date = new Date();
    var today = this.getFormattedDate(date);
    console.log("Updated");
    console.log("UserNames array : ", this.state.userNames);
    console.log("Usernames[0] : ", this.state.userNames[0]);
    console.log("Usernames[1] : ", this.state.userNames[1]);
    console.log("Usernames[2] : ", this.state.userNames[2]);
    console.log("Usernames[3] : ", this.state.userNames[3]);
    console.log("Usernames[4] : ", this.userNames[4]);

    // console.log("Booked rides array : ", this.state.bookedRides);
    if (this.state.showRides) {
      this.bookedRidesList = this.state.bookedRides.map((bookedRide, index) => (
        <div className="rideCard">
          <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                {this.state.userNames.length > 0 ? (
                  <div className="ridePublisherName">
                    {this.userNames[index]}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                {this.state.userNames.length > 0 ? (
                  <div className="ridePublisherImage">
                    {this.getProfileName(this.userNames[index])}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">From</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">To</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{bookedRide.PickUp}</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{bookedRide.Drop}</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Date</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Time</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">
                  {this.getDate(bookedRide.BookingTime)}
                </p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">
                  {bookedRide.BookingTime.substring(11, 16)}
                </p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Price </p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Status </p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{bookedRide.Price}</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{bookedRide.Status}</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              {bookedRide.BookingTime >= today &&
              bookedRide.Status != "Cancelled" &&
              bookedRide.Status != "Rejected" ? (
                <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                  <input
                    type="button"
                    onClick={() => this.cancelBooking(bookedRide.Id)}
                    className="violetButton"
                    value="Cancel Booking"
                  ></input>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ));

      this.offeredRidesList = this.state.offeredRides.map((ride, index) => (
        <div className="rideCard offeredRideCard">
          <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">From</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">To</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{this.capitalise(ride.PickUp)}</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{this.capitalise(ride.Drop)}</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Date</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Time</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{this.getDate(ride.StartDate)}</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">
                  {ride.StartDate.substring(11, 16)}
                </p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Price</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="cardLabel">Status</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{ride.Price}</p>
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6">
                <p className="rideDetails">{ride.Status}</p>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl12">
                {this.rideBookings[index] ? (
                  <input
                    type="button"
                    onClick={() => this.viewBookings(ride.Id)}
                    className="offeredRideButton"
                    value="View Bookings"
                  ></input>
                ) : (
                  <div className="rideDetails">
                    {" "}
                    There are no bookings yet! {this.rideBookings[index]}
                  </div>
                )}
                {ride.Status == "Not Started" && ride.StartDate < today ? (
                  <span className="rowElement">
                    <input
                      type="button"
                      onClick={() => this.updateRideStatus(ride.Id)}
                      className="makeRideFinishedButton offeredRideButton"
                      value="Finish Ride"
                    ></input>
                  </span>
                ) : (
                  ""
                )}
                {ride.Status == "Not Started" && ride.StartDate > today ? (
                  <span className="rowElement">
                    <input
                      type="button"
                      onClick={() => this.cancelRide(ride.Id)}
                      className="offeredRideButton"
                      value="Cancel Ride"
                    ></input>
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      ));
    }

    return !this.state.viewRideBookings ? (
      <div className="myRidesBody">
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 ms-xl6">
              <div className="bookedRides">
                <div className="bookedRidesHeading">Booked Rides</div>
                <div className="ms-Grid bookedRidesList" dir="ltr">
                  <div className="ms-Grid-row bookedRidesList">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 bookedRidesList">
                      {this.state.showNoBookedRidesMessage ? (
                        <div className="noRides noBookedRides">
                          You have no booked rides!!
                        </div>
                      ) : (
                        <div className="bookedRides">
                          {this.bookedRidesList}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 ms-xl6">
              <div className="offeredRides">
                <div className="offeredRidesHeading">Offered Rides</div>
                <div className="ms-Grid offeredRidesList" dir="ltr">
                  <div className="ms-Grid-row offeredRidesList">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 offeredRidesList">
                      {this.state.showNoOfferedRidesMessage ? (
                        <div className="noRides">
                          You have no offered rides!!
                        </div>
                      ) : (
                        <div>{this.offeredRidesList}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <RideBookingsComponent rideId={this.state.selectedRideId} />
    );
  }
}

export default MyRidesComponent;
