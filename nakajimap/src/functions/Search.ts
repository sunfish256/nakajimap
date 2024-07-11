export const searchNearbyRestaurants = (location: string, radius: number, minBudget: number, maxBudget: number, cuisine: string, reviewCount: number, rating: number) => {

  return new Promise((resolve, reject) => {

    // mapを初期化(Map.tsxのmapオブジェクトとは別物)
    const map = new google.maps.Map(document.createElement('div'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    })    

    // Geocode APIを使用して住所を座標に変換
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${import.meta.env.VITE_GOOGLEMAP_API_KEY}`

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== "OK") {
          reject(new Error("Geocode was not successful for the following reason: " + data.status))
          return
        }

        const { lat, lng } = data.results[0].geometry.location

        // PlacesServiceのインスタンスを作成
        const service = new google.maps.places.PlacesService(map)

        // レストランを検索
        const request = {
          location: new google.maps.LatLng(lat, lng),
          radius: radius,
          type: ["restaurant"],
          keyword: cuisine,
          minPriceLevel: minBudget,
          maxPriceLevel: maxBudget          
        }

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // 口コミ数と評価のフィルタリングを適用
            const filteredResults = results.filter(place => {
              return (
                (place.user_ratings_total >= reviewCount) &&
                (place.rating >= rating)
              )
            })
            resolve(filteredResults)
          } else {
            reject(new Error("PlacesService was not successful for the following reason: " + status))
          }
        })
      })
      .catch((error) => reject(error))
  })
}