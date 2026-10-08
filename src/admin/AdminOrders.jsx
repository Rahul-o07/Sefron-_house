import { useEffect, useMemo, useState } from "react"
import { API_URL } from "../config"

const STATUS_FLOW = [
  "New",
  "Preparing",
  "Ready",
  "Completed",
]

export default function AdminOrders({
  orders,
  setOrders,
}) {
  const [menu, setMenu] = useState([])
  const [filter, setFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem(
      "sefron_admin_token"
    )
  }

  // =====================================================
  // FETCH MENU WITH ADMIN TOKEN
  // =====================================================

  const loadMenu = async () => {
    try {
      const token = getAdminToken()

      if (!token) {
        throw new Error(
          "Admin login required"
        )
      }

      const response = await fetch(
        `${API_URL}/api/menu`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "sefron_admin_token"
        )

        localStorage.removeItem(
          "sefron_admin_username"
        )

        window.location.assign(
          "/?admin=true"
        )

        return
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load menu"
        )
      }

      const data =
        await response.json()

      setMenu(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.error(
        "Menu loading error:",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // LOAD MENU
  // =====================================================

  useEffect(() => {
    loadMenu()
  }, [])

  // =====================================================
  // MENU LOOKUP
  // =====================================================

  const menuMap = useMemo(() => {
    const map = {}

    menu.forEach((item) => {
      map[item.id] = item
    })

    return map
  }, [menu])

  // =====================================================
  // CALCULATE ORDER TOTAL
  // =====================================================

  const getOrderTotal = (order) => {
    if (!order?.items) {
      return 0
    }

    return order.items.reduce(
      (total, item) => {
        const dish =
          menuMap[item.dish_id]

        if (!dish) {
          return total
        }

        return (
          total +
          Number(dish.price) *
            Number(item.quantity)
        )
      },
      0
    )
  }

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId)

      const token =
        getAdminToken()

      if (!token) {
        throw new Error(
          "Admin login required"
        )
      }

      const response =
        await fetch(
          `${API_URL}/api/orders/${orderId}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              status: newStatus,
            }),
          }
        )

      // -------------------------------------------------
      // TOKEN INVALID
      // -------------------------------------------------

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "sefron_admin_token"
        )

        localStorage.removeItem(
          "sefron_admin_username"
        )

        window.location.assign(
          "/?admin=true"
        )

        return
      }

      // -------------------------------------------------
      // OTHER ERROR
      // -------------------------------------------------

      if (!response.ok) {
        throw new Error(
          "Failed to update order status"
        )
      }

      const updatedOrder =
        await response.json()

      // -------------------------------------------------
      // UPDATE FRONTEND
      // -------------------------------------------------

      setOrders(
        (previousOrders) =>
          previousOrders.map(
            (order) =>
              order.id === orderId
                ? {
                    ...order,
                    ...updatedOrder,
                    status: newStatus,
                  }
                : order
          )
      )
    } catch (error) {
      console.error(
        "Status update error:",
        error
      )

      alert(
        "Failed to update order status."
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) =>
            (order.status || "New") ===
            filter
        )

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    dateString
  ) => {
    if (!dateString) {
      return "Unknown"
    }

    return new Date(
      dateString
    ).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    )
  }

  // =====================================================
  // GET NEXT STATUS
  // =====================================================

  const getNextStatus = (
    status
  ) => {
    const currentIndex =
      STATUS_FLOW.indexOf(
        status
      )

    if (currentIndex === -1) {
      return "Preparing"
    }

    if (
      currentIndex >=
      STATUS_FLOW.length - 1
    ) {
      return null
    }

    return STATUS_FLOW[
      currentIndex + 1
    ]
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-section">

        <div className="admin-empty">

          <h3>
            Loading orders...
          </h3>

          <p>
            Please wait while we
            load the latest orders.
          </p>

        </div>

      </div>
    )
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="admin-section">

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="admin-page-heading">

        <div>

          <h1>
            Orders
          </h1>

          <p>
            Manage customer orders
            and track their progress.
          </p>

        </div>

        <button
          className="admin-refresh-btn"
          onClick={loadMenu}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =================================================
          FILTERS
      ================================================== */}

      <div className="order-filters">

        {/* ALL */}

        <button
          className={
            filter === "All"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("All")
          }
        >
          All
          <span>
            {orders.length}
          </span>
        </button>


        {/* STATUS FILTERS */}

        {STATUS_FLOW.map(
          (status) => {

            const count =
              orders.filter(
                (order) =>
                  (
                    order.status ||
                    "New"
                  ) === status
              ).length

            return (
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

                <span>
                  {count}
                </span>

              </button>
            )
          }
        )}

      </div>


      {/* =================================================
          ORDERS
      ================================================== */}

      {filteredOrders.length === 0 ? (

        <div className="admin-empty">

          <h3>
            No orders found
          </h3>

          <p>
            There are no orders
            in this category.
          </p>

        </div>

      ) : (

        <div className="orders-list">

          {filteredOrders.map(
            (order) => {

              const status =
                order.status ||
                "New"

              const nextStatus =
                getNextStatus(
                  status
                )

              return (

                <div
                  className="admin-order-card"
                  key={order.id}
                >

                  {/* =================================================
                      ORDER HEADER
                  ================================================== */}

                  <div className="admin-order-header">

                    <div>

                      <h3>
                        Order #{order.id}
                      </h3>

                      <p>
                        {formatDate(
                          order.created_at
                        )}
                      </p>

                    </div>

                    <span
                      className={`order-status ${status
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )}`}
                    >
                      {status}
                    </span>

                  </div>


                  {/* =================================================
                      CUSTOMER
                  ================================================== */}

                  <div className="admin-order-customer">

                    <div>

                      <strong>
                        Customer
                      </strong>

                      <p>
                        {order.customer_name ||
                          "Customer"}
                      </p>

                    </div>

                    <div>

                      <strong>
                        Phone
                      </strong>

                      <p>
                        {order.phone}
                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      ITEMS
                  ================================================== */}

                  <div className="admin-order-items">

                    <h4>
                      Order Items
                    </h4>

                    {order.items?.map(
                      (
                        item,
                        index
                      ) => {

                        const dish =
                          menuMap[
                            item.dish_id
                          ]

                        return (

                          <div
                            className="admin-order-item"
                            key={`${order.id}-${item.dish_id}-${index}`}
                          >

                            <div>

                              <strong>
                                {dish
                                  ? dish.name
                                  : `Dish #${item.dish_id}`}
                              </strong>

                              <span>
                                ×{" "}
                                {
                                  item.quantity
                                }
                              </span>

                            </div>

                            <strong>

                              ₹
                              {dish
                                ? (
                                    Number(
                                      dish.price
                                    ) *
                                    Number(
                                      item.quantity
                                    )
                                  ).toFixed(
                                    0
                                  )
                                : "0"}

                            </strong>

                          </div>

                        )
                      }
                    )}

                  </div>


                  {/* =================================================
                      FOOTER
                  ================================================== */}

                  <div className="admin-order-footer">

                    <div className="admin-order-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {getOrderTotal(
                          order
                        ).toFixed(0)}
                      </strong>

                    </div>


                    {/* STATUS ACTION */}

                    <div className="admin-order-actions">

                      {nextStatus ? (

                        <button
                          className="admin-primary-btn"
                          disabled={
                            updatingId ===
                            order.id
                          }
                          onClick={() =>
                            updateStatus(
                              order.id,
                              nextStatus
                            )
                          }
                        >

                          {updatingId ===
                          order.id
                            ? "Updating..."
                            : `Mark ${nextStatus}`}

                        </button>

                      ) : (

                        <span className="order-completed-text">

                          ✓ Order Completed

                        </span>

                      )}

                    </div>

                  </div>


                  {/* =================================================
                      STATUS TIMELINE
                  ================================================== */}

                  <div className="order-timeline">

                    {STATUS_FLOW.map(
                      (
                        step,
                        index
                      ) => {

                        const currentIndex =
                          STATUS_FLOW.indexOf(
                            status
                          )

                        const completed =
                          index <=
                          currentIndex

                        return (

                          <div
                            className={`timeline-step ${
                              completed
                                ? "completed"
                                : ""
                            }`}
                            key={step}
                          >

                            <div className="timeline-dot">

                              {completed
                                ? "✓"
                                : index + 1}

                            </div>

                            <span>
                              {step}
                            </span>

                            {index <
                              STATUS_FLOW.length -
                                1 && (

                              <div
                                className={`timeline-line ${
                                  index <
                                  currentIndex
                                    ? "completed"
                                    : ""
                                }`}
                              />

                            )}

                          </div>

                        )
                      }
                    )}

                  </div>

                </div>

              )
            }
          )}

        </div>

      )}

    </div>
  )
}