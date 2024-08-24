import React, { useState, useRef } from "react"
import RestaurantFilter from "../components/Filter"
import Map from "../components/Map"
import SearchResult from "../components/Table"
import "../css/common.css"

const Home: React.FC = () => {
  const [results, setResults] = useState<any[]>([])
  const mapRef = useRef<{ openInfoWindow: (placeId: string) => void }>(null)

  const handleShopClick = (placeId: string) => {
    if (mapRef.current) {
      mapRef.current.openInfoWindow(placeId)
    }
  }

  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="filter-favcondition">
            <RestaurantFilter setResults={setResults} />
          </div>
        </div>
        <div className="content">
          <div className="result-title">
            <h2>検索結果</h2>
          </div>
          <div className="result-items">
            <div className="result-table">
              <SearchResult results={results} onShopClick={handleShopClick} />
            </div>
            <div className="result-map">
              <Map ref={mapRef} results={results} onMarkerClick={handleShopClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
