import Filtering from '../components/Filtering'
import Map from '../components/Map'
import SearchResult from '../components/Table'
import "../Home.css"

const Home: React.FC = () => {
  return (
    <div>
      <div className="sticky-header">
        <h1>ここにロゴ・サイト名・ハンバーガーを配置する</h1>
      </div>
      <div className="container">
        <div className="content">
          <div className="filter">
            <Filtering />
          </div>
        </div>
        <div className="content">
          <div className="result-title">
            <h2>検索結果</h2>
          </div>
          <div className="result-items">
            <div className="result-table">
              <SearchResult />
            </div>
            <div className="result-map">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }

export default Home