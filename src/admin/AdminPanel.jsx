import { useEffect, useState } from "react"

import AdminOrders from "./AdminOrders"
import AdminReservations from "./AdminReservations"
import RevenueAnalytics from "./RevenueAnalytics"
import AdminMenu from "./AdminMenu"

import "./AdminPanel.css"
import { API_URL } from "../config"

export default function AdminPanel() {
  const [activePage, setActivePage] =
    useState("dashboard")

  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem(
      "sefron_admin_token"
    )
  }

  // =====================================================
  // AUTHORIZED API REQUEST
  // =====================================================

  const authorizedFetch = async (
    url,
    options = {}
  ) => {
    const token = getAdminToken()

    if (!token) {
      throw new Error(
        "Admin login required"
      )
    }

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      const response =
        await authorizedFetch(
          `${API_URL}/api/orders`
        )

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "ADMIN_AUTH_REQUIRED"
        )
      }

      if (!response.ok) {
        throw new Error(
          "Orders API returned an error"
        )
      }

      const data =
        await response.json()

      setOrders(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      )

      setOrders([])

      throw error
    }
  }

  // =====================================================
  // FETCH MENU
  // =====================================================

  const fetchMenu = async () => {
    try {
      const response =
        await authorizedFetch(
          `${API_URL}/api/menu`
        )

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "ADMIN_AUTH_REQUIRED"
        )
      }

      if (!response.ok) {
        throw new Error(
          "Menu API returned an error"
        )
      }

      const data =
        await response.json()

      setMenuItems(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.error(
        "Failed to fetch menu:",
        error
      )

      setMenuItems([])

      throw error
    }
  }

  // =====================================================
  // LOAD ORDERS + MENU
  // =====================================================

  const loadAllData = async () => {
    setRefreshing(true)

    try {
      await Promise.all([
        fetchOrders(),
        fetchMenu(),
      ])
    } catch (error) {
      console.error(
        "Failed to load admin data:",
        error
      )

      // -------------------------------------------------
      // IF TOKEN IS INVALID
      // -------------------------------------------------

      if (
        error.message ===
        "ADMIN_AUTH_REQUIRED"
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
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {
    loadAllData()
  }, [])

  // =====================================================
  // CALCULATE TOTAL REVENUE
  // =====================================================

  const calculateOrderTotal = (
    order
  ) => {
    if (!order?.items) {
      return 0
    }

    return order.items.reduce(
      (total, item) => {
        const dish =
          menuItems.find(
            (menuItem) =>
              Number(menuItem.id) ===
              Number(item.dish_id)
          )

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

  const totalRevenue =
    orders.reduce(
      (total, order) => {
        return (
          total +
          calculateOrderTotal(order)
        )
      },
      0
    )

  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const newOrders =
    orders.filter(
      (order) =>
        (order.status || "New") ===
        "New"
    ).length

  const preparingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Preparing"
    ).length

  const readyOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Ready"
    ).length

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Completed"
    ).length

  // =====================================================
  // RENDER DASHBOARD
  // =====================================================

  const renderDashboard = () => {
    return (
      <div className="admin-content-page">

        {/* PAGE HEADER */}

        <div className="admin-page-heading">

          <p className="admin-eyebrow">
            SEFRON HOUSE
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Overview of your restaurant
            operations.
          </p>

        </div>


        {/* STAT CARDS */}

        <div className="admin-stats">

          {/* TOTAL ORDERS */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              📦
            </div>

            <div>

              <span>
                Total Orders
              </span>

              <strong>
                {orders.length}
              </strong>

            </div>

          </div>


          {/* REVENUE */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>

              <span>
                Total Revenue
              </span>

              <strong>
                ₹
                {totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>


          {/* NEW ORDERS */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              🆕
            </div>

            <div>

              <span>
                New Orders
              </span>

              <strong>
                {newOrders}
              </strong>

            </div>

          </div>


          {/* MENU ITEMS */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              🍽️
            </div>

            <div>

              <span>
                Menu Items
              </span>

              <strong>
                {menuItems.length}
              </strong>

            </div>

          </div>

        </div>


        {/* RESTAURANT OVERVIEW */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Restaurant Overview
              </h2>

              <p>
                Quick summary of your
                restaurant.
              </p>

            </div>

          </div>


          <div className="admin-overview-grid">

            <div className="admin-overview-card">

              <span>
                Orders to Prepare
              </span>

              <strong>
                {newOrders}
              </strong>

            </div>


            <div className="admin-overview-card">

              <span>
                Preparing Orders
              </span>

              <strong>
                {preparingOrders}
              </strong>

            </div>


            <div className="admin-overview-card">

              <span>
                Ready Orders
              </span>

              <strong>
                {readyOrders}
              </strong>

            </div>


            <div className="admin-overview-card">

              <span>
                Completed Orders
              </span>

              <strong>
                {completedOrders}
              </strong>

            </div>

          </div>

        </section>


        {/* RECENT ORDERS */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Recent Orders
              </h2>

              <p>
                Latest customer orders.
              </p>

            </div>

            <button
              className="admin-refresh-button"
              onClick={loadAllData}
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

          </div>


          <div className="dashboard-orders">

            {orders.length === 0 ? (

              <div className="admin-empty">

                <div className="empty-icon">
                  📦
                </div>

                <h3>
                  No orders yet
                </h3>

                <p>
                  Customer orders will
                  appear here.
                </p>

              </div>

            ) : (

              orders
                .slice(0, 5)
                .map((order) => {

                  const status =
                    order.status ||
                    "New"

                  return (
                    <div
                      className="dashboard-order-row"
                      key={order.id}
                    >

                      <div>

                        <strong>
                          Order #{order.id}
                        </strong>

                        <span>
                          {order.customer_name ||
                            "Customer"}
                        </span>

                      </div>

                      <span
                        className={`order-status ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>

                    </div>
                  )
                })

            )}

          </div>

        </section>

      </div>
    )
  }

  // =====================================================
  // RENDER CURRENT PAGE
  // =====================================================

  const renderPage = () => {

    if (loading) {
      return (
        <div className="admin-content-page">

          <div className="admin-empty">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading Admin Panel...
            </h3>

            <p>
              Connecting to SEFRON HOUSE
              database.
            </p>

          </div>

        </div>
      )
    }


    // DASHBOARD

    if (
      activePage ===
      "dashboard"
    ) {
      return renderDashboard()
    }


    // REVENUE

    if (
      activePage ===
      "revenue"
    ) {
      return (
        <RevenueAnalytics
          orders={orders}
          menuItems={menuItems}
        />
      )
    }


    // ORDERS

    if (
      activePage ===
      "orders"
    ) {
      return (
        <AdminOrders
          orders={orders}
          setOrders={setOrders}
        />
      )
    }


    // RESERVATIONS

    if (
      activePage ===
      "reservations"
    ) {
      return (
        <AdminReservations />
      )
    }


    // MENU

    if (
      activePage ===
      "menu"
    ) {
      return (
        <AdminMenu />
      )
    }


    return null
  }


  // =====================================================
  // MAIN ADMIN PANEL
  // =====================================================

  return (
    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================== */}

      <aside className="admin-sidebar">

        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-mark">
            S
          </div>

          <div>

            <strong>
              SEFRON HOUSE
            </strong>

            <span>
              ADMIN PANEL
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="admin-nav">

          <button
            className={
              activePage ===
              "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "dashboard"
              )
            }
          >

            <span>
              📊
            </span>

            Dashboard

          </button>


          <button
            className={
              activePage ===
              "revenue"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "revenue"
              )
            }
          >

            <span>
              💰
            </span>

            Revenue Analytics

          </button>


          <button
            className={
              activePage ===
              "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "orders"
              )
            }
          >

            <span>
              📦
            </span>

            Orders

          </button>


          <button
            className={
              activePage ===
              "reservations"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "reservations"
              )
            }
          >

            <span>
              🪑
            </span>

            Reservations

          </button>


          <button
            className={
              activePage ===
              "menu"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "menu"
              )
            }
          >

            <span>
              🍽️
            </span>

            Menu

          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          <button
            onClick={() => {
              window.location.href = "/"
            }}
          >

            <span>
              🏠
            </span>

            View Website

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN AREA
      ================================================== */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div>

            <span>
              MANAGEMENT
            </span>

            <strong>

              {activePage ===
                "dashboard" &&
                "Dashboard"}

              {activePage ===
                "revenue" &&
                "Revenue Analytics"}

              {activePage ===
                "orders" &&
                "Orders"}

              {activePage ===
                "reservations" &&
                "Reservations"}

              {activePage ===
                "menu" &&
                "Menu"}

            </strong>

          </div>


          {/* ADMIN USER */}

          <div className="admin-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div>

              <strong>
                {localStorage.getItem(
                  "sefron_admin_username"
                ) || "Admin"}
              </strong>

              <span>
                Restaurant Manager
              </span>

            </div>

          </div>

        </header>


        {/* CURRENT PAGE */}

        {renderPage()}

      </main>

    </div>
  )
}