import "./App.css"
import Filtering from "./components/Filtering"
import Map from "./components/Map"
import SearchResult from "./components/Table"
import { Auth } from "./components/Auth"

function App() {
  return (
    <div className="container">
      {/* <Auth /> */}
      <div className="content">
        <Filtering />
      </div>
      <div className="content">
        <div className="search-result">
          <h2>検索結果</h2>
          <SearchResult />
        </div>
        <div className="map">
          <Map />
        </div>
      </div>
    </div>
  )
}

export default App
