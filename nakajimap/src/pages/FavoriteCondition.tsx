import React, { useEffect, useState } from "react"
import { db, auth } from "../firebase"
import { Box, TextField, Typography, Button, Select, MenuItem } from "@mui/material"
import { query, where, collection, getDocs, doc, deleteDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext"

const FavoriteCondition: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [savedFilters, setSavedFilters] = useState<any[]>([])
  const priceLevels = [
    { label: "指定なし", p_level: undefined },

    { label: "¥", p_level: 1 },
    { label: "¥¥", p_level: 2 },
    { label: "¥¥¥", p_level: 3 },
    { label: "¥¥¥¥", p_level: 4 },
  ]
  const getPriceLabel = (level) => {
    const priceLevel = priceLevels.find((pl) => pl.p_level === level)
    return priceLevel ? priceLevel.label : ""
  }

  const fetchSavedFilters = async () => {
    if (!currentUser) return
    console.log("fetchSavedFilters function called")
    try {
      const q = query(collection(db, "filters"), where("userId", "==", currentUser.uid))
      const querySnapshot = await getDocs(q)
      const filtersList: any[] = []
      querySnapshot.forEach((doc) => {
        filtersList.push({ id: doc.id, ...doc.data() })
      })
      setSavedFilters(filtersList)
    } catch (error) {
      console.error("Error fetching filters: ", error.message)
    }
  }

  const handleSearch = (filter: any) => {
    navigate("/home", { state: filter })
    console.log("filter", filter)
  }

  const handleDelete = async (id: string) => {
    try {
      const filterDoc = doc(db, "filters", id)
      await deleteDoc(filterDoc)
      setSavedFilters(savedFilters.filter((filter) => filter.id !== id))
    } catch (error) {
      console.error("Error deleting document: ", error)
    }
  }

  useEffect(() => {
    fetchSavedFilters()
  }, [currentUser])

  return (
    <Box sx={{ margin: "normal" }}>
      {savedFilters.map((filter, idx) => (
        <Box
          key={filter.id}
          sx={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", marginBottom: "10px" }}
        >
          <Typography variant="h6">お気に入りフィルタ {idx + 1}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, marginTop: "10px" }}>
            <TextField
              label="エリア・駅"
              value={filter.location}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#fcfcfc" }}
            />
            <Typography sx={{ whiteSpace: "nowrap" }}>周辺</Typography>
            <TextField
              label="範囲"
              type="number"
              value={filter.radius}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#fcfcfc" }}
            />
            <Typography sx={{ whiteSpace: "nowrap" }}>m以内</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="料理のジャンル"
              value={filter.cuisine}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#fcfcfc" }}
            />
            <Typography sx={{ whiteSpace: "nowrap" }}>価格レベル</Typography>
            <TextField
              label="予算下限"
              type="text"
              value={getPriceLabel(filter.minBudget)}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#fcfcfc" }}
            />
            <Typography sx={{ whiteSpace: "nowrap" }}>~</Typography>
            <TextField
              label="予算上限"
              type="text"
              value={getPriceLabel(filter.maxBudget)}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#fcfcfc" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="口コミ数はいくつ以上か"
              type="number"
              value={filter.reviewCount}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#fcfcfc" }}
            />
            <TextField
              label="☆評価の数はいくつ以上か"
              type="number"
              value={filter.rating}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              style={{ backgroundColor: "#fcfcfc" }}
            />
          </Box>
          <Box mt={3} sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" onClick={() => handleSearch(filter)}>
              検索
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => handleDelete(filter.id)}>
              削除
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default FavoriteCondition
