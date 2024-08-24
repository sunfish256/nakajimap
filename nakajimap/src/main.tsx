import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

const container = document.getElementById("root")
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error("Root container not found")
}

// Google Maps APIを非同期で読み込むスクリプトを動的に追加
function loadGoogleMapsApi(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (typeof google !== "undefined" && google.maps) {
      // Google Maps APIが既にロードされている場合
      resolve()
    } else {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLEMAP_API_KEY
      }&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = (error) => reject(error)
      document.head.appendChild(script)
    }
  })
}

loadGoogleMapsApi()
  .then(() => {
    if (typeof window.initMap === "function") {
      window.initMap()
    }
  })
  .catch((error: Event) => console.error("Failed to load Google Maps API:", error))
