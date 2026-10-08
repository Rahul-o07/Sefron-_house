import { useEffect, useState } from "react"

const API_URL = "http://127.0.0.1:8000"

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
  })

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem(
      "sefron_admin_token"
    )
  }

  // =====================================================
  // HANDLE AUTH ERROR
  // =====================================================

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

  // =====================================================
  // FETCH MENU
  // =====================================================

  const fetchMenu = async () => {
    try {
      setLoading(true)

      const token = getAdminToken()

      if (!token) {
        handleAuthError()
        return
      }

      const response = await fetch(
        `${API_URL}/api/menu`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      // Token expired / invalid
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError()
        return
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch menu"
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
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // LOAD MENU
  // =====================================================

  useEffect(() => {
    fetchMenu()
  }, [])

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    )
  }

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setEditingItem(null)

    setFormData({
      name: "",
      category: "",
      price: "",
    })

    setShowForm(true)
  }

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (item) => {
    setEditingItem(item)

    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
    })

    setShowForm(true)
  }

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false)
    setEditingItem(null)

    setFormData({
      name: "",
      category: "",
      price: "",
    })
  }

  // =====================================================
  // SAVE MENU ITEM
  // =====================================================

  const saveMenuItem = async (e) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.price
    ) {
      alert(
        "Please fill all fields."
      )
      return
    }

    try {
      setSaving(true)

      const token =
        getAdminToken()

      if (!token) {
        handleAuthError()
        return
      }

      const url = editingItem
        ? `${API_URL}/api/menu/${editingItem.id}`
        : `${API_URL}/api/menu`

      const method = editingItem
        ? "PUT"
        : "POST"

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name:
              formData.name.trim(),

            category:
              formData.category.trim(),

            price:
              Number(
                formData.price
              ),
          }),
        })

      // =================================================
      // TOKEN EXPIRED / INVALID
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError()
        return
      }

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            data.message ||
            "Failed to save menu item"
        )
      }

      closeForm()

      await fetchMenu()

      alert(
        editingItem
          ? "Menu item updated successfully."
          : "Menu item added successfully."
      )
    } catch (error) {
      console.error(
        "Failed to save menu item:",
        error
      )

      alert(
        error.message ||
          "Failed to save menu item. Check the backend."
      )
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // DELETE MENU ITEM
  // =====================================================

  const deleteMenuItem = async (item) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.name}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(item.id)

      const token =
        getAdminToken()

      if (!token) {
        handleAuthError()
        return
      }

      const response =
        await fetch(
          `${API_URL}/api/menu/${item.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      // =================================================
      // TOKEN EXPIRED / INVALID
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError()
        return
      }

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            data.message ||
            "Failed to delete menu item"
        )
      }

      await fetchMenu()

      alert(
        "Menu item deleted successfully."
      )
    } catch (error) {
      console.error(
        "Failed to delete menu item:",
        error
      )

      alert(
        error.message ||
          "Failed to delete menu item."
      )
    } finally {
      setDeletingId(null)
    }
  }

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    ...new Set(
      menuItems.map(
        (item) =>
          item.category
      )
    ),
  ]

  // =====================================================
  // FILTER MENU
  // =====================================================

  const filteredItems =
    menuItems.filter(
      (item) => {
        const itemName =
          String(
            item.name || ""
          )

        const itemCategory =
          String(
            item.category || ""
          )

        const matchesSearch =
          itemName
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

        const matchesCategory =
          category === "All" ||
          itemCategory ===
            category

        return (
          matchesSearch &&
          matchesCategory
        )
      }
    )

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-content-page">

      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-heading">

        <p className="admin-eyebrow">
          MENU MANAGEMENT
        </p>

        <h1>
          Menu
        </h1>

        <p>
          Manage your restaurant dishes
          and menu items.
        </p>

      </div>


      {/* =================================================
          MENU SECTION
      ================================================== */}

      <section className="menu-management-section">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="menu-management-header">

          <div>

            <h2>
              All Menu Items
            </h2>

            <p>
              {filteredItems.length} item
              {filteredItems.length !==
              1
                ? "s"
                : ""}
            </p>

          </div>


          <div className="menu-header-actions">

            {/* REFRESH */}

            <button
              className="admin-refresh-button"
              onClick={fetchMenu}
              disabled={loading}
            >
              {loading
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>


            {/* ADD DISH */}

            <button
              className="menu-add-button"
              onClick={
                openAddForm
              }
            >
              + Add Dish
            </button>

          </div>

        </div>


        {/* =================================================
            SEARCH
        ================================================== */}

        <div className="menu-controls">

          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="menu-search"
          />

        </div>


        {/* =================================================
            CATEGORY FILTER
        ================================================== */}

        <div className="menu-category-filters">

          {categories.map(
            (
              itemCategory
            ) => (

              <button
                key={
                  itemCategory
                }
                className={
                  category ===
                  itemCategory
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(
                    itemCategory
                  )
                }
              >
                {itemCategory}
              </button>

            )
          )}

        </div>


        {/* =================================================
            MENU GRID
        ================================================== */}

        {loading ? (

          <div className="admin-empty">

            <div className="empty-icon">
              🍽️
            </div>

            <h3>
              Loading menu...
            </h3>

          </div>

        ) : filteredItems.length ===
          0 ? (

          <div className="admin-empty">

            <div className="empty-icon">
              🔍
            </div>

            <h3>
              No dishes found
            </h3>

            <p>
              Try a different search or
              category.
            </p>

          </div>

        ) : (

          <div className="menu-grid">

            {filteredItems.map(
              (item) => (

                <div
                  className="menu-admin-card"
                  key={item.id}
                >

                  {/* CARD TOP */}

                  <div className="menu-admin-card-top">

                    <div className="menu-admin-icon">
                      🍽️
                    </div>

                    <span className="menu-item-id">
                      #{item.id}
                    </span>

                  </div>


                  {/* CARD CONTENT */}

                  <div className="menu-admin-card-content">

                    <span className="menu-admin-category">
                      {item.category}
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <strong className="menu-admin-price">

                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>


                  {/* ACTIONS */}

                  <div className="menu-card-actions">

                    {/* EDIT */}

                    <button
                      className="menu-edit-button"
                      onClick={() =>
                        openEditForm(
                          item
                        )
                      }
                    >
                      ✏️ Edit
                    </button>


                    {/* DELETE */}

                    <button
                      className="menu-delete-button"
                      disabled={
                        deletingId ===
                        item.id
                      }
                      onClick={() =>
                        deleteMenuItem(
                          item
                        )
                      }
                    >
                      {deletingId ===
                      item.id
                        ? "Deleting..."
                        : "🗑️ Delete"}
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showForm && (

        <div
          className="menu-modal-overlay"
          onClick={
            closeForm
          }
        >

          <div
            className="menu-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="menu-modal-header">

              <div>

                <p>
                  MENU MANAGEMENT
                </p>

                <h2>
                  {editingItem
                    ? "Edit Dish"
                    : "Add New Dish"}
                </h2>

              </div>


              <button
                className="menu-modal-close"
                onClick={
                  closeForm
                }
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                saveMenuItem
              }
              className="menu-form"
            >

              {/* DISH NAME */}

              <div className="menu-form-group">

                <label>
                  Dish Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Chicken Biryani"
                  value={
                    formData.name
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* CATEGORY */}

              <div className="menu-form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  placeholder="Example: Main Course"
                  value={
                    formData.category
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* PRICE */}

              <div className="menu-form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="Example: 250"
                  min="1"
                  value={
                    formData.price
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* FORM ACTIONS */}

              <div className="menu-form-actions">

                <button
                  type="button"
                  className="menu-cancel-button"
                  onClick={
                    closeForm
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="menu-save-button"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingItem
                    ? "Save Changes"
                    : "Add Dish"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}