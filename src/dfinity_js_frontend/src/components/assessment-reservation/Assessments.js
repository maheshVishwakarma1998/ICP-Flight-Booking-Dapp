import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddEnergyAssessment from "./AddAssessment";
import EnergyAssessment from "./Assessment";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import {
  getEnergyAssessments as getEnergyAssessmentsList,
  getReservationFee as getFee,
  addEnergyAssessment as addEnergyAssessment,
  makeReservation as makeReservationAction,
  endReservation as endReservationAction,
  deleteEnergyAssessment as deleteEnergyAssessmentAction,
} from "../../utils/assessment";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import { formatE8s } from "../../utils/conversions";

const EnergyAssessments = ({ fetchBalance }) => {
  const [energyAssessments, setEnergyAssessments] = useState([]);
  const [reservationFee, setReservationFee] = useState(0);
  const [loading, setLoading] = useState(false);

  const getEnergyAssessments = async () => {
    setLoading(true);
    getEnergyAssessmentsList()
      .then((energyAssessments) => {
        if (energyAssessments) {
          setEnergyAssessments(energyAssessments);
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
    getEnergyAssessments();
    getReservationFee();
  }, []);

  const createNewEnergyAssessment = async (data) => {
    setLoading(true);
    const priceStr = data.pricePerDay;
    data.pricePerDay = parseInt(priceStr, 10) * 10 ** 8;
    addEnergyAssessment(data)
      .then(() => {
        toast(<NotificationSuccess text="Assessment added successfully." />);
        getEnergyAssessments();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create assessment." />);
        setLoading(false);
      });
  };

  const makeReservation = async (energyAssessment, noOfDays) => {
    setLoading(true);
    makeReservationAction(energyAssessment, noOfDays)
      .then(() => {
        toast(<NotificationSuccess text="Reservation made successfully" />);
        getEnergyAssessments();
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
        getEnergyAssessments();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to end reservation." />);
        setLoading(false);
      });
  };

  const deleteEnergyAssessment = async (id) => {
    setLoading(true);
    deleteEnergyAssessmentAction(id)
      .then(() => {
        toast(<NotificationSuccess text="Assessment deleted successfully" />);
        getEnergyAssessments();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to delete Assessment." />);
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
          Home Energy Efficiency Analyzer Application{" "}
        </h1>
        <AddEnergyAssessment createNewEnergyAssessment={createNewEnergyAssessment} />
      </div>
      <div className="mb-3 text-light">
        <i className="bi bi-bell-fill"></i> Holding fee for any reservation is{" "}
        {formatE8s(reservationFee)} ICP.
      </div>
      <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
        <>
          {energyAssessments.map((energyAssessment, index) => (
            <EnergyAssessment
            energyAssessment={energyAssessment}
              makeReservation={makeReservation}
              endReservation={endReservation}
              deleteEnergyAssessment={deleteEnergyAssessment}
              key={index}
            />
          ))}
        </>
      </Row>
    </>
  );
};

EnergyAssessments.propTypes = {
  fetchBalance: PropTypes.func.isRequired,
};

export default EnergyAssessments;
