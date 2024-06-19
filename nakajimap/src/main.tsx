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
function loadGoogleMapsApi(): void {
  const script = document.createElement("script")
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLEMAP_API_KEY
  }&callback=initMap&libraries=places`
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

// スクリプトのロードを開始
loadGoogleMapsApi()
