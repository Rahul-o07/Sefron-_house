import { useState } from "react"
import "./AdminLogin.css"

const API_URL = "http://127.0.0.1:8000"

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()

    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid username or password."
        )
      }

      if (!data.access_token) {
        throw new Error("Login failed. No access token received.")
      }

      // Store authentication token
      localStorage.setItem(
        "sefron_admin_token",
        data.access_token
      )

      // Store admin username
      localStorage.setItem(
        "sefron_admin_username",
        username.trim()
      )

      // Tell App.jsx that login was successful
      if (onLogin) {
        onLogin(data.access_token)
      }
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error)

      setError(
        error.message ||
        "Unable to connect to the server."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        {/* Logo */}
        <div className="admin-login-logo">
          <div className="admin-login-logo-mark">
            S
          </div>

          <div>
            <h1>SEFRON HOUSE</h1>
            <span>ADMINISTRATION</span>
          </div>
        </div>

        {/* Heading */}
        <div className="admin-login-heading">
          <p className="admin-login-label">
            PRIVATE ACCESS
          </p>

          <h2>Welcome Back</h2>

          <p>
            Sign in to manage your restaurant,
            orders, reservations and menu.
          </p>
        </div>

        {/* Login Form */}
        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          <div className="admin-input-group">

            <label htmlFor="admin-username">
              Username
            </label>

            <input
              id="admin-username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              autoComplete="username"
              disabled={loading}
            />

          </div>

          <div className="admin-input-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              disabled={loading}
            />

          </div>

          {/* Error */}
          {error && (
            <div className="admin-login-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-login-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <span>SEFRON HOUSE</span>
          <span>•</span>
          <span>Secure Admin Portal</span>
        </div>

      </div>

    </div>
  )
}