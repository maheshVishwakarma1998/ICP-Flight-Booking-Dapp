import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
// import { stringToMicroAlgos } from "../../utils/conversions";

const AddRoom = ({ createNewRoom }) => {
  const [name, setName] = useState("");
  const [imageUrl, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPrice] = useState(0);

  const isFormFilled = useCallback(() => {
    return name && imageUrl && description && pricePerNight > 0;
  }, [name, imageUrl, description, pricePerNight]);

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
          <Modal.Title>New Room</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Room name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter room name"
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
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                max={115}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPrice"
              label="Price Per Night in ICP"
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
              createNewRoom({
                name,
                imageUrl,
                description,
                pricePerNight,
              });
              handleClose();
            }}
          >
            Save new Room
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddRoom.propTypes = {
  createNewRoom: PropTypes.func.isRequired,
};

export default AddRoom;
