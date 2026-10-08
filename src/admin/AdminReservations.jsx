import { useEffect, useState } from "react"
import { API_URL } from "../config"

export default function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const [updatingId, setUpdatingId] = useState(null)

  // =========================
  // GET ADMIN TOKEN
  // =========================

  const getAdminToken = () => {
    return localStorage.getItem(
      "sefron_admin_token"
    )
  }

  // =========================
  // HANDLE AUTH ERROR
  // =========================

  const handleAuthError = () => {
    localStorage.removeItem(
      "sefron_admin_token"
    )

    localStorage.removeItem(
      "sefron_admin_username"
    )

    window.location.href =
      "/?admin=true"
  }

  // =========================
  // FORMAT RESERVATION DATE
  // =========================

  const formatReservationDate = (date) => {
    if (!date) {
      return "—"
    }

    // Handles YYYY-MM-DD without timezone shifting
    const dateString = String(date).split("T")[0]

    const [year, month, day] =
      dateString.split("-")

    if (!year || !month || !day) {
      return date
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const monthIndex =
      Number(month) - 1

    if (
      monthIndex < 0 ||
      monthIndex > 11
    ) {
      return date
    }

    return `${day} ${monthNames[monthIndex]} ${year}`
  }

  // =========================
  // FETCH RESERVATIONS
  // =========================

  const fetchReservations = async () => {
    try {
      setLoading(true)

      const token = getAdminToken()

      if (!token) {
        handleAuthError()
        return
      }

      const response = await fetch(
        `${API_URL}/api/reservations`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      // =========================
      // TOKEN EXPIRED / INVALID
      // =========================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError()
        return
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch reservations"
        )
      }

      const data =
        await response.json()

      setReservations(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.error(
        "Failed to fetch reservations:",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // LOAD RESERVATIONS
  // =========================

  useEffect(() => {
    fetchReservations()
  }, [])

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (
    reservationId,
    status
  ) => {
    try {
      setUpdatingId(reservationId)

      const token = getAdminToken()

      if (!token) {
        handleAuthError()
        return
      }

      const response = await fetch(
        `${API_URL}/api/reservations/${reservationId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      )

      // =========================
      // TOKEN EXPIRED / INVALID
      // =========================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError()
        return
      }

      if (!response.ok) {
        throw new Error(
          "Failed to update reservation"
        )
      }

      await fetchReservations()
    } catch (error) {
      console.error(
        "Failed to update reservation:",
        error
      )

      alert(
        "Failed to update reservation."
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // =========================
  // FILTER
  // =========================

  const filteredReservations =
    filter === "All"
      ? reservations
      : reservations.filter(
          (reservation) =>
            reservation.status === filter
        )

  // =========================
  // STATUS COUNTS
  // =========================

  const pendingCount =
    reservations.filter(
      (reservation) =>
        reservation.status === "Pending"
    ).length

  const confirmedCount =
    reservations.filter(
      (reservation) =>
        reservation.status === "Confirmed"
    ).length

  const completedCount =
    reservations.filter(
      (reservation) =>
        reservation.status === "Completed"
    ).length

  // =========================
  // PAGE
  // =========================

  return (
    <div className="admin-content-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="admin-page-heading">

        <p className="admin-eyebrow">
          TABLE MANAGEMENT
        </p>

        <h1>
          Reservations
        </h1>

        <p>
          Manage customer table bookings
          and reservation status.
        </p>

      </div>


      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <div className="reservation-summary">

        {/* TOTAL */}

        <div className="reservation-summary-card">

          <div className="reservation-summary-icon">
            🪑
          </div>

          <div>

            <span>
              Total Reservations
            </span>

            <strong>
              {reservations.length}
            </strong>

          </div>

        </div>


        {/* PENDING */}

        <div className="reservation-summary-card">

          <div className="reservation-summary-icon pending-icon">
            🕐
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>


        {/* CONFIRMED */}

        <div className="reservation-summary-card">

          <div className="reservation-summary-icon confirmed-icon">
            ✓
          </div>

          <div>

            <span>
              Confirmed
            </span>

            <strong>
              {confirmedCount}
            </strong>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="reservation-summary-card">

          <div className="reservation-summary-icon completed-icon">
            ✓
          </div>

          <div>

            <span>
              Completed
            </span>

            <strong>
              {completedCount}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          RESERVATIONS SECTION
      ========================== */}

      <section className="reservations-section">

        <div className="reservations-section-header">

          <div>

            <h2>
              All Reservations
            </h2>

            <p>
              {filteredReservations.length} reservation
              {filteredReservations.length !== 1
                ? "s"
                : ""}
            </p>

          </div>


          {/* REFRESH */}

          <button
            className="admin-refresh-button"
            onClick={fetchReservations}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>


        {/* =========================
            FILTERS
        ========================== */}

        <div className="reservation-filters">

          {[
            "All",
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled",
          ].map((status) => (

            <button
              key={status}
              className={
                filter === status
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(status)
              }
            >
              {status}
            </button>

          ))}

        </div>


        {/* =========================
            LOADING
        ========================== */}

        {loading &&
        reservations.length === 0 ? (

          <div className="admin-empty">

            <div className="empty-icon">
              🪑
            </div>

            <h3>
              Loading reservations...
            </h3>

          </div>

        ) : filteredReservations.length ===
          0 ? (

          /* =========================
             EMPTY STATE
          ========================== */

          <div className="admin-empty">

            <div className="empty-icon">
              🪑
            </div>

            <h3>
              No reservations found
            </h3>

            <p>
              Customer table bookings will
              appear here.
            </p>

          </div>

        ) : (

          /* =========================
             RESERVATION LIST
          ========================== */

          <div className="reservations-list">

            {filteredReservations.map(
              (reservation) => (

                <div
                  className="reservation-card"
                  key={reservation.id}
                >

                  {/* =====================
                      HEADER
                  ====================== */}

                  <div className="reservation-card-header">

                    <div>

                      <span className="reservation-label">
                        RESERVATION
                      </span>

                      <h3>
                        #{reservation.id}
                      </h3>

                    </div>


                    <span
                      className={`reservation-status-badge ${
                        reservation.status
                          ?.toLowerCase()
                      }`}
                    >
                      {reservation.status}
                    </span>

                  </div>


                  {/* =====================
                      MAIN DETAILS
                  ====================== */}

                  <div className="reservation-card-body">

                    <div className="reservation-info">

                      <span>
                        Customer
                      </span>

                      <strong>
                        {reservation.customer_name ||
                          "Customer"}
                      </strong>

                    </div>


                    <div className="reservation-info">

                      <span>
                        Phone
                      </span>

                      <strong>
                        {reservation.phone ||
                          "—"}
                      </strong>

                    </div>


                    {/* DATE */}

                    <div className="reservation-info">

                      <span>
                        Date
                      </span>

                      <strong>
                        {formatReservationDate(
                          reservation.reservation_date
                        )}
                      </strong>

                    </div>


                    {/* TIME */}

                    <div className="reservation-info">

                      <span>
                        Time
                      </span>

                      <strong>
                        {reservation.reservation_time ||
                          "—"}
                      </strong>

                    </div>


                    {/* GUESTS */}

                    <div className="reservation-info">

                      <span>
                        Guests
                      </span>

                      <strong>
                        {reservation.guests ||
                          "—"}
                      </strong>

                    </div>

                  </div>


                  {/* =====================
                      RESERVATION FOOTER
                  ====================== */}

                  <div className="reservation-card-footer">

                    <div className="reservation-footer-left">

                      <span className="reservation-created">
                        Reservation #
                        {reservation.id}
                      </span>

                      {reservation.created_at && (

                        <span className="reservation-created-time">

                          Created{" "}

                          {new Date(
                            reservation.created_at
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </span>

                      )}

                    </div>


                    {/* STATUS SELECT */}

                    <select
                      value={
                        reservation.status
                      }
                      disabled={
                        updatingId ===
                        reservation.id
                      }
                      onChange={(e) =>
                        updateStatus(
                          reservation.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  )
}