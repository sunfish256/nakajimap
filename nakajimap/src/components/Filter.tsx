import React, { useState, useEffect, useContext } from "react"
import { Box, TextField, Typography, Button, MenuItem, Select } from "@mui/material"
import { collection, addDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { searchNearbyRestaurants } from '../functions/Search'


interface FilterProps {
  setResults: React.Dispatch<React.SetStateAction<any[]>>
}


const RestaurantFilter: React.FC<FilterProps> = ({ setResults }) => {
  const [currentUser, setCurrentUser] = useState<null | object>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        navigate("/auth")
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState<number>()
  const [minBudget, setMinBudget] = useState<number>()
  const [maxBudget, setMaxBudget] = useState<number>()
  const [cuisine, setCuisine] = useState("")
  const [reviewCount, setReviewCount] = useState<number>()
  const [rating, setRating] = useState<number>()

  const [savedFilters, setSavedFilters] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState("")
  const [searchTriggered, setSearchTriggered] = useState(false)

  const priceLevels = [
    { label: "￥", p_level: 1 },
    { label: "￥￥", p_level: 2 },
    { label: "￥￥￥", p_level: 3 },
    { label: "￥￥￥￥", p_level: 4 },
  ]

  const handleSearch = async () => {
    // プログラム的に無いと動かない項目が欠損してた場合、デフォルト値で補完する
    if (!location) {
      setLocation("東京駅")
    }
    if (!radius) {
      setRadius(800)
    }
    if (!reviewCount) {
      setReviewCount(0)
    }
    if (!rating) {
      setRating(0)
    }
    setSearchTriggered(true)
  }

  useEffect(() => {
    if (searchTriggered && location && radius) {
      console.log("location", location)
      console.log("radius", radius)
      const performSearch = async () => {
        const results = await searchNearbyRestaurants(location, radius, minBudget, maxBudget, cuisine, reviewCount, rating)
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
  }, [])

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
        <Typography sx={{ whiteSpace: "nowrap" }}>価格レベル</Typography>
        <Select value={minBudget} onChange={handleMinBudgetChange} displayEmpty fullWidth>
          <MenuItem value="" disabled>
            予算下限
          </MenuItem>
          <MenuItem key={0} value={0}>
            指定なし
          </MenuItem>
          {priceLevels.map((level) => (
            <MenuItem key={level.label} value={level.p_level}>
              { level.label }
            </MenuItem>
          ))}
        </Select>
        <Typography sx={{ whiteSpace: "nowrap" }}>~</Typography>
        <Select value={maxBudget} onChange={handleMaxBudgetChange} displayEmpty fullWidth>
          <MenuItem value="" disabled>
            予算上限
          </MenuItem>
          <MenuItem value="">
            指定なし
          </MenuItem>
          {priceLevels.map((level) => (
            <MenuItem key={level.label} value={level.p_level}>
              { level.label }
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
        <Button variant="contained" color="primary" onClick={handleSearch}>
          検索
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleSave}>
          保存
        </Button>
      </Box>
      <Button
        fullWidth
        onClick={async () => {
          try {
            await auth.signOut()
            navigate("/auth")
          } catch (error) {
            if (error instanceof Error) {
              alert(error.message)
            } else {
              console.error("Unexpected error", error)
            }
          }
        }}
        style={{ marginTop: "0.5em", marginBottom: "0.5em" }}
      >
        Logout
      </Button>
    </Box>
  )
}

export default RestaurantFilter
