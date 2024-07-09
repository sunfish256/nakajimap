import React, { useState, useEffect, useContext } from "react"
import { Box, TextField, Typography, Button, MenuItem, Select } from "@mui/material"
import { query, where, collection, addDoc, getDocs } from "firebase/firestore"
import { db, auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { searchNearbyRestaurants } from "../functions/Search"
import { useAuth } from "../AuthContext"

interface FilterProps {
  setResults: React.Dispatch<React.SetStateAction<any[]>>
}

const RestaurantFilter: React.FC<FilterProps> = ({ setResults }) => {
  const { currentUser } = useAuth()
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState<number>()
  const [minBudget, setMinBudget] = useState<number>()
  const [maxBudget, setMaxBudget] = useState<number>()
  const [cuisine, setCuisine] = useState("")
  const [reviewCount, setReviewCount] = useState<number>()
  const [rating, setRating] = useState<number>()

  const [savedFilters, setSavedFilters] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState("")

  const handleSearch = async () => {
    if (!location) return
    const results = await searchNearbyRestaurants(location, radius, minBudget, maxBudget, cuisine, reviewCount, rating)
    console.log(results) // 検索結果を表示するためのログ
    setResults(results) // 親コンポーネントの状態を更新
  }

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "filters"), {
        userId: currentUser.uid,
        location,
        radius,
        minBudget,
        maxBudget,
        cuisine,
        reviewCount,
        rating,
      })
      alert("フィルタリング条件が保存されました！")
      fetchSavedFilters()
    } catch (error) {
      console.error("Error adding document: ", error.message)
    }
  }

  const fetchSavedFilters = async () => {
    const querySnapshot = await getDocs(collection(db, "filters"))
    const filtersList: any[] = []
    querySnapshot.forEach((doc) => {
      filtersList.push({ id: doc.id, ...doc.data() })
    })
    setSavedFilters(filtersList)
  }

  useEffect(() => {
    fetchSavedFilters()
  }, [currentUser])

  const handleFilterSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    const filterId = event.target.value as string
    const selected = savedFilters.find((filter) => filter.id === filterId)
    if (selected) {
      setLocation(selected.location)
      setRadius(selected.radius)
      setMinBudget(selected.minBudget)
      setMaxBudget(selected.maxBudget)
      setCuisine(selected.cuisine)
      setReviewCount(selected.reviewCount)
      setRating(selected.rating)
    }
    setSelectedFilter(filterId)
  }

  return (
    <Box sx={{ margin: "normal" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <TextField
          label="エリア・駅"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="例: 東京駅"
          style={{ backgroundColor: "#fcfcfc" }}
        />
        <Typography sx={{ whiteSpace: "nowrap" }}>周辺</Typography>
        <TextField
          label="範囲"
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="800"
          inputProps={{ step: 100, min: 100 }}
          style={{ backgroundColor: "#fcfcfc" }}
        />
        <Typography sx={{ whiteSpace: "nowrap" }}>m以内</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="料理のジャンル"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="例: 和食"
          style={{ backgroundColor: "#fcfcfc" }}
        />
        <Typography sx={{ whiteSpace: "nowrap" }}>¥</Typography>
        <TextField
          label="予算下限"
          type="number"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          inputProps={{ step: 500, min: 0 }}
          placeholder="1000"
          style={{ backgroundColor: "#fcfcfc" }}
        />
        <Typography sx={{ whiteSpace: "nowrap" }}>~</Typography>
        <TextField
          label="予算上限"
          type="number"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          inputProps={{ step: 500, min: 0 }}
          placeholder="3000"
          style={{ backgroundColor: "#fcfcfc" }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="口コミ数はいくつ以上か"
          type="number"
          value={reviewCount}
          onChange={(e) => setReviewCount(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ step: 10, min: 0 }}
          style={{ backgroundColor: "#fcfcfc" }}
        />
        <TextField
          label="☆評価の数はいくつ以上か"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ step: 0.5, min: 0, max: 5.0 }}
          style={{ backgroundColor: "#fcfcfc" }}
        />
      </Box>
      <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="h6">お気に入りフィルタを選択:</Typography>
        <Select value={selectedFilter} onChange={handleFilterSelect} displayEmpty fullWidth>
          <MenuItem value="" disabled>
            フィルタを選択
          </MenuItem>
          {savedFilters.map((filter) => (
            <MenuItem key={filter.id} value={filter.id}>
              {`${filter.location} | ${filter.radius}m以内 | ${filter.cuisine} | ¥${filter.minBudget} - ¥${filter.maxBudget} | 口コミ${filter.reviewCount}件以上 | ☆${filter.rating}以上`}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={3} sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          検索
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleSave}>
          保存
        </Button>
      </Box>

      {/* <Box mt={4} style={{zoom: 0.8}}>
        <Typography variant="h6">入力された条件:</Typography>
        <Typography>場所: {filters.location}</Typography>
        <Typography>距離: {filters.radius} m以内</Typography>
        <Typography>
          予算: ¥{filters.budget[0]} - {filters.budget[1]}
        </Typography>
        <Typography>料理のジャンル: {filters.cuisine}</Typography>
        <Typography>口コミ数: {filters.reviewCount} 件以上</Typography>
      </Box>
      </Box> */}
    </Box>
  )
}

export default RestaurantFilter
