/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"

declare global {
  interface Window {
    initMap: () => void
  }
}

interface MapProps {
  results: any[]
  onMarkerClick: (placeId: string) => void
}

const Map = forwardRef(({ results, onMarkerClick }: MapProps, ref) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<
    { marker: google.maps.Marker; infoWindow: google.maps.InfoWindow; placeId: string }[]
  >([])
  const currentInfoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  const initMap = () => {
    if (mapRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 35.681236, lng: 139.767125 },
        zoom: 15,
      })
    }
  }

  useEffect(() => {
    if (typeof google !== "undefined" && google.maps) {
      initMap()
    } else {
      window.initMap = initMap
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current) {
      markers.forEach(({ marker }) => marker.setMap(null))
      setMarkers([])

      const newMarkers: { marker: google.maps.Marker; infoWindow: google.maps.InfoWindow; placeId: string }[] = []
      const bounds = new google.maps.LatLngBounds()

      results.forEach((result) => {
        const lat =
          typeof result.geometry.location.lat === "function"
            ? result.geometry.location.lat()
            : result.geometry.location.lat
        const lng =
          typeof result.geometry.location.lng === "function"
            ? result.geometry.location.lng()
            : result.geometry.location.lng

        if (typeof lat === "number" && typeof lng === "number") {
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: result.name,
          })

          const statusText =
            result.business_status === "OPERATIONAL"
              ? "営業中"
              : result.business_status === "CLOSED_TEMPORARILY"
              ? "営業時間外"
              : result.business_status === "CLOSED_PERMANENTLY"
              ? "閉店"
              : ""

          const infoWindowContent = `
            <div>
              <p style="font-weight: bold; font-size: 1.2em;">${result.name}</p>
              <p>${result.vicinity}</p>
              <p>評価：${result.rating}　口コミ数：${result.user_ratings_total}　${statusText}</p>
              <p><a href="https://www.google.com/maps/place/?q=place_id:${result.place_id}" target="_blank">
              グーグルマップで見る</a></p>
            </div>
          `

          const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
          })

          marker.addListener("click", () => {
            if (currentInfoWindowRef.current) {
              currentInfoWindowRef.current.close()
            }

            infoWindow.open(mapInstanceRef.current, marker)
            currentInfoWindowRef.current = infoWindow
          })

          newMarkers.push({ marker, infoWindow, placeId: result.place_id })
          bounds.extend(marker.getPosition() as google.maps.LatLng)
        } else {
          console.error("Invalid lat or lng value:", lat, lng)
        }
      })

      setMarkers(newMarkers)

      if (newMarkers.length > 0) {
        mapInstanceRef.current.fitBounds(bounds)
      }
    }
  }, [results])

  useImperativeHandle(ref, () => ({
    openInfoWindow(placeId: string) {
      const markerData = markers.find((marker) => marker.placeId === placeId)
      if (markerData) {
        if (currentInfoWindowRef.current) {
          currentInfoWindowRef.current.close()
        }
        markerData.infoWindow.open(mapInstanceRef.current, markerData.marker)
        currentInfoWindowRef.current = markerData.infoWindow
      }
    },
  }))

  return <div ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
})

export default Map
