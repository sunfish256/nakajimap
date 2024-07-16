/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef } from "react"

declare global {
  interface Window {
    initMap: () => void
  }
}

interface MapProps {
  results: any[]
}

const Map: React.FC<MapProps> = ({ results }) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]) // マップに表示されているピンを格納し管理するフック
  const currentInfoWindowRef = useRef<google.maps.InfoWindow | null>(null) // 表示されるinfoWindowを管理するフック

  const initMap = () => {
    if (mapRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 35.681236, lng: 139.767125 }, // 東京駅の座標
        zoom: 15, // ズームレベルを調整
      })
    }
  }

  useEffect(() => {
    // Google Maps APIがロードされているかチェック
    if (typeof google !== "undefined" && google.maps) {
      initMap()
    } else {
      window.initMap = initMap
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current) {
      // 既存のマーカーを全て削除
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])

      const newMarkers: google.maps.Marker[] = []
      const bounds = new google.maps.LatLngBounds()

      results.forEach((result) => {
        // console.log(result)
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
            // 既存の情報ウィンドウがある場合は閉じる
            if (currentInfoWindowRef.current) {
              currentInfoWindowRef.current.close()
            }

            // 新しい情報ウィンドウを開く
            infoWindow.open(mapInstanceRef.current, marker)
            // 現在の情報ウィンドウを更新
            currentInfoWindowRef.current = infoWindow
          })

          newMarkers.push(marker)
          bounds.extend(marker.getPosition() as google.maps.LatLng)
        } else {
          console.error("Invalid lat or lng value:", lat, lng)
        }
      })

      // マーカーの配列を更新
      setMarkers(newMarkers)

      // 最後のピンの位置にマップの中心を移動
      if (newMarkers.length > 0) {
        mapInstanceRef.current.fitBounds(bounds)
      }
    }
  }, [results])

  return <div ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
}

export default Map
