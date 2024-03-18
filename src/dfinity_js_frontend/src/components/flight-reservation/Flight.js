import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Stack,
} from "react-bootstrap";
import {
  truncateAddress,
  convertTime,
  formatE8s,
} from "../../utils/conversions";
import Identicon from "../utils/Identicon";
import { Principal } from "@dfinity/principal";
import { deleteFlight } from "../../utils/flight";

const Flight = ({ flight, makeReservation, endReservation, deleteFlight }) => {
  const {
    id,
    name,
    imageUrl,
    description,
    pricePerPerson,
    currentReservedTo,
    currentReservationEnds,
    isReserved,
    creator,
  } = flight;
  const [noOfPersons, setNoOfPersons] = useState(1);
  const principal = window.auth.principalText;
  const isCreator = () => Principal.from(creator).toString() === principal;

  const reservationEnded = () => {
    let now = new Date();
    let endTime = new Date(Number(currentReservationEnds[0] / BigInt(10 ** 6)));
    return now >= endTime;
  };
  return (
    <Col key={id}>
      <Card className="h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon
              size={28}
              address={
                currentReservedTo.length > 0
                  ? Principal.from(currentReservedTo[0]).toString()
                  : Principal.from(creator).toString()
              }
            />
            <span className="font-monospace text-secondary">
              {currentReservedTo.length > 0 ? (
                truncateAddress(Principal.from(currentReservedTo[0]).toString())
              ) : (
                <></>
              )}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {isReserved ? "RESERVED" : "AVAILABLE"}
            </Badge>
          </Stack>
        </Card.Header>
        <div className="ratio ratio-4x3">
          <img src={imageUrl} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1">{description}</Card.Text>
          <Card.Text className="flex-grow-1">
            {currentReservationEnds.length > 0
              ? `Reservation ends: ${convertTime(currentReservationEnds[0])}`
              : ""}
          </Card.Text>
          <Form className="d-flex align-content-stretch flex-row gap-2">
            {Principal.from(
              currentReservedTo[0] ? currentReservedTo[0] : creator
            ).toString() === principal && isReserved ? (
              <Button
                variant="outline-dark"
                onClick={() => endReservation(id)}
                disabled={!reservationEnded()}
                className="w-100 py-3"
              >
                End Reservation
              </Button>
            ) : isReserved ? (
              <>
                <Button
                  variant="outline-dark"
                  disabled={isReserved}
                  className="w-100 py-3"
                >
                  Reserved
                </Button>
              </>
            ) : (
              <>
                <FloatingLabel
                  controlId="inputCount"
                  label="Persons"
                  className="w-25"
                >
                  <Form.Control
                    type="number"
                    value={noOfPersons}
                    min="1"
                    disabled={isReserved || isCreator()}
                    onChange={(e) => {
                      setNoOfPersons(Number(e.target.value));
                    }}
                  />
                </FloatingLabel>
                <Button
                  variant="outline-dark"
                  disabled={isReserved || isCreator()}
                  onClick={() => makeReservation(id, noOfPersons)}
                  className="w-75 py-3"
                >
                  {isCreator()
                    ? "Owner cannot reserve flight"
                    : `Reserve for ${
                        formatE8s(pricePerPerson) * noOfPersons
                      } ICP`}
                </Button>
              </>
            )}
            {isCreator() && (
              <Button
                variant="outline-danger"
                onClick={() => deleteFlight(id)}
                className="btn"
              >
                <i className="bi bi-trash"></i>
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};

Flight.propTypes = {
  flight: PropTypes.instanceOf(Object).isRequired,
  makeReservation: PropTypes.func.isRequired,
  endReservation: PropTypes.func.isRequired,
  deleteFlight: PropTypes.func.isRequired,
};

export default Flight;
