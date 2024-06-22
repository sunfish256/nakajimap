import React, { useState } from "react"
import { Box, TextField, Typography, Button } from "@mui/material"

const RestaurantFilter: React.FC = () => {
  const [location, setLocation] = useState("")
  const [distance, setDistance] = useState<string>("")
  const [minBudget, setMinBudget] = useState<string>("")
  const [maxBudget, setMaxBudget] = useState<string>("")
  const [cuisine, setCuisine] = useState("")
  const [reviewCount, setReviewCount] = useState<string>("0")
  const [rating, setRating] = useState<string>("0")
  const [filters, setFilters] = useState({
    location: "",
    distance: undefined,
    budget: [0, undefined],
    cuisine: "",
    reviewCount: undefined,
    rating: undefined,
  })

  const handleSearch = () => {
    setFilters({
      location,
      distance: distance ? parseInt(distance) : undefined,
      budget: [parseInt(minBudget) || 0, maxBudget ? parseInt(maxBudget) : undefined],
      cuisine,
      reviewCount: reviewCount ? parseInt(reviewCount) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
    })
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
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
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
          inputProps={{ step: 0.5, min: 0 }}
          style={{ backgroundColor: "#fcfcfc" }}
        />
      </Box>
      <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          検索
        </Button>
      </Box>
      {/* <Box mt={4} style={{zoom: 0.8}}>
        <Typography variant="h6">入力された条件:</Typography>
        <Typography>場所: {filters.location}</Typography>
        <Typography>距離: {filters.distance} m以内</Typography>
        <Typography>
          予算: ¥{filters.budget[0]} - {filters.budget[1]}
        </Typography>
        <Typography>料理のジャンル: {filters.cuisine}</Typography>
        <Typography>口コミ数: {filters.reviewCount} 件以上</Typography>
        <Typography>☆評価: {filters.rating} 以上</Typography>
      </Box> */}
    </Box>
  )
}

export default RestaurantFilter
