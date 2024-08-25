import React, { useState, useRef } from "react"
import RestaurantFilter from "../components/Filter"
import Map from "../components/Map"
import SearchResult from "../components/Table"
import "../css/common.css"

const Home: React.FC = () => {
  const [results, setResults] = useState<any[]>([])
  const [searchTriggered, setSearchTriggered] = useState(false)
  const mapRef = useRef<{ openInfoWindow: (placeId: string) => void }>(null)

  const handleShopClick = (placeId: string) => {
    if (mapRef.current) {
      mapRef.current.openInfoWindow(placeId)
    }
  }

  const handleResultsUpdate = (newResults: any[]) => {
    setResults(newResults)
    setSearchTriggered(true) // 検索が実行されたことを記録
  }

  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="filter-favcondition">
            <RestaurantFilter handleResultsUpdate={handleResultsUpdate} />
          </div>
        </div>
        <div className="content">
          <div className="result-title">
            <h2>検索結果</h2>
          </div>
          <div className="result-items">
            <div className="result-table">
              {searchTriggered && results.length === 0 ? (
                <div className="no-results-message">ご指定の条件に合う店舗が見つかりませんでした</div>
              ) : (
                results.length > 0 && <SearchResult results={results} onShopClick={handleShopClick} />
              )}
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
