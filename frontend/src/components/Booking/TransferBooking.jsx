import React, { useState, useContext } from "react";
import { Form, FormGroup, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./transferBooking.css";
import { BASE_URL } from "../../utils/config";

const TransferBooking = ({ transfer }) => {
  const { price } = transfer;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState({
    userId: user ? user._id : null,
    userEmail: user ? user.email : "",
    transferFrom: transfer.origin,
    transferTo: transfer.destination,
    flightNumber: "",
    fullName: "",
    address: "", // New field for drop-off address
    phone: "",
    passengerNames: "",
    transferDate: "",
    transferTime: "",
    note: "",
  });

  const handleSwap = () => {
    setBooking((prevBooking) => ({
      ...prevBooking,
      transferFrom: prevBooking.transferTo,
      transferTo: prevBooking.transferFrom,
    }));
  };
  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/transfer-booking`, {
        method: "post",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(booking),
      });
      const result = await res.json();
      if (!res.ok) {
        return alert(result.message);
      }
      navigate("/thank-you");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="booking">
      <Form onSubmit={handleClick} className="booking__form">
        {/* Personal Information Fields */}
        <FormGroup className="booking__info-form">
          <input
            type="text"
            name="fullName"
            placeholder="Name Surname"
            required
            id="fullName"
            onChange={handleChange}
            className="booking__form-input"
          />
          {!user && (
            <input
              type="email"
              id="userEmail"
              placeholder="Enter your email"
              value={booking.userEmail}
              onChange={handleChange}
              required
              className="booking__form-input"
            />
          )}
          <input
            type="text"
            id="phone"
            placeholder="Phone"
            required
            value={booking.phone}
            onChange={handleChange}
            className="booking__form-input"
          />
          <input
            type="text"
            id="passengerNames"
            placeholder="Passengers Names"
            value={booking.passengerNames}
            required
            onChange={handleChange}
            className="booking__form-input"
          />
        </FormGroup>

        {/* Transfer Information Fields */}
        <FormGroup className="booking__info-form">
          <div className="transfer-info">
            <p className="transfer-info__text">
              Transfer From: {booking.transferFrom}
            </p>
            <button className="btn swap-btn" onClick={handleSwap}>
              Swap
            </button>
            <p className="transfer-info__text">
              Transfer To: {booking.transferTo}
            </p>
          </div>
          <input
            type="text"
            id="address"
            placeholder="Exact Address for Pick-Up or Drop-Off"
            value={booking.address}
            onChange={handleChange}
            required
            className="booking__form-input"
          />
          <input
            type="text"
            id="flightNumber"
            placeholder="Flight number"
            value={booking.flightNumber}
            required
            onChange={handleChange}
            className="booking__form-input"
          />
          <input
            type="date"
            id="transferDate"
            required
            value={booking.transferDate}
            onChange={handleChange}
            className="booking__form-input"
          />
          <input
            type="time"
            id="transferTime"
            required
            value={booking.transferTime}
            onChange={handleChange}
            className="booking__form-input"
          />
          <textarea
            id="note"
            placeholder="Note"
            onChange={handleChange}
            value={booking.note}
            className="booking__form-input"
          />
        </FormGroup>
      </Form>
      <Button onClick={handleClick} className="btn primary__btn">
        Book Now - ${price}
      </Button>
    </div>
  );
};

export default TransferBooking;
