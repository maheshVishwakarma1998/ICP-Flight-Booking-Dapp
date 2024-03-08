import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddRoom from "./AddRoom";
import Room from "./Room";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import {
  getRooms as getRoomList,
  getReservationFee as getFee,
  addRoom,
  makeReservation as makeReservationAction,
  endReservation as endReservationAction,
  deleteRoom as deleteroomAction,
} from "../../utils/room";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import { formatE8s } from "../../utils/conversions";

const Rooms = ({ fetchBalance }) => {
  const [rooms, setRooms] = useState([]);
  const [reservationFee, setReservationFee] = useState(0);
  const [loading, setLoading] = useState(false);

  const getRooms = async () => {
    setLoading(true);
    getRoomList()
      .then((rooms) => {
        if (rooms) {
          setRooms(rooms);
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
    getRooms();
    getReservationFee();
  }, []);

  const createNewRoom = async (data) => {
    setLoading(true);
    const priceStr = data.pricePerNight;
    data.pricePerNight = parseInt(priceStr, 10) * 10 ** 8;
    addRoom(data)
      .then(() => {
        toast(<NotificationSuccess text="Room added successfully." />);
        getRooms();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create room." />);
        setLoading(false);
      });
  };

  const makeReservation = async (room, noOfNights) => {
    setLoading(true);
    makeReservationAction(room, noOfNights)
      .then(() => {
        toast(<NotificationSuccess text="Reservation made successfully" />);
        getRooms();
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
        getRooms();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to end reservation." />);
        setLoading(false);
      });
  };

  const deleteRoom = async (id) => {
    setLoading(true);
    deleteroomAction(id)
      .then(() => {
        toast(<NotificationSuccess text="Room deleted successfully" />);
        getRooms();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to delete room." />);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-4 fw-bold mb-0">Hotel Rooms Reservation</h1>
        <AddRoom createNewRoom={createNewRoom} />
      </div>
      <div className="mb-3">
        <i className="bi bi-bell-fill"></i> Holding fee for any reservation is{" "}
        {formatE8s(reservationFee)} ICP.
      </div>
      <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
        <>
          {rooms.map((room, index) => (
            <Room
              room={room}
              makeReservation={makeReservation}
              endReservation={endReservation}
              deleteRoom={deleteRoom}
              key={index}
            />
          ))}
        </>
      </Row>
    </>
  );
};

Rooms.propTypes = {
  fetchBalance: PropTypes.func.isRequired,
};

export default Rooms;
