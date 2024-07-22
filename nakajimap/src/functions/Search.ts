export const searchNearbyRestaurants = (
  location: string,
  radius: number,
  cuisine: string,
  reviewCount: number,
  rating: number,
  minBudget?: number,
  maxBudget?: number  
): Promise<any[]> => {
  return new Promise<any[]>((resolve, reject) => {
    // mapを初期化(Map.tsxのmapオブジェクトとは別物)
    const map = new google.maps.Map(document.createElement("div"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    })

    // Geocode APIを使用して住所を座標に変換
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${
      import.meta.env.VITE_GOOGLEMAP_API_KEY
    }`

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
          type: "restaurant",
          keyword: cuisine,
          minPriceLevel: minBudget !== undefined ? minBudget : undefined,
          maxPriceLevel: maxBudget !== undefined ? maxBudget : undefined,
        }

        const allResults: any[] = []

        const processResults = (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus,
          pagination: google.maps.places.PlaceSearchPagination | null
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const filteredResults = results.filter((place: google.maps.places.PlaceResult) => {
              // user_ratings_total と rating が undefined でないことを確認
              if (place.user_ratings_total !== undefined && place.rating !== undefined) {
                return place.user_ratings_total >= reviewCount && place.rating >= rating;
              }
              return false
            })

            allResults.push(...filteredResults)

            if (pagination && pagination.hasNextPage) {
              // 次のページの結果を取得する
              pagination.nextPage()
            } else {
              // すべてのページの結果を取得し終えたらresolveする
              resolve(allResults)
            }
          } else {
            reject(new Error("PlacesService was not successful for the following reason: " + status))
          }
        }

        // 最初のnearbySearchを実行
        service.nearbySearch(request, processResults)
      })
      .catch((error) => reject(error))
  })
}
