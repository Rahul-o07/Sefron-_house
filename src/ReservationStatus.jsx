import { useState } from "react"
import { API_URL } from "./config"

export default function ReservationStatus() {
  const [reservationId, setReservationId] = useState("")
  const [phone, setPhone] = useState("")
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkStatus = async () => {
    if (!reservationId.trim() || !phone.trim()) {
      setError("Please enter Reservation ID and phone number.")
      return
    }

    setLoading(true)
    setError("")
    setReservation(null)

    try {
      const response = await fetch(
        `${API_URL}/api/reservations/${reservationId}?phone=${encodeURIComponent(
          phone
        )}`
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.detail ||
            "Reservation not found. Please check your details."
        )
        return
      }

      setReservation(data)
    } catch (error) {
      console.error("Reservation status error:", error)
      setError("Unable to connect to the server.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return "-"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusClass = (status) => {
    if (!status) return ""

    return status
      .toLowerCase()
      .replace(/\s+/g, "-")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkStatus()
    }
  }

  return (
    <section
      id="reservation-status"
      className="reservation-status-section"
    >
      <div className="reservation-status-container">

        {/* HEADING */}
        <p className="reservation-tracking-label">
          RESERVATION TRACKING
        </p>

        <h2 className="reservation-tracking-title">
          Track Your Reservation
        </h2>

        <p className="reservation-tracking-description">
          Enter your Reservation ID and phone number to check your
          table reservation status.
        </p>

        {/* TRACKING CARD */}
        <div className="reservation-tracking-card">

          <div className="reservation-tracking-form">

            {/* RESERVATION ID */}
            <input
              type="number"
              placeholder="Reservation ID"
              value={reservationId}
              onChange={(e) =>
                setReservationId(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            {/* PHONE */}
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            {/* BUTTON */}
            <button
              onClick={checkStatus}
              disabled={loading}
              className="reservation-track-button"
            >
              {loading
                ? "Checking..."
                : "Track Reservation"}
            </button>

          </div>

          {/* ERROR */}
          {error && (
            <div className="reservation-tracking-error">
              {error}
            </div>
          )}

          {/* RESULT */}
          {reservation && (
            <div className="reservation-tracking-result">

              {/* RESULT HEADER */}
              <div className="reservation-result-header">

                <div>
                  <span className="reservation-result-label">
                    Reservation
                  </span>

                  <strong className="reservation-result-id">
                    #{reservation.reservation_id}
                  </strong>
                </div>

                <span
                  className={`reservation-result-status ${getStatusClass(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>

              </div>

              {/* DETAILS */}
              <div className="reservation-result-details">

                <div className="reservation-detail-box">
                  <span>Customer</span>
                  <strong>
                    {reservation.customer_name}
                  </strong>
                </div>

                <div className="reservation-detail-box">
                  <span>Date</span>
                  <strong>
                    {formatDate(
                      reservation.reservation_date
                    )}
                  </strong>
                </div>

                <div className="reservation-detail-box">
                  <span>Time</span>
                  <strong>
                    {reservation.reservation_time}
                  </strong>
                </div>

                <div className="reservation-detail-box">
                  <span>Guests</span>
                  <strong>
                    {reservation.guests}
                  </strong>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  )
}