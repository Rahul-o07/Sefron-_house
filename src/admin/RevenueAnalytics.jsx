import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

export default function RevenueAnalytics({
  orders,
  menuItems,
}) {
  const getDish = (id) => {
    return menuItems.find(
      (dish) => dish.id === id
    )
  }

  const getOrderTotal = (items) => {
    return items.reduce((total, item) => {
      const dish = getDish(item.dish_id)

      if (!dish) {
        return total
      }

      return (
        total +
        dish.price * item.quantity
      )
    }, 0)
  }

  const getItemCount = (items) => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )
  }

  // Total revenue
  const totalRevenue = orders.reduce(
    (total, order) =>
      total + getOrderTotal(order.items),
    0
  )

  // Total items sold
  const totalItemsSold = orders.reduce(
    (total, order) =>
      total + getItemCount(order.items),
    0
  )

  // Average order
  const averageOrderValue =
    orders.length > 0
      ? totalRevenue / orders.length
      : 0

  // Completed orders
  const completedOrders = orders.filter(
    (order) =>
      order.status === "Completed"
  ).length

  // Popular dish
  const dishSales = {}

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!dishSales[item.dish_id]) {
        dishSales[item.dish_id] = 0
      }

      dishSales[item.dish_id] +=
        item.quantity
    })
  })

  let mostPopularDish = null
  let highestQuantity = 0

  Object.entries(dishSales).forEach(
    ([dishId, quantity]) => {
      if (quantity > highestQuantity) {
        highestQuantity = quantity

        mostPopularDish =
          getDish(Number(dishId))
      }
    }
  )

  // Revenue chart
  const salesByDate = {}

  orders.forEach((order) => {
    if (!order.created_at) {
      return
    }

    const date =
      new Date(order.created_at)

    if (Number.isNaN(date.getTime())) {
      return
    }

    const dateKey =
      date.toISOString().split("T")[0]

    if (!salesByDate[dateKey]) {
      salesByDate[dateKey] = 0
    }

    salesByDate[dateKey] +=
      getOrderTotal(order.items)
  })

  const salesChartData =
    Object.entries(salesByDate)
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(([date, revenue]) => ({
        date: new Date(
          `${date}T00:00:00`
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        ),
        revenue,
      }))

  return (
    <div className="admin-content-page">

      {/* HEADER */}

      <div className="admin-page-heading">

        <p className="admin-eyebrow">
          BUSINESS INTELLIGENCE
        </p>

        <h1>
          Revenue Analytics
        </h1>

        <p>
          Monitor restaurant revenue,
          sales performance and popular
          dishes.
        </p>

      </div>

      {/* ANALYTICS CARDS */}

      <div className="admin-stats">

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

        <div className="admin-stat-card">

          <div className="stat-icon">
            📊
          </div>

          <div>

            <span>
              Average Order
            </span>

            <strong>
              ₹
              {Math.round(
                averageOrderValue
              ).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        <div className="admin-stat-card">

          <div className="stat-icon">
            🍽️
          </div>

          <div>

            <span>
              Items Sold
            </span>

            <strong>
              {totalItemsSold}
            </strong>

          </div>

        </div>

        <div className="admin-stat-card">

          <div className="stat-icon">
            🎉
          </div>

          <div>

            <span>
              Completed Orders
            </span>

            <strong>
              {completedOrders}
            </strong>

          </div>

        </div>

      </div>

      {/* REVENUE CHART */}

      <section className="orders-section analytics-chart-section">

        <div className="orders-section-header">

          <div>

            <p className="admin-eyebrow">
              SALES PERFORMANCE
            </p>

            <h2>
              Revenue Trend
            </h2>

            <p>
              Revenue generated from
              customer orders.
            </p>

          </div>

        </div>

        <div className="sales-chart">

          {salesChartData.length === 0 ? (

            <div className="admin-empty">

              <div className="empty-icon">
                📈
              </div>

              <h3>
                No sales data yet
              </h3>

              <p>
                Revenue chart will appear
                when orders are received.
              </p>

            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <LineChart
                data={salesChartData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#eeeeee"
                />

                <XAxis
                  dataKey="date"
                />

                <YAxis
                  tickFormatter={(value) =>
                    `₹${value}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`,
                    "Revenue",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111111"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>

            </ResponsiveContainer>

          )}

        </div>

      </section>

      {/* POPULAR DISH */}

      <section className="orders-section">

        <div className="orders-section-header">

          <div>

            <p className="admin-eyebrow">
              MENU PERFORMANCE
            </p>

            <h2>
              Most Popular Dish
            </h2>

          </div>

        </div>

        <div className="popular-dish-card">

          <div className="popular-dish-icon">
            ⭐
          </div>

          <div>

            <span>
              TOP SELLING ITEM
            </span>

            <h3>
              {mostPopularDish
                ? mostPopularDish.name
                : "No sales data"}
            </h3>

            {mostPopularDish && (
              <p>
                {highestQuantity} items sold
              </p>
            )}

          </div>

        </div>

      </section>

    </div>
  )
}