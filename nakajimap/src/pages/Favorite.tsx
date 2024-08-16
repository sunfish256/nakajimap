import React, { useState, useEffect, useRef } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"
import RestaurantFilter from "../components/Filter"
import FavoriteMap from "../components/FavoriteMap"
import FavoriteTable from "../components/FavoriteTable"
import { useAuth } from "../AuthContext"
import "../css/common.css"

const Favorite: React.FC = () => {
  const { currentUser } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])

  const mapRef = useRef<{ openInfoWindow: (placeId: string) => void }>(null)

  const handleShopClick = (placeId: string) => {
    if (mapRef.current) {
      mapRef.current.openInfoWindow(placeId)
    }
  }

  // ここでFavoriteを検索してFavoriteMapとFavoriteTableに渡す
  useEffect(() => {
    if (!currentUser) return
    console.log()
    const fetchFavorites = async () => {
      const q = query(collection(db, "favorite"), where("userId", "==", currentUser.uid))
      const querySnapshot = await getDocs(q)
      console.log(`querySnapshot ${querySnapshot}`)

      const favoritesList: any[] = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        favoritesList.push({ id: doc.id, ...doc.data() })
      })
      console.log(`favoritesList ${favoritesList}`)
      setFavorites(favoritesList)
    }

    fetchFavorites()
  }, [currentUser])

  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="result-title">
            <h2>お気に入りリスト</h2>
          </div>
          <div className="result-items">
            <div className="result-table">
              <FavoriteTable favorites={favorites} onShopClick={handleShopClick} />
            </div>
            <div className="result-map">
              <FavoriteMap ref={mapRef} favorites={favorites} onMarkerClick={handleShopClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Favorite
