import React, { useState } from "react"
import RestaurantFilter from "../components/Filter"
import Map from "../components/Map"
import SearchResult from "../components/Table"
import "../css/common.css"

const Home: React.FC = () => {
  const [results, setResults] = useState<any[]>([])

  return (
    <div>
      {/* <div className="sticky-header">
        <h1>ここにロゴ・サイト名・ハンバーガーを配置する</h1>
      </div> */}
      <div className="container">
        <div className="content">
          <div className="filter">
            <RestaurantFilter setResults={setResults}/>
          </div>
        </div>
        <div className="content">
          <div className="result-title">
            <h2>検索結果</h2>
          </div>
          <div className="result-items">
            <div className="result-table">
              <SearchResult rows={results}/>
            </div>
            <div className="result-map">
              <Map results={results}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
