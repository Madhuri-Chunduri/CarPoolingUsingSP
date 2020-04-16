import * as React from "react";
import "../sass/BookRide.sass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "office-ui-fabric-react/dist/css/fabric.css";
import { DatePicker } from "office-ui-fabric-react";
import { initializeIcons } from "@uifabric/icons";
import { sp } from "sp-pnp-js";
import * as moment from "moment";
import { ViaPoint } from "../models/ViaPoint";

initializeIcons();
toast.configure({ hideProgressBar: true });
class BookRideComponent extends React.Component<any, any> {
  timeSlots = [
    "5am-9am",
    "9am-12pm",
    "12pm-3pm",
    "3pm-6pm",
    "6pm-9pm",
    "Entire Day",
  ];
  currentDate: string;
  container: any;
  availableRides: any = [];
  rideTime: string;
  userNames = [];

  constructor(props: any) {
    super(props);
    this.state = {
      errors: { from: "*", to: "*", seats: "*", timeSlot: "*" },
      showAvailableRides: false,
      showNoRidesMessage: false,
      selectedTimeSlot: -1,
      from: "",
      to: "",
      date: new Date(),
      seats: 0,
      timeSlot: "",
      validationMessage: "",
      availableRides: [],
      userNames: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.onFormatDate = this.onFormatDate.bind(this);
    this.submitDetails = this.submitDetails.bind(this);
    this.showBookingStatus = this.showBookingStatus.bind(this);
    this.confirmBooking = this.confirmBooking.bind(this);
    this.setAvailableRides = this.setAvailableRides.bind(this);
    this.availableSeats = this.availableSeats.bind(this);
    this.GetBookingsCount = this.GetBookingsCount.bind(this);
    this.showRides = this.showRides.bind(this);
  }

  handleChange = (event) => {
    const target = event.target;
    const fieldName = target.name;
    let errors = this.state.errors;

    this.setState({ [fieldName]: event.target.value });
    if (fieldName == "seats") {
      if (isNaN(event.target.value)) {
        errors.seats = "Please enter valid seat count";
      } else if (event.target.value > 3) {
        errors.seats = "Seats cannot be greater than 3";
      } else if (event.target.value <= 0)
        errors.seats = "Seats cannot be empty";
      else errors.seats = "";
    }
    this.validateField(fieldName, event.target.value);
    this.setState({ errors: errors });
  };

  validateField(fieldName: string, fieldValue: string) {
    let errors = this.state.errors;

    switch (fieldName) {
      case "from":
        if (fieldValue.length < 0) {
          errors.from = "From cannot be empty";
        } else {
          var regex = /^([a-zA-Z ]{2})+([a-zA-Z ])*$/;
          errors.from = regex.test(fieldValue)
            ? ""
            : "Please enter a valid From";
        }
        break;

      case "to":
        if (fieldValue.length < 0) {
          errors.to = "To cannot be empty";
        } else {
          var regex = /^([a-zA-Z ]{2})+([a-zA-Z ])*$/;
          errors.to = regex.test(fieldValue) ? "" : "Please enter a valid To";
        }
        break;

      case "date":
        if (fieldValue.length < 0) {
          errors.date = "Date cannot be empty";
        } else errors.date = "";
        break;
    }
    this.setState({ errors: errors });
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
    }

    if (this.state.selectedTimeSlot == -1) {
      errors.timeSlot = "Please select a time slot";
    } else this.setState({ validationMessage: "", errors: errors });

    this.availableRides = [];
    return true;
  }

  async submitDetails() {
    this.availableRides = [];
    this.setState({ availableRides: [] });
    await this.showRides();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.getAllPublisherNames();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(
      "Available Rides : ",
      this.availableRides,
      " Publisher Names : ",
      this.userNames
    );
    //this.setState({ availableRides: this.availableRides });
    if (this.availableRides.length == 0) {
      console.log(this.availableRides);
      this.setState({ showNoRidesMessage: true, showAvailableRides: false });
    } else {
      console.log(this.availableRides);
      this.setState({ showAvailableRides: true, showNoRidesMessage: false });
    }
  }

  async showRides() {
    if (this.validateForm()) {
      let rides = await sp.web.lists
        .getByTitle("Ride")
        .items.get()
        .then((rides) => {
          console.log("Rides : ", rides);
          return rides;
        });

      await rides.forEach(async (ride: any) => {
        if (ride.PickUp == this.state.from && ride.Drop == this.state.to) {
          this.setAvailableRides(ride);
        } else {
          let viaPointqueryString = "RideId eq " + ride.Id;
          let viaPointlist = await sp.web.lists
            .getByTitle("ViaPoint")
            .items.filter(viaPointqueryString)
            .get()
            .then((result) => {
              return result;
            });

          if (ride.PickUp == this.state.from) {
            viaPointlist.forEach(async (viaPoint) => {
              if (viaPoint.StopName == this.state.to) {
                await this.setAvailableRides(ride);
              }
            });
          } else if (ride.Drop == this.state.to) {
            viaPointlist.forEach(async (viaPoint) => {
              if (viaPoint.StopName == this.state.from) {
                await this.setAvailableRides(ride);
              }
            });
          }
        }
      });
    }
  }

  async setAvailableRides(ride) {
    var retrievedUser = localStorage.getItem("currentUser");
    var activeUser = JSON.parse(retrievedUser);
    var seatsAvailable = await this.availableSeats(ride);
    console.log("Available seats : ", seatsAvailable);

    if (seatsAvailable >= this.state.seats) {
      if (ride.PublisherId != activeUser.Id) {
        if (this.state.selectedTimeSlot == 5) {
          this.availableRides.push(ride);
        } else {
          var startDate = new Date(ride.StartDate);
          if (
            moment(startDate).format("YYYY-MM-DD") ==
            moment(this.state.date).format("YYYY-MM-DD")
          ) {
            var time = ride.startDate.substring(11, 16);
            var timeSlot = this.timeSlots[this.state.selectedTimeSlot];
            if (this.state.selectedTimeSlot > 1) {
              var rideTime = parseInt(time.substring(0, 2)) - 12 + "";
              if (timeSlot.substring(0, 1) < rideTime) {
                this.availableRides.push(ride);
              }
            } else {
              if (
                parseInt(timeSlot.substring(0, 1)) <
                parseInt(time.substring(0, 2))
              ) {
                this.availableRides.push(ride);
              } else if (
                parseInt(timeSlot.substring(4, 5)) >
                parseInt(time.substring(0, 2))
              ) {
                this.availableRides.push(ride);
              }
            }
          }
        }
      }
    }
    //}
  }

  selectedTimeSlot(currentIndex) {
    let errors = this.state.errors;
    errors.timeSlot = "";
    this.setState({ selectedTimeSlot: currentIndex, errors: errors });
  }

  onSelectDate = (date: Date | null | undefined): void => {
    this.setState({ date: date });
  };

  onFormatDate = (date): string => {
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

    return dd + "/" + mm + "/" + yyyy;
  };

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

    return yyyy + "-" + mm + "-" + dd;
  };

  showBookingStatus() {
    this.props.history.push("/myRides");
    toast.success("Booking successful", { className: "success-toast" });
  }

  confirmBooking = (id, price) => {
    var bookingDate = this.getFormattedDate(this.state.date) + "T" + "00:00:00";
    var bookingDateTime = new Date(bookingDate);
    try {
      sp.web.lists
        .getByTitle("Booking")
        .items.add({
          PickUp: this.state.from,
          Drop: this.state.to,
          BookingTime: bookingDateTime,
          Numberofseatsbooked: this.state.seats,
          Price: price,
          RideIdId: id,
        })
        .then((i) => {
          if (i.data.Id > 0) {
            toast.success("Booking successful", { className: "success-toast" });
          } else toast.error("Booking failed", { className: "success-toast" });
        });
    } catch (error) {
      toast.error("Some error occured! Please try again later..");
    }
  };

  getFirstName(name) {
    var words = name.split(" ");
    return words[0];
  }

  getProfileName(name) {
    var words = name.split(" ");
    if (words.length == 1) return words[0][0];
    else return words[0][0] + words[1][0];
  }

  async availableSeats(ride) {
    let Seats = [];
    let Points = [];
    Points.push(ride.PickUp);
    Seats.push(0);
    let viaPointqueryString = "RideId eq " + ride.Id;
    let ViaPoints = await sp.web.lists
      .getByTitle("ViaPoint")
      .items.filter(viaPointqueryString)
      .get()
      .then((result) => {
        return result;
      });

    var viaPointsCount: number = ViaPoints.length;
    for (var i = 0; i < viaPointsCount; i++) {
      Points.push("");
    }
    ViaPoints.forEach((point) => {
      Points[point.Index] = point.StopName;
      Seats.push(0);
    });
    Points.push(ride.Drop);
    var fromIndex = Points.indexOf(this.state.from);
    var toIndex = Points.indexOf(this.state.to);
    if (fromIndex == -1 || toIndex == -1) return 0;
    var numberOfBookings = 0;

    for (var i = 0; i < toIndex; i++) {
      for (var j = i + 1; j < Points.length; j++) {
        numberOfBookings = await this.GetBookingsCount(
          ride.Id,
          Points[i],
          Points[j]
        );
        if (numberOfBookings == 0) continue;
        for (var k = i; k < j; k++) {
          Seats[k] += numberOfBookings;
        }
      }
    }

    var max = 0;
    for (var i = fromIndex; i < toIndex; i++) {
      if (Seats[i] > max) max = Seats[i];
    }
    return ride.NumberofSeats - max;
  }

  async GetBookingsCount(rideId, from, to): Promise<number> {
    var queryString: string = "RideId eq " + rideId;
    let bookings = await sp.web.lists
      .getByTitle("Booking")
      .items.filter(queryString)
      .get()
      .then((result) => {
        return result;
      });

    if (bookings.length > 0) {
      var numberOfSeatsBooked = 0;
      bookings.forEach((booking) => {
        if (
          booking.Status == "Approved" &&
          booking.PickUp == from &&
          booking.Drop == to
        )
          numberOfSeatsBooked += booking.Numberofseatsbooked;
      });

      return numberOfSeatsBooked;
    }
  }

  getUserName() {
    var index = 0;
    console.log("From UserNames state: ", this.state.bookedRides);
    console.log("From GetUserName : ", this.state.availableRides);
    return this.state.availableRides.forEach(async (ride) => {
      var userName: any;
      await sp.web
        .getUserById(ride.AuthorId)
        .get()
        .then((user) => {
          userName = user.Title;
        });
      this.userNames[index] = userName;
      index += 1;
    });
  }

  async getAllPublisherNames() {
    await this.getUserName();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState({
      userNames: this.userNames,
    });
  }

  matchedRides: any = [];

  render() {
    var today = new Date();
    console.log("Book ride");
    let errors = this.state.errors;
    const timeSlotsList = this.timeSlots.map((timeSlot, index) => {
      return (
        <li
          key={index}
          onClick={() => this.selectedTimeSlot(index)}
          className={
            this.state.selectedTimeSlot == index ? "activeListElement" : ""
          }
        >
          {timeSlot}
        </li>
      );
    });

    this.matchedRides = this.availableRides.map((ride, index) => (
      <div className="matchCard">
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
            <p className="rideDetails">
              {ride.PickUp.charAt(0).toUpperCase()}
              {ride.PickUp.slice(1)}
            </p>
          </span>
          <span className="rowElement">
            <p className="rideDetails">
              {ride.Drop.charAt(0).toUpperCase()}
              {ride.Drop.slice(1)}
            </p>
          </span>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            {" "}
            <p className="cardLabel">Date</p>
          </span>
          <span className="rowElement">
            {" "}
            <p className="cardLabel">Time</p>
          </span>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            {" "}
            <p className="rideDetails">
              {this.onFormatDate(new Date(ride.StartDate))}
            </p>
          </span>
          <span className="rowElement">
            {" "}
            <p className="rideDetails">{ride.StartDate.substring(11, 16)}</p>
          </span>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            <p className="cardLabel">Price</p>
          </span>
        </div>
        <div className="cardRow">
          <span className="rowElement">
            <p className="rideDetails">{ride.Price}</p>
          </span>
        </div>
        <input
          type="button"
          onClick={() => this.confirmBooking(ride.Id, ride.Price)}
          className="submitButton"
          value="Book Ride"
        />
      </div>
    ));
    return (
      <div className="ms-Grid bookRideBody" dir="ltr">
        <div className="ms-Grid-row bookRideGridBody">
          <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl4 searchRideForm">
            <div className="toast-top-right">
              <ToastContainer
                position={toast.POSITION.TOP_RIGHT}
                autoClose={5000}
                hideProgressBar={true}
              />
            </div>
            <p className="formTitle"> Book a Ride </p>
            <p className="formTag"> we get you the matches asap !</p>
            <div className="errorValidationMessage">
              {this.state.validationMessage}
            </div>
            <div className="searchFields">
              <p className="formLabel">
                From
                {errors.from.length > 0 ? (
                  <span className="error">{errors.from}</span>
                ) : (
                  ""
                )}
              </p>
              <input
                type="text"
                className={
                  this.state.from.length == 0
                    ? "emptyTextField"
                    : "filledTextField"
                }
                onChange={this.handleChange}
                name="from"
                value={this.state.from}
              />
              <p className="formLabel">
                To
                {errors.to.length > 0 ? (
                  <span className="error">{errors.to}</span>
                ) : (
                  ""
                )}
              </p>
              <input
                type="text"
                className={
                  this.state.to.length == 0
                    ? "emptyTextField"
                    : "filledTextField"
                }
                onChange={this.handleChange}
                name="to"
                value={this.state.to}
              />
              <p className="formLabel">Date</p>
              <DatePicker
                className="dateField"
                minDate={today}
                value={this.state.date}
                isRequired={true}
                onSelectDate={this.onSelectDate}
              ></DatePicker>

              <p className="formLabel">
                Number of Seats
                {errors.seats.length > 0 ? (
                  <span className="error">{errors.seats}</span>
                ) : (
                  ""
                )}
              </p>
              <input
                type="number"
                className={
                  this.state.seats == 0 ? "emptyTextField" : "filledTextField"
                }
                onChange={this.handleChange}
                min="1"
                max="3"
                value={this.state.seats}
                name="seats"
              />
              <p className="formLabel">
                {" "}
                Time
                {errors.timeSlot.length > 0 ? (
                  <span className="error">{errors.timeSlot}</span>
                ) : (
                  ""
                )}
              </p>
              <div className="timeSlotList">
                <ul>{timeSlotsList}</ul>
              </div>
              <input
                type="button"
                className="submitButton"
                onClick={this.submitDetails}
                value="Submit"
              />
            </div>
          </div>

          <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl8">
            {this.state.showAvailableRides ? (
              <div className="matchedRidesList">
                <p className="matchedRidesHeading"> Your Matches </p>
                <div className="ms-Grid" dir="ltr">
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 bookRideGridBody">
                      {this.matchedRides}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {this.state.showNoRidesMessage ? (
              <div className="matchedRidesList">
                <p className="noRidesMessage">
                  Sorry!! No rides your way!! Please try with another day or
                  time..
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default BookRideComponent;
