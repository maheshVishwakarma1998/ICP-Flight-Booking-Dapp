import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";

// import { stringToMicroAlgos } from "../../utils/conversions";

const addEnergyAssessment = ({ createNewEnergyAssessment, loading }) => {
  const [name, setName] = useState("");
  const [imageUrl, setImage] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [address, setAddress] = useState("");
  const [pricePerDay, setPrice] = useState(0);

  const isFormFilled = useCallback(() => {
    return name && imageUrl && recommendation && address && pricePerDay > 0;
  }, [name, imageUrl, recommendation, address , pricePerDay]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Energy Assessment</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Assessment name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter assessment name"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputRecommendation"
              label="Recommendation"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="recommendation"
                style={{ height: "80px" }}
                max={115}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAddress"
              label="Address"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="address"
                style={{ height: "80px" }}
                max={115}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPrice"
              label="Price Per Day in ICP"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              createNewEnergyAssessment({
                name,
                imageUrl,
                recommendation,
                address,
                pricePerDay,
              });
              handleClose();
            }}
          >
            Save new EnergyAssessment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

addEnergyAssessment.propTypes = {
  createNewEnergyAssessment: PropTypes.func.isRequired,
};

export default addEnergyAssessment;
