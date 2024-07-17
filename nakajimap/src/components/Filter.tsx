import React, { useState, useEffect } from "react"
import { Box, TextField, Typography, Button, MenuItem, Select } from "@mui/material"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { db, auth } from "../firebase"
import { useNavigate, useLocation } from "react-router-dom"
import { searchNearbyRestaurants } from "../functions/Search"
import { useAuth } from "../AuthContext"

interface FilterProps {
  setResults: React.Dispatch<React.SetStateAction<any[]>>
}

interface SearchParams {
  location: string
  radius: number
  minBudget: number
  maxBudget: number
  cuisine: string
  reviewCount: number
  rating: number
}

const RestaurantFilter: React.FC<FilterProps> = ({ setResults }) => {
  const loc = useLocation()
  const searchParams = loc.state as SearchParams
  const { currentUser } = useAuth()
  const [location, setLocation] = useState<string>(searchParams?.location || "")
  const [radius, setRadius] = useState<number | undefined>(searchParams?.radius)
  const [minBudget, setMinBudget] = useState<number | undefined>(searchParams?.minBudget)
  const [maxBudget, setMaxBudget] = useState<number | undefined>(searchParams?.maxBudget)
  const [cuisine, setCuisine] = useState<string>(searchParams?.cuisine || "")
  const [reviewCount, setReviewCount] = useState<number | undefined>(searchParams?.reviewCount)
  const [rating, setRating] = useState<number | undefined>(searchParams?.rating)
  const [savedFilters, setSavedFilters] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState("")
  const [searchTriggered, setSearchTriggered] = useState(false)

  const priceLevels = [
    { label: "￥", p_level: 1 },
    { label: "￥￥", p_level: 2 },
    { label: "￥￥￥", p_level: 3 },
    { label: "￥￥￥￥", p_level: 4 },
  ]

  const setParams = (params: SearchParams) => {
    setLocation(params.location)
    setRadius(params.radius)
    setMinBudget(params.minBudget)
    setMaxBudget(params.maxBudget)
    setCuisine(params.cuisine)
    setReviewCount(params.reviewCount)
    setRating(params.rating)
  }

  const handleSearch = async (
    params: SearchParams = {
      location: "東京駅",
      radius: 800,
      minBudget: 1,
      maxBudget: 4,
      cuisine: "",
      reviewCount: 0,
      rating: 0,
    }
  ) => {
    setLocation(params.location)
    setRadius(params.radius)
    setMinBudget(params.minBudget)
    setMaxBudget(params.maxBudget)
    setCuisine(params.cuisine)
    setReviewCount(params.reviewCount)
    setRating(params.rating)
    setSearchTriggered(true)
  }

  useEffect(() => {
    if (searchTriggered && location && radius) {
      console.log("location", location)
      console.log("radius", radius)
      const performSearch = async () => {
        const results = await searchNearbyRestaurants(
          location,
          radius,
          minBudget,
          maxBudget,
          cuisine,
          reviewCount,
          rating
        )
        console.log(results) // 検索結果を表示するためのログ
        setResults(results) // 親コンポーネントの状態を更新
        setSearchTriggered(false) // Reset the search trigger
      }
      performSearch()
    }
  }, [searchTriggered])

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
      console.log("フィルタリング条件が保存されました！")
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
    if (searchParams) {
      console.log("searchParams", searchParams)
      handleSearch(searchParams)
    }
  }, [searchParams])

  useEffect(() => {
    fetchSavedFilters()
  }, [currentUser])

  const handleFilterSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    const filterId = event.target.value as string
    const params = savedFilters.find((filter) => filter.id === filterId)
    if (params) {
      setParams(params)
    }
    setSelectedFilter(filterId)
  }

  const handleMinBudgetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const priceLevel = event.target.value as number
    setMinBudget(priceLevel)
  }

  const handleMaxBudgetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const priceLevel = event.target.value as number
    setMaxBudget(priceLevel)
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
          value={radius !== undefined ? radius : ""}
          onChange={(e) => setRadius(Number(e.target.value))}
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
        <Typography sx={{ whiteSpace: "nowrap" }}>価格レベル</Typography>
        <Select
          value={minBudget !== undefined ? minBudget : ""}
          onChange={handleMinBudgetChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            予算下限
          </MenuItem>
          <MenuItem value="">指定なし</MenuItem>
          {priceLevels.map((level) => (
            <MenuItem key={level.label} value={level.p_level}>
              {level.label}
            </MenuItem>
          ))}
        </Select>
        <Typography sx={{ whiteSpace: "nowrap" }}>~</Typography>
        <Select
          value={maxBudget !== undefined ? maxBudget : ""}
          onChange={handleMaxBudgetChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            予算上限
          </MenuItem>
          <MenuItem value="">指定なし</MenuItem>
          {priceLevels.map((level) => (
            <MenuItem key={level.label} value={level.p_level}>
              {level.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="口コミ数はいくつ以上か"
          type="number"
          value={reviewCount}
          onChange={(e) => setReviewCount(Number(e.target.value))}
          fullWidth
          margin="normal"
          inputProps={{ step: 10, min: 0 }}
          style={{ backgroundColor: "#fcfcfc" }}
        />
        <TextField
          label="☆評価の数はいくつ以上か"
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
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
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleSearch({
              location,
              radius: radius ?? 800,
              minBudget: minBudget ?? 1,
              maxBudget: maxBudget ?? 4,
              cuisine,
              reviewCount: reviewCount ?? 0,
              rating: rating ?? 0,
            })
          }
        >
          検索
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleSave}>
          保存
        </Button>
      </Box>
    </Box>
  )
}

export default RestaurantFilter
