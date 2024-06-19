import React, { useEffect } from "react"

declare global {
  interface Window {
    initMap: () => void
  }
}

export function initMap(): void {
  const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 35.681236, lng: 139.767125 }, // 東京駅の座標
    zoom: 15, // ズームレベルを調整
  })

  // KITTE丸の内の座標
  const kitteMarunouchi = { lat: 35.679575, lng: 139.764603 }

  // KITTE丸の内にマーカーを追加
  const marker = new google.maps.Marker({
    position: kitteMarunouchi,
    map: map,
    title: "KITTE Marunouchi",
  })

  // 情報ウィンドウのコンテンツ
  const infoWindowContent = `
    <div>
      <h2>KITTE Marunouchi</h2>
      <p>KITTE Marunouchi is a shopping and dining complex located near Tokyo Station.</p>
    </div>
  `

  // 情報ウィンドウを作成
  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
  })

  // マーカーがクリックされた時のイベントリスナーを追加
  marker.addListener("click", () => {
    infoWindow.open(map, marker)
  })
}

const Map: React.FC = () => {
  useEffect(() => {
    // Google Maps APIがロードされているかチェック
    if (typeof google !== "undefined" && google.maps) {
      initMap()
    } else {
      window.initMap = initMap
    }
  }, [])

  return <div id="map" style={{ height: "433px", width: "434px" }} />
}

export default Map
