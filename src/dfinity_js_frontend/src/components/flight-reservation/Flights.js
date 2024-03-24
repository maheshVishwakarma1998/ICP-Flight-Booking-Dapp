import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddFlight from "./AddFlight";
import Flight from "./Flight";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import {
  getFlights as getFlightList,
  getReservationFee as getFee,
  addFlight as addFlight,
  makeReservation as makeReservationAction,
  endReservation as endReservationAction,
  deleteFlight as deleteflightAction,
} from "../../utils/flight";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import { formatE8s } from "../../utils/conversions";

const Flights = ({ fetchBalance }) => {
  const [flights, setFlights] = useState([]);
  const [reservationFee, setReservationFee] = useState(0);
  const [loading, setLoading] = useState(false);

  const getFlights = async () => {
    setLoading(true);
    getFlightList()
      .then((flights) => {
        if (flights) {
          setFlights(flights);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((_) => {
        setLoading(false);
      });
  };

  const getReservationFee = async () => {
    setLoading(true);
    getFee()
      .then((fee) => {
        if (fee) {
          setReservationFee(fee);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((_) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getFlights();
    getReservationFee();
  }, []);

  const createNewFlight = async (data) => {
    setLoading(true);
    const priceStr = data.pricePerPerson;
    data.pricePerPerson = parseInt(priceStr, 10) * 10 ** 8;
    addFlight(data)
      .then(() => {
        toast(<NotificationSuccess text="Flight added successfully." />);
        getFlights();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create flight." />);
        setLoading(false);
      });
  };

  const makeReservation = async (flight, noOfPersons) => {
    setLoading(true);
    makeReservationAction(flight, noOfPersons)
      .then(() => {
        toast(<NotificationSuccess text="Reservation made successfully" />);
        getFlights();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to make reservation." />);
        setLoading(false);
      });
  };

  const endReservation = async (id) => {
    setLoading(true);
    endReservationAction(id)
      .then(() => {
        toast(<NotificationSuccess text="Reservation ended successfully" />);
        getFlights();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to end reservation." />);
        setLoading(false);
      });
  };

  const deleteFlight = async (id) => {
    setLoading(true);
    deleteflightAction(id)
      .then(() => {
        toast(<NotificationSuccess text="Flight deleted successfully" />);
        getFlights();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to delete flight." />);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-4 fw-bold mb-0 text-light">
          Flight Booking Application{" "}
        </h1>
        <AddFlight createNewFlight={createNewFlight} />
      </div>
      <div className="mb-3 text-light">
        <i className="bi bi-bell-fill"></i> Holding fee for any reservation is{" "}
        {formatE8s(reservationFee)} ICP.
      </div>
      <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
        <>
          {flights.map((flight, index) => (
            <Flight
              flight={flight}
              makeReservation={makeReservation}
              endReservation={endReservation}
              deleteFlight={deleteFlight}
              key={index}
            />
          ))}
        </>
      </Row>
    </>
  );
};

Flights.propTypes = {
  fetchBalance: PropTypes.func.isRequired,
};

export default Flights;
