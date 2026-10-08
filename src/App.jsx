import { useEffect, useState } from "react"
import "./App.css"

import AdminPanel from "./admin/AdminPanel"
import AdminLogin from "./admin/AdminLogin"
import ReservationStatus from "./ReservationStatus"

/* ============================================================
   SEFRON HOUSE
   Restaurant Website
   React Frontend + FastAPI Backend
   ============================================================ */

const API_URL = "http://127.0.0.1:8000"

const defaultFoodImage = "/images/food-generic.svg"

const dishImageMap = {
  Idly: "/images/idly.jpg",
  "Masala Dosa": "/images/masala-dosa.jpg",
  "Ghee Roast": "/images/ghee-roast.jpg",
  Pongal: "/images/pongal.jpg",
  "Medu Vada": "/images/medu-vada.jpg",
  "Poori Masala": "/images/poori-masala.jpg",
  "Butter Naan": "/images/butter-naan.jpg",
  "Paneer Butter Masala": "/images/paneer-butter-masala.jpg",
  "Kadai Paneer": "/images/kadai-paneer.jpg",
  "Dal Tadka": "/images/dal-tadka.jpg",
  "Chole Bhature": "/images/chole-bhature.jpg",
  "Palak Paneer": "/images/palak-paneer.jpg",
  "Chicken Biryani": "/images/chicken-biryani.jpg",
  "Mutton Biryani": "/images/mutton-biryani.jpg",
  "Egg Biryani": "/images/egg-biryani.jpg",
  "Veg Biryani": "/images/veg-biryani.jpg",
  "Paneer Biryani": "/images/paneer-biryani.jpg",
  "Veg Fried Rice": "/images/veg-fried-rice.jpg",
  "Chicken Fried Rice": "/images/chicken-fried-rice.jpg",
  "Schezwan Noodles": "/images/schezwan-noodles.jpg",
  "Gobi Manchurian": "/images/gobi-manchurian.jpg",
  "Chilli Paneer": "/images/chilli-paneer.jpg",
  "Spring Rolls": "/images/spring-rolls.jpg",
  "Margherita Pizza": "/images/margherita-pizza.jpg",
  "Farmhouse Pizza": "/images/farmhouse-pizza.jpg",
  "Truffle Pasta": "/images/truffle-pasta.jpg",
  "Alfredo Pasta": "/images/alfredo-pasta.jpg",
  Lasagna: "/images/lasagna.jpg",
  "Penne Arrabbiata": "/images/penne-arrabbiata.jpg",
  "Classic Burger": "/images/classic-burger.jpg",
  "Chicken Burger": "/images/chicken-burger.jpg",
  "French Fries": "/images/french-fries.jpg",
  "Club Sandwich": "/images/club-sandwich.jpg",
  "Chicken Wings": "/images/chicken-wings.jpg",
  "Grilled Fish": "/images/grilled-fish.jpg",
  "Fish Fry": "/images/fish-fry.jpg",
  "Prawn Masala": "/images/prawn-masala.jpg",
  "Prawn Fry": "/images/prawn-fry.jpg",
  "Gulab Jamun": "/images/gulab-jamun.jpg",
  "Chocolate Brownie": "/images/chocolate-brownie.jpg",
  Cheesecake: "/images/cheesecake.jpg",
  "Ice Cream": "/images/ice-cream.jpg",
  Tiramisu: "/images/tiramisu.jpg",
  "Filter Coffee": "/images/filter-coffee.jpg",
  "Fresh Lime Soda": "/images/fresh-lime-soda.jpg",
  "Mango Lassi": "/images/mango-lassi.jpg",
  "Cold Coffee": "/images/cold-coffee.jpg",
  "Fresh Fruit Juice": "/images/fresh-fruit-juice.jpg",
}

const getDishImage = (dishName) => {
  if (!dishName) return defaultFoodImage
  if (dishImageMap[dishName]) return dishImageMap[dishName]
  const slug = String(dishName).trim().toLowerCase().replace(/\s+/g, "-")
  return `/images/${slug}.jpg`
}

/* ============================================================
   DEFAULT DISHES 
   ============================================================ */

const defaultDishes = [
  // SOUTH INDIAN
  {
    id: 1,
    name: "Idly",
    category: "South Indian",
    price: 80,
    image: getDishImage("Idly"),
  },
  {
    id: 2,
    name: "Masala Dosa",
    category: "South Indian",
    price: 120,
    image: getDishImage("Masala Dosa"),
  },
  {
    id: 3,
    name: "Ghee Roast",
    category: "South Indian",
    price: 140,
    image: getDishImage("Ghee Roast"),
  },
  {
    id: 4,
    name: "Pongal",
    category: "South Indian",
    price: 100,
    image: getDishImage("Pongal"),
  },
  {
    id: 5,
    name: "Medu Vada",
    category: "South Indian",
    price: 90,
    image: getDishImage("Medu Vada"),
  },
  {
    id: 6,
    name: "Poori Masala",
    category: "South Indian",
    price: 110,
    image: getDishImage("Poori Masala"),
  },

  // NORTH INDIAN
  {
    id: 7,
    name: "Butter Naan",
    category: "North Indian",
    price: 70,
    image: getDishImage("Butter Naan"),
  },
  {
    id: 8,
    name: "Paneer Butter Masala",
    category: "North Indian",
    price: 240,
    image: getDishImage("Paneer Butter Masala"),
  },
  {
    id: 9,
    name: "Kadai Paneer",
    category: "North Indian",
    price: 250,
    image: getDishImage("Kadai Paneer"),
  },
  {
    id: 10,
    name: "Dal Tadka",
    category: "North Indian",
    price: 180,
    image: getDishImage("Dal Tadka"),
  },
  {
    id: 11,
    name: "Chole Bhature",
    category: "North Indian",
    price: 180,
    image: getDishImage("Chole Bhature"),
  },
  {
    id: 12,
    name: "Palak Paneer",
    category: "North Indian",
    price: 230,
    image: getDishImage("Palak Paneer"),
  },

  // BIRYANI
  {
    id: 13,
    name: "Chicken Biryani",
    category: "Biryani",
    price: 280,
    image: getDishImage("Chicken Biryani"),
  },
  {
    id: 14,
    name: "Mutton Biryani",
    category: "Biryani",
    price: 340,
    image: getDishImage("Mutton Biryani"),
  },
  {
    id: 15,
    name: "Egg Biryani",
    category: "Biryani",
    price: 220,
    image: getDishImage("Egg Biryani"),
  },
  {
    id: 16,
    name: "Veg Biryani",
    category: "Biryani",
    price: 190,
    image: getDishImage("Veg Biryani"),
  },
  {
    id: 17,
    name: "Paneer Biryani",
    category: "Biryani",
    price: 240,
    image: getDishImage("Paneer Biryani"),
  },

  // CHINESE
  {
    id: 18,
    name: "Veg Fried Rice",
    category: "Chinese",
    price: 180,
    image: getDishImage("Veg Fried Rice"),
  },
  {
    id: 19,
    name: "Chicken Fried Rice",
    category: "Chinese",
    price: 230,
    image: getDishImage("Chicken Fried Rice"),
  },
  {
    id: 20,
    name: "Schezwan Noodles",
    category: "Chinese",
    price: 210,
    image: getDishImage("Schezwan Noodles"),
  },
  {
    id: 21,
    name: "Gobi Manchurian",
    category: "Chinese",
    price: 190,
    image: getDishImage("Gobi Manchurian"),
  },
  {
    id: 22,
    name: "Chilli Paneer",
    category: "Chinese",
    price: 220,
    image: getDishImage("Chilli Paneer"),
  },
  {
    id: 23,
    name: "Spring Rolls",
    category: "Chinese",
    price: 170,
    image: getDishImage("Spring Rolls"),
  },

  // ITALIAN
  {
    id: 24,
    name: "Margherita Pizza",
    category: "Italian",
    price: 329,
    image: getDishImage("Margherita Pizza"),
  },
  {
    id: 25,
    name: "Farmhouse Pizza",
    category: "Italian",
    price: 399,
    image: getDishImage("Farmhouse Pizza"),
  },
  {
    id: 26,
    name: "Truffle Pasta",
    category: "Italian",
    price: 349,
    image: getDishImage("Truffle Pasta"),
  },
  {
    id: 27,
    name: "Alfredo Pasta",
    category: "Italian",
    price: 299,
    image: getDishImage("Alfredo Pasta"),
  },
  {
    id: 28,
    name: "Lasagna",
    category: "Italian",
    price: 379,
    image: getDishImage("Lasagna"),
  },
  {
    id: 29,
    name: "Penne Arrabbiata",
    category: "Italian",
    price: 289,
    image: getDishImage("Penne Arrabbiata"),
  },

  // FAST FOOD
  {
    id: 30,
    name: "Classic Burger",
    category: "Fast Food",
    price: 299,
    image: getDishImage("Classic Burger"),
  },
  {
    id: 31,
    name: "Chicken Burger",
    category: "Fast Food",
    price: 349,
    image: getDishImage("Chicken Burger"),
  },
  {
    id: 32,
    name: "French Fries",
    category: "Fast Food",
    price: 149,
    image: getDishImage("French Fries"),
  },
  {
    id: 33,
    name: "Club Sandwich",
    category: "Fast Food",
    price: 249,
    image: getDishImage("Club Sandwich"),
  },
  {
    id: 34,
    name: "Chicken Wings",
    category: "Fast Food",
    price: 299,
    image: getDishImage("Chicken Wings"),
  },

  // SEAFOOD
  {
    id: 35,
    name: "Grilled Fish",
    category: "Seafood",
    price: 399,
    image: getDishImage("Grilled Fish"),
  },
  {
    id: 36,
    name: "Fish Fry",
    category: "Seafood",
    price: 349,
    image: getDishImage("Fish Fry"),
  },
  {
    id: 37,
    name: "Prawn Masala",
    category: "Seafood",
    price: 429,
    image: getDishImage("Prawn Masala"),
  },
  {
    id: 38,
    name: "Prawn Fry",
    category: "Seafood",
    price: 449,
    image: getDishImage("Prawn Fry"),
  },

  // DESSERTS
  {
    id: 39,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 120,
    image: getDishImage("Gulab Jamun"),
  },
  {
    id: 40,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 180,
    image: getDishImage("Chocolate Brownie"),
  },
  {
    id: 41,
    name: "Cheesecake",
    category: "Desserts",
    price: 220,
    image: getDishImage("Cheesecake"),
  },
  {
    id: 42,
    name: "Ice Cream",
    category: "Desserts",
    price: 140,
    image: getDishImage("Ice Cream"),
  },
  {
    id: 43,
    name: "Tiramisu",
    category: "Desserts",
    price: 250,
    image: getDishImage("Tiramisu"),
  },

  // BEVERAGES
  {
    id: 44,
    name: "Filter Coffee",
    category: "Beverages",
    price: 70,
    image: getDishImage("Filter Coffee"),
  },
  {
    id: 45,
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 90,
    image: getDishImage("Fresh Lime Soda"),
  },
  {
    id: 46,
    name: "Mango Lassi",
    category: "Beverages",
    price: 130,
    image: getDishImage("Mango Lassi"),
  },
  {
    id: 47,
    name: "Cold Coffee",
    category: "Beverages",
    price: 160,
    image: getDishImage("Cold Coffee"),
  },
  {
    id: 48,
    name: "Fresh Fruit Juice",
    category: "Beverages",
    price: 120,
    image: getDishImage("Fresh Fruit Juice"),
  },
]

/* ============================================================
   CATEGORIES
   ============================================================ */

const categories = [
  "All",
  "South Indian",
  "North Indian",
  "Biryani",
  "Chinese",
  "Italian",
  "Fast Food",
  "Seafood",
  "Desserts",
  "Beverages",
]

/* ============================================================
   ORDER STATUS
   ============================================================ */

const orderStatuses = [
  "New",
  "Preparing",
  "Ready",
  "Completed",
]

/* ============================================================
   ADMIN CHECK
   ============================================================ */

const isAdmin =
  new URLSearchParams(window.location.search).get("admin") === "true"

/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

const formatOrderDateTime = (dateValue) => {
  if (!dateValue) {
    return "Date not available"
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return String(dateValue)
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getOrderStatusIndex = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase()

  const index = orderStatuses.findIndex(
    (item) =>
      item.toLowerCase() === normalizedStatus
  )

  return index >= 0 ? index : 0
}

const getOrderStatusMessage = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase()

  if (normalizedStatus === "new") {
    return "Your order has been received and is waiting to be prepared."
  }

  if (normalizedStatus === "preparing") {
    return "Our kitchen is preparing your delicious order."
  }

  if (normalizedStatus === "ready") {
    return "Your order is ready and waiting for you."
  }

  if (normalizedStatus === "completed") {
    return "Your order has been completed. Thank you for choosing SEFRON HOUSE!"
  }

  return "Your order is being processed by SEFRON HOUSE."
}

/* ============================================================
   APP
   ============================================================ */

function App() {
  /* ==========================================================
     ADMIN AUTH STATE
     ========================================================== */

  const [adminAuthenticated, setAdminAuthenticated] =
    useState(() => {
      if (!isAdmin) {
        return false
      }

      return Boolean(
        localStorage.getItem("sefron_admin_token")
      )
    })

  /* ==========================================================
     GENERAL STATE
     ========================================================== */

  const [backendMessage, setBackendMessage] = useState(
    "Connecting to backend..."
  )

  const [menu, setMenu] = useState(defaultDishes)

  const [menuLoading, setMenuLoading] = useState(true)

  const [cart, setCart] = useState([])

  const [search, setSearch] = useState("")

  const [category, setCategory] = useState("All")

  /* ==========================================================
     BOOKING STATE
     ========================================================== */

  const [showBooking, setShowBooking] = useState(false)

  const [reservationName, setReservationName] = useState("")

  const [reservationPhone, setReservationPhone] = useState("")

  const [reservationDate, setReservationDate] = useState("")

  const [reservationTime, setReservationTime] = useState("")

  const [reservationGuests, setReservationGuests] = useState(2)

  const [reservationLoading, setReservationLoading] =
    useState(false)

  const [reservationSuccess, setReservationSuccess] =
    useState(null)

  /* ==========================================================
     CHECKOUT STATE
     ========================================================== */

  const [showCheckout, setShowCheckout] = useState(false)

  const [customerName, setCustomerName] = useState("")

  const [customerPhone, setCustomerPhone] = useState("")

  const [orderLoading, setOrderLoading] = useState(false)

  const [orderSuccess, setOrderSuccess] = useState(null)

  /* ==========================================================
     ORDER TRACKING STATE
     ========================================================== */

  const [trackingOrderId, setTrackingOrderId] = useState("")

  const [trackingPhone, setTrackingPhone] = useState("")

  const [trackingOrder, setTrackingOrder] = useState(null)

  const [trackingLoading, setTrackingLoading] = useState(false)

  const [trackingError, setTrackingError] = useState("")

  /* ==========================================================
     BACKEND CONNECTION
     ========================================================== */

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend returned an error")
        }

        return response.json()
      })
      .then((data) => {
        setBackendMessage(
          data.message || "Backend connected successfully"
        )
      })
      .catch((error) => {
        console.error("Backend connection error:", error)

        setBackendMessage(
          "Backend connection failed"
        )
      })
  }, [])

  /* ==========================================================
     GET MENU FROM FASTAPI
     ========================================================== */

  useEffect(() => {
    setMenuLoading(true)

    fetch(`${API_URL}/api/menu`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Menu API returned ${response.status}`
          )
        }

        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error(
            "Menu API did not return an array"
          )
        }

        const menuWithImages = data.map((dish) => {
          const normalizedMenuName = String(
            dish.name || ""
          )
            .trim()
            .toLowerCase()

          const matchingDish =
            defaultDishes.find(
              (item) =>
                String(item.name || "")
                  .trim()
                  .toLowerCase() ===
                normalizedMenuName
            ) ||
            defaultDishes.find(
              (item) =>
                Number(item.id) === Number(dish.id)
            )

          const localDishImage =
            matchingDish?.image || getDishImage(dish.name)

          return {
            ...dish,
            image:
              dish.image && String(dish.image).startsWith("http")
                ? dish.image
                : localDishImage || defaultFoodImage,
          }
        })

        setMenu(
          menuWithImages.length > 0
            ? menuWithImages
            : defaultDishes
        )

        setMenuLoading(false)
      })
      .catch((error) => {
        console.error(
          "Menu API connection error:",
          error
        )

        /*
          If PostgreSQL/backend menu fails,
          continue showing the default menu
          instead of breaking the website.
        */
        setMenu(defaultDishes)
        setMenuLoading(false)
      })
  }, [])

  /* ==========================================================
     ADD TO CART
     ========================================================== */

  const addToCart = (dish) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === dish.id
      )

      if (existing) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...dish,
          quantity: 1,
        },
      ]
    })
  }

  /* ==========================================================
     INCREASE QUANTITY
     ========================================================== */

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  /* ==========================================================
     DECREASE QUANTITY
     ========================================================== */

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    )
  }

  /* ==========================================================
     REMOVE FROM CART
     ========================================================== */

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    )
  }

  /* ==========================================================
     CLEAR CART
     ========================================================== */

  const clearCart = () => {
    setCart([])
  }

  /* ==========================================================
     FILTER MENU
     ========================================================== */

  const filteredDishes = menu.filter((dish) => {
    const dishName = String(
      dish.name || ""
    ).toLowerCase()

    const dishCategory = String(
      dish.category || ""
    )

    const searchText =
      search.toLowerCase().trim()

    const matchesSearch =
      dishName.includes(searchText)

    const matchesCategory =
      category === "All" ||
      dishCategory === category

    return (
      matchesSearch &&
      matchesCategory
    )
  })

  /* ==========================================================
     CART COUNT
     ========================================================== */

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  )

  /* ==========================================================
     CART TOTAL
     ========================================================== */

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  )

  /* ==========================================================
     TRACK ORDER
     ========================================================== */

  const trackOrder = async (
    event,
    customOrderId = null,
    customPhone = null
  ) => {
    if (event) {
      event.preventDefault()
    }

    const orderId =
      customOrderId !== null
        ? String(customOrderId).trim()
        : trackingOrderId.trim()

    const phone =
      customPhone !== null
        ? String(customPhone).trim()
        : trackingPhone.trim()

    if (!orderId) {
      setTrackingError(
        "Please enter your Order ID."
      )
      return
    }

    if (!phone) {
      setTrackingError(
        "Please enter your phone number."
      )
      return
    }

    setTrackingLoading(true)
    setTrackingError("")

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${encodeURIComponent(
          orderId
        )}?phone=${encodeURIComponent(phone)}`
      )

      if (!response.ok) {
        throw new Error(
          "Unable to find this order."
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setTrackingOrder(data)
    } catch (error) {
      console.error(
        "Order tracking error:",
        error
      )

      setTrackingOrder(null)

      setTrackingError(
        error.message ||
          "Unable to find your order. Please check your Order ID and phone number."
      )
    } finally {
      setTrackingLoading(false)
    }
  }

  /* ==========================================================
     AUTO REFRESH ORDER STATUS
     ========================================================== */

  useEffect(() => {
    if (
      !trackingOrder ||
      !trackingOrder.id ||
      !trackingPhone.trim()
    ) {
      return undefined
    }

    const refreshOrder = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/orders/${encodeURIComponent(
            trackingOrder.id
          )}?phone=${encodeURIComponent(
            trackingPhone.trim()
          )}`
        )

        if (!response.ok) {
          return
        }

        const data = await response.json()

        if (!data.error) {
          setTrackingOrder(data)
        }
      } catch (error) {
        console.error(
          "Automatic order refresh error:",
          error
        )
      }
    }

    const interval = setInterval(
      refreshOrder,
      10000
    )

    return () =>
      clearInterval(interval)
  }, [
    trackingOrder,
    trackingPhone,
  ])

  /* ==========================================================
     PLACE ORDER
     ========================================================== */

  const placeOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name.")
      return
    }

    if (!customerPhone.trim()) {
      alert(
        "Please enter your phone number."
      )
      return
    }

    if (customerPhone.trim().length < 10) {
      alert(
        "Please enter a valid phone number."
      )
      return
    }

    if (cart.length === 0) {
      alert("Your cart is empty.")
      return
    }

    setOrderLoading(true)

    const orderData = {
      customer_name:
        customerName.trim(),
      phone:
        customerPhone.trim(),
      items: cart.map((item) => ({
        dish_id: item.id,
        quantity: item.quantity,
      })),
    }

    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            orderData
          ),
        }
      )

      if (!response.ok) {
        throw new Error(
          "Order API returned an error"
        )
      }

      const data =
        await response.json()

      console.log(
        "Order response:",
        data
      )

      if (data.error) {
        throw new Error(
          data.error
        )
      }

      const createdOrderId =
        data.order_id ??
        data.id ??
        data.order?.id ??
        data.order?.order_id

      const createdPhone =
        customerPhone.trim()

      /* ======================================================
         SAVE TRACKING INFORMATION
         ====================================================== */

      if (
        createdOrderId !== undefined &&
        createdOrderId !== null
      ) {
        setTrackingOrderId(
          String(createdOrderId)
        )

        setTrackingPhone(
          createdPhone
        )

        setTrackingError("")

        try {
          const trackingResponse =
            await fetch(
              `${API_URL}/api/orders/${encodeURIComponent(
                createdOrderId
              )}?phone=${encodeURIComponent(
                createdPhone
              )}`
            )

          if (trackingResponse.ok) {
            const trackingData =
              await trackingResponse.json()

            if (
              !trackingData.error
            ) {
              setTrackingOrder(
                trackingData
              )
            }
          }
        } catch (trackingError) {
          console.error(
            "Initial order tracking error:",
            trackingError
          )
        }
      }

      /* ======================================================
         SHOW ORDER SUCCESS
         ====================================================== */

      setOrderSuccess({
        orderId:
          createdOrderId !== undefined
            ? createdOrderId
            : null,
        name:
          customerName.trim(),
        phone:
          createdPhone,
        total:
          cartTotal,
      })

      setCart([])
      setCustomerName("")
      setCustomerPhone("")
      setShowCheckout(false)
    } catch (error) {
      console.error(
        "Order submission error:",
        error
      )

      alert(
        "Unable to place the order.\n\nPlease make sure the SEFRON HOUSE backend is running."
      )
    } finally {
      setOrderLoading(false)
    }
  }

  /* ==========================================================
     RESERVE TABLE
     ========================================================== */

  const reserveTable = async () => {
    if (!reservationName.trim()) {
      alert("Please enter your name.")
      return
    }

    if (!reservationPhone.trim()) {
      alert(
        "Please enter your phone number."
      )
      return
    }

    if (
      reservationPhone.trim().length <
      10
    ) {
      alert(
        "Please enter a valid phone number."
      )
      return
    }

    if (!reservationDate) {
      alert(
        "Please select a reservation date."
      )
      return
    }

    if (!reservationTime) {
      alert(
        "Please select a reservation time."
      )
      return
    }

    if (
      !reservationGuests ||
      reservationGuests < 1 ||
      reservationGuests > 20
    ) {
      alert(
        "Please select between 1 and 20 guests."
      )
      return
    }

    setReservationLoading(true)

    const reservationData = {
      customer_name:
        reservationName.trim(),
      phone:
        reservationPhone.trim(),
      reservation_date:
        reservationDate,
      reservation_time:
        reservationTime,
      guests:
        Number(reservationGuests),
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            reservationData
          ),
        }
      )

      if (!response.ok) {
        throw new Error(
          "Reservation API returned an error"
        )
      }

      const data =
        await response.json()

      console.log(
        "Reservation response:",
        data
      )

      if (data.error) {
        throw new Error(
          data.error
        )
      }

      setReservationSuccess({
        reservationId:
          data.reservation_id ??
          data.id ??
          "Pending",
        name:
          reservationName.trim(),
        date:
          reservationDate,
        time:
          reservationTime,
        guests:
          Number(reservationGuests),
      })

      setReservationName("")
      setReservationPhone("")
      setReservationDate("")
      setReservationTime("")
      setReservationGuests(2)
      setShowBooking(false)
    } catch (error) {
      console.error(
        "Reservation submission error:",
        error
      )

      alert(
        "Unable to reserve the table.\n\nPlease make sure the SEFRON HOUSE backend is running."
      )
    } finally {
      setReservationLoading(false)
    }
  }

  /* ==========================================================
     ADMIN LOGIN
     ========================================================== */

  const handleAdminLogin = () => {
    setAdminAuthenticated(true)
  }

  /* ==========================================================
     ADMIN LOGOUT
     ========================================================== */

  const handleAdminLogout = () => {
    localStorage.removeItem(
      "sefron_admin_token"
    )

    localStorage.removeItem(
      "sefron_admin_username"
    )

    setAdminAuthenticated(false)

    window.location.href = "/"
  }

  /* ==========================================================
     ADMIN PAGE
     ========================================================== */

  if (isAdmin) {
    if (!adminAuthenticated) {
      return (
        <AdminLogin
          onLogin={handleAdminLogin}
        />
      )
    }

    return (
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={handleAdminLogout}
          style={{
            position: "fixed",
            top: "18px",
            right: "24px",
            zIndex: 9999,
            padding: "10px 16px",
            border: "none",
            borderRadius: "999px",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>

        <AdminPanel />
      </div>
    )
  }

  /* ==========================================================
     MAIN WEBSITE
     ========================================================== */

  return (
    <div className="app">

      {/* ======================================================
          BACKEND CONNECTION
          ====================================================== */}

      <div
        style={{
          padding: "8px 16px",
          textAlign: "center",
          background: "#111",
          color: "#fff",
          fontSize: "13px",
        }}
      >
        {backendMessage}
      </div>

      {/* ======================================================
          NAVBAR
          ====================================================== */}

      <nav className="navbar">

        <div className="brand">

          <span className="brand-mark">
            S
          </span>

          <div>
            <h2>
              SEFRON HOUSE
            </h2>

            <p>
              Multi-Cuisine Restaurant
            </p>
          </div>

        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#menu">
            Menu
          </a>

          <a href="#about">
            About
          </a>

          <a href="#contact">
            Contact
          </a>

          <button
            className="book-button"
            onClick={() =>
              setShowBooking(true)
            }
          >
            Book a Table
          </button>

          <button
            className="book-button"
            onClick={() => {
              window.location.href =
                "/?admin=true"
            }}
          >
            Admin Orders
          </button>

        </div>

      </nav>

      {/* ======================================================
          HERO
          ====================================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="section-label">
            WELCOME TO SEFRON HOUSE
          </p>

          <h1>
            A World of Flavours,
            <br />
            <span>
              Under One Roof.
            </span>
          </h1>

          <p className="hero-description">
            From authentic South Indian
            classics to North Indian,
            Chinese, Italian and global
            favourites.
          </p>

          <div className="hero-buttons">

            <a
              href="#menu"
              className="primary-button"
            >
              Explore Menu
            </a>

            <button
              className="secondary-button"
              onClick={() =>
                setShowBooking(true)
              }
            >
              Reserve a Table
            </button>

          </div>

        </div>

      </section>

      {/* ======================================================
          MENU
          ====================================================== */}

      <section
        className="menu-section"
        id="menu"
      >

        <div className="section-heading">

          <p className="section-label">
            OUR MENU
          </p>

          <h2>
            Something for
            <br />
            <span>
              Every Craving.
            </span>
          </h2>

          <p>
            Explore flavours from across
            India and around the world.
          </p>

        </div>

        <div className="menu-controls">

          <input
            type="text"
            placeholder="Search for a dish..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <div className="category-buttons">

            {categories.map(
              (item) => (

                <button
                  key={item}
                  className={
                    category === item
                      ? "active-category"
                      : ""
                  }
                  onClick={() =>
                    setCategory(item)
                  }
                >
                  {item}
                </button>

              )
            )}

          </div>

        </div>

        {menuLoading ? (

          <div className="no-results">

            <h3>
              Loading menu...
            </h3>

            <p>
              Connecting to SEFRON HOUSE
              menu server.
            </p>

          </div>

        ) : (

          <div className="menu-grid">

            {filteredDishes.length > 0 ? (

              filteredDishes.map(
                (dish) => (

                  <article
                    className="dish-card"
                    key={dish.id}
                  >

                    <div className="dish-image">

                      <img
                        src={dish.image || defaultFoodImage}
                        alt={`${dish.name} - ${dish.category}`}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src =
                            defaultFoodImage
                          event.currentTarget.onerror = null
                        }}
                      />

                      <span className="dish-category">
                        {dish.category}
                      </span>

                    </div>

                    <div className="dish-content">

                      <h3>
                        {dish.name}
                      </h3>

                      <div className="dish-bottom">

                        <span className="price">
                          ₹{dish.price}
                        </span>

                        <button
                          className="add-button"
                          onClick={() =>
                            addToCart(
                              dish
                            )
                          }
                        >
                          + Add
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )

            ) : (

              <div className="no-results">

                <h3>
                  No dishes found
                </h3>

                <p>
                  Try another search or
                  category.
                </p>

              </div>

            )}

          </div>

        )}

      </section>

      {/* ======================================================
          RESERVATION STATUS
          ====================================================== */}

      <ReservationStatus />

      {/* ======================================================
          CART BAR
          ====================================================== */}

      {cartCount > 0 && (

        <div className="cart-bar">

          <div>

            <strong>
              {cartCount}{" "}
              {cartCount === 1
                ? "item"
                : "items"}
            </strong>

            <span>
              {" "}• ₹{cartTotal}
            </span>

          </div>

          <a
            href="#cart"
            className="cart-view-button"
          >
            View Cart
          </a>

        </div>

      )}

      {/* ======================================================
          CART
          ====================================================== */}

      <section
        className="cart-section"
        id="cart"
      >

        <div className="section-heading">

          <p className="section-label">
            YOUR ORDER
          </p>

          <h2>
            Your Cart
          </h2>

        </div>

        {cart.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add some delicious dishes
              from our menu.
            </p>

            <a href="#menu">
              Explore our menu
            </a>

          </div>

        ) : (

          <div className="cart-container">

            {/* CART ITEMS */}

            <div className="cart-items-list">

              {cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-info">

                    <div className="cart-item-image">

                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none"
                        }}
                      />

                    </div>

                    <div className="cart-item-details">

                      <h3>
                        {item.name}
                      </h3>

                      <p className="cart-item-category">
                        {item.category}
                      </p>

                      <p className="cart-item-price">
                        ₹{item.price} each
                      </p>

                    </div>

                  </div>

                  <div className="cart-item-actions">

                    <div className="quantity-controls">

                      <button
                        type="button"
                        aria-label={`Decrease ${item.name}`}
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name}`}
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <strong className="cart-item-total">
                      ₹
                      {Number(
                        item.price
                      ) *
                        item.quantity}
                    </strong>

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(
                          item.id
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* CART SUMMARY */}

            <div className="cart-summary">

              <div className="cart-summary-row">

                <span>
                  Items
                </span>

                <strong>
                  {cartCount}
                </strong>

              </div>

              <div className="cart-summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{cartTotal}
                </strong>

              </div>

              <div className="cart-summary-row cart-summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{cartTotal}
                </strong>

              </div>

            </div>

            {/* CART ACTIONS */}

            <div className="cart-actions">

              <a
                href="#menu"
                className="continue-shopping"
              >
                ← Continue Shopping
              </a>

              <button
                type="button"
                className="clear-cart-button"
                onClick={clearCart}
              >
                Clear Cart
              </button>

            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={() =>
                setShowCheckout(true)
              }
            >
              Proceed to Checkout
            </button>

          </div>

        )}

      </section>

      {/* ======================================================
          CHECKOUT MODAL
          ====================================================== */}

      {showCheckout && (

        <div className="booking-overlay">

          <div className="booking-modal checkout-modal">

            <button
              className="booking-close"
              type="button"
              onClick={() =>
                setShowCheckout(false)
              }
            >
              ×
            </button>

            <p className="section-label">
              CHECKOUT
            </p>

            <h2>
              Complete Your Order
            </h2>

            <p>
              Enter your details to place
              your SEFRON HOUSE order.
            </p>

            <div className="checkout-summary">

              <div className="checkout-summary-header">

                <h3>
                  Order Summary
                </h3>

                <span>
                  {cartCount}{" "}
                  {cartCount === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              <div className="checkout-summary-list">

                {cart.map((item) => (

                  <div
                    className="checkout-summary-item"
                    key={item.id}
                  >

                    <div className="checkout-summary-item-info">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </span>

                    </div>

                    <strong className="checkout-summary-item-total">
                      ₹
                      {Number(
                        item.price
                      ) *
                        item.quantity}
                    </strong>

                  </div>

                ))}

              </div>

              <div className="checkout-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{cartTotal}
                </strong>

              </div>

            </div>

            <div className="checkout-form">

              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) =>
                  setCustomerPhone(
                    e.target.value
                  )
                }
              />

            </div>

            <p className="checkout-note">
              Your order will be sent to
              SEFRON HOUSE for processing.
            </p>

            <button
              className="reserve-button"
              onClick={placeOrder}
              disabled={
                orderLoading ||
                cart.length === 0
              }
            >
              {orderLoading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </div>

        </div>

      )}

      {/* ======================================================
          ORDER SUCCESS POPUP
          ====================================================== */}

      {orderSuccess && (

        <div className="booking-overlay">

          <div className="booking-modal reservation-success-modal">

            <button
              className="booking-close"
              type="button"
              onClick={() =>
                setOrderSuccess(null)
              }
            >
              ×
            </button>

            <div className="success-icon">
              ✓
            </div>

            <p className="section-label">
              ORDER RECEIVED
            </p>

            <h2>
              Order Placed!
            </h2>

            <p>
              Thank you,{" "}
              {orderSuccess.name}.
              <br />
              Your order has been received
              successfully.
            </p>

            <div className="reservation-summary">

              <div>
                <span>
                  Order ID
                </span>

                <strong>
                  {orderSuccess.orderId !==
                  null
                    ? `#${orderSuccess.orderId}`
                    : "Generated"}
                </strong>
              </div>

              <div>
                <span>
                  Total
                </span>

                <strong>
                  ₹{orderSuccess.total}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  New
                </strong>
              </div>

            </div>

            <div className="reservation-pending-message">

              <strong>
                Order Status: New
              </strong>

              <p>
                Your order has been sent to
                the SEFRON HOUSE kitchen.
              </p>

            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent:
                  "center",
              }}
            >

              {orderSuccess.orderId !==
                null && (

                <button
                  className="reserve-button"
                  onClick={() => {
                    setTrackingOrderId(
                      String(
                        orderSuccess.orderId
                      )
                    )

                    setTrackingPhone(
                      orderSuccess.phone
                    )

                    setTrackingError("")

                    setOrderSuccess(null)

                    setTimeout(() => {
                      document
                        .getElementById(
                          "order-tracking"
                        )
                        ?.scrollIntoView({
                          behavior:
                            "smooth",
                        })
                    }, 100)
                  }}
                >
                  Track Order
                </button>

              )}

              <button
                className="reserve-button"
                onClick={() =>
                  setOrderSuccess(null)
                }
              >
                Done
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          ORDER TRACKING
          ====================================================== */}

      <section
        className="order-tracking-section"
        id="order-tracking"
      >

        <div className="section-heading">

          <p className="section-label">
            ORDER TRACKING
          </p>

          <h2>
            Track Your Order
          </h2>

          <p>
            Enter your Order ID and phone
            number to check your order status.
          </p>

        </div>

        <div className="order-tracking-container">

          <form
            className="order-tracking-form"
            onSubmit={trackOrder}
          >

            <input
              type="text"
              placeholder="Order ID"
              value={trackingOrderId}
              onChange={(e) =>
                setTrackingOrderId(
                  e.target.value
                )
              }
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={trackingPhone}
              onChange={(e) =>
                setTrackingPhone(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              className="reserve-button"
              disabled={trackingLoading}
            >
              {trackingLoading
                ? "Checking..."
                : "Track Order"}
            </button>

          </form>

          {trackingError && (

            <div className="tracking-error">

              <strong>
                Unable to find order
              </strong>

              <p>
                {trackingError}
              </p>

            </div>

          )}

          {trackingOrder && (

            <div className="order-tracking-result">

              <div className="tracking-result-header">

                <div>

                  <p className="section-label">
                    ORDER
                  </p>

                  <h3>
                    #
                    {trackingOrder.id ??
                      trackingOrder.order_id}
                  </h3>

                </div>

                <div className="tracking-current-status">

                  <span>
                    Current Status
                  </span>

                  <strong>
                    {trackingOrder.status ||
                      "New"}
                  </strong>

                </div>

              </div>

              <div className="tracking-order-details">

                <div>
                  <span>
                    Customer
                  </span>

                  <strong>
                    {trackingOrder.customer_name ||
                      trackingOrder.name ||
                      "Customer"}
                  </strong>
                </div>

                <div>
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      trackingOrder.total ||
                        trackingOrder.total_amount ||
                        0
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Order Time
                  </span>

                  <strong>
                    {formatOrderDateTime(
                      trackingOrder.created_at ||
                        trackingOrder.order_date ||
                        trackingOrder.created
                    )}
                  </strong>
                </div>

              </div>

              <div className="order-status-timeline">

                {orderStatuses.map(
                  (
                    status,
                    index
                  ) => {

                    const currentIndex =
                      getOrderStatusIndex(
                        trackingOrder.status
                      )

                    const isCompleted =
                      index <=
                      currentIndex

                    const isCurrent =
                      index ===
                      currentIndex

                    return (

                      <div
                        className={`order-status-step ${
                          isCompleted
                            ? "completed"
                            : ""
                        } ${
                          isCurrent
                            ? "current"
                            : ""
                        }`}
                        key={status}
                      >

                        <div className="status-step-icon">

                          {isCompleted
                            ? "✓"
                            : index + 1}

                        </div>

                        <div className="status-step-content">

                          <strong>
                            {status}
                          </strong>

                          {isCurrent && (

                            <span>
                              Current
                            </span>

                          )}

                        </div>

                      </div>

                    )
                  }
                )}

              </div>

              <div className="tracking-status-message">

                <strong>
                  {trackingOrder.status ||
                    "New"}
                </strong>

                <p>
                  {getOrderStatusMessage(
                    trackingOrder.status
                  )}
                </p>

              </div>

              <p className="tracking-refresh-note">
                Order status automatically
                refreshes every 10 seconds.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* ======================================================
          ABOUT
          ====================================================== */}

      <section
        className="about-section"
        id="about"
      >

        <div>

          <p className="section-label">
            ABOUT SEFRON HOUSE
          </p>

          <h2>
            One Table.
            <br />
            <span>
              Many Cultures.
            </span>
          </h2>

          <p>
            SEFRON HOUSE brings together
            the comfort of South Indian
            classics, the richness of North
            Indian cuisine, the energy of
            Chinese flavours and the elegance
            of Italian favourites.
          </p>

          <p>
            Whether you are here for a quick
            breakfast, family dinner, business
            lunch or a special celebration,
            there is something for everyone.
          </p>

        </div>

      </section>

      {/* ======================================================
          CONTACT
          ====================================================== */}

      <section
        className="contact-section"
        id="contact"
      >

        <p className="section-label">
          GET IN TOUCH
        </p>

        <h2>
          Visit SEFRON HOUSE
        </h2>

        <p>
          Experience a complete
          multi-cuisine dining experience
          under one roof.
        </p>

        <div className="contact-details">

          <span>
            📍 Your Restaurant Address
          </span>

          <span>
            📞 +91 XXXXX XXXXX
          </span>

          <span>
            ✉️ hello@sefronhouse.com
          </span>

        </div>

      </section>

      {/* ======================================================
          BOOKING MODAL
          ====================================================== */}

      {showBooking && (

        <div className="booking-overlay">

          <div className="booking-modal">

            <button
              className="booking-close"
              type="button"
              onClick={() =>
                setShowBooking(false)
              }
            >
              ×
            </button>

            <p className="section-label">
              RESERVATION
            </p>

            <h2>
              Book a Table
            </h2>

            <p>
              Reserve your table at
              SEFRON HOUSE.
            </p>

            <input
              type="text"
              placeholder="Your Name"
              value={reservationName}
              onChange={(e) =>
                setReservationName(
                  e.target.value
                )
              }
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={reservationPhone}
              onChange={(e) =>
                setReservationPhone(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              value={reservationDate}
              onChange={(e) =>
                setReservationDate(
                  e.target.value
                )
              }
            />

            <input
              type="time"
              value={reservationTime}
              onChange={(e) =>
                setReservationTime(
                  e.target.value
                )
              }
            />

            <input
              type="number"
              placeholder="Number of Guests"
              min="1"
              max="20"
              value={reservationGuests}
              onChange={(e) =>
                setReservationGuests(
                  Number(
                    e.target.value
                  )
                )
              }
            />

            <button
              className="reserve-button"
              onClick={reserveTable}
              disabled={
                reservationLoading
              }
            >
              {reservationLoading
                ? "Reserving Table..."
                : "Reserve Table"}
            </button>

          </div>

        </div>

      )}

      {/* ======================================================
          RESERVATION SUCCESS POPUP
          ====================================================== */}

      {reservationSuccess && (

        <div className="booking-overlay">

          <div className="booking-modal reservation-success-modal">

            <button
              className="booking-close"
              type="button"
              onClick={() =>
                setReservationSuccess(
                  null
                )
              }
            >
              ×
            </button>

            <div className="success-icon">
              ✓
            </div>

            <p className="section-label">
              RESERVATION RECEIVED
            </p>

            <h2>
              Table Reserved!
            </h2>

            <p>
              Thank you,{" "}
              {reservationSuccess.name}.
              <br />
              Your reservation request has
              been received successfully.
            </p>

            <div className="reservation-summary">

              <div>
                <span>
                  Reservation ID
                </span>

                <strong>
                  #
                  {
                    reservationSuccess.reservationId
                  }
                </strong>
              </div>

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {
                    reservationSuccess.date
                  }
                </strong>
              </div>

              <div>
                <span>
                  Time
                </span>

                <strong>
                  {
                    reservationSuccess.time
                  }
                </strong>
              </div>

              <div>
                <span>
                  Guests
                </span>

                <strong>
                  {
                    reservationSuccess.guests
                  }
                </strong>
              </div>

            </div>

            <div className="reservation-pending-message">

              <strong>
                Status: Pending
              </strong>

              <p>
                Your reservation is waiting
                for confirmation from
                SEFRON HOUSE.
              </p>

            </div>

            <button
              className="reserve-button"
              onClick={() =>
                setReservationSuccess(
                  null
                )
              }
            >
              Done
            </button>

          </div>

        </div>

      )}

      {/* ======================================================
          FOOTER
          ====================================================== */}

      <footer className="footer">

        <div>

          <h3>
            SEFRON HOUSE
          </h3>

          <p>
            A world of flavours,
            under one roof.
          </p>

        </div>

        <p>
          © 2026 SEFRON HOUSE.
          All rights reserved.
        </p>

      </footer>

    </div>
  )
}

export default App