import React, { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import { collection, doc, addDoc, getDocs, deleteDoc, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../AuthContext"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import Checkbox from "@mui/material/Checkbox"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"

interface TableProps {
  favorites: any[]
  onShopClick: (placeId: string) => void
}

const FavoriteTable: React.FC<TableProps> = ({ favorites, onShopClick }) => {
  const { currentUser } = useAuth()
  const [orderBy, setOrderBy] = useState<string>("n_review")
  const [rows, setRows] = useState<any[]>([])

  const ScrollableTableCell = styled(TableCell)({
    maxWidth: "240px",
    overflowX: "auto",
    whiteSpace: "nowrap",
  })

  const handleSortRequest = (property: string) => {
    if (orderBy !== property) {
      setOrderBy(property)
    }
  }

  const handleBookmarkChange = async (row: any) => {
    if (!currentUser) return
    const updatedRow = {
      ...row,
      bookmark: !row.bookmark,
    }

    setRows((prevRows) => prevRows.map((r) => (r.shop === row.shop ? updatedRow : r)))
    const { place_id, geometry, shop, vicinity, star, n_review, business_status, bookmark } = updatedRow
    const resultData = {
      userId: currentUser.uid,
      place_id,
      geometry: {
        location: {
          lat: typeof geometry?.location?.lat === "function" ? geometry.location.lat() : geometry?.location?.lat,
          lng: typeof geometry?.location?.lng === "function" ? geometry.location.lng() : geometry?.location?.lng,
        },
      },
      shop,
      vicinity,
      star,
      n_review,
      business_status,
      bookmark,
    }

    try {
      const q = query(
        collection(db, "favorite"),
        where("userId", "==", currentUser.uid),
        where("place_id", "==", place_id)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // 既にお気に入りに登録されている場合
        const docId = querySnapshot.docs[0].id
        await deleteDoc(doc(db, "favorite", docId))
        setRows((prevRows) => prevRows.map((r) => (r.shop === row.shop ? { ...r, bookmark: false } : r)))
      } else {
        // お気に入りに登録されていない場合
        await addDoc(collection(db, "favorite"), resultData)
        setRows((prevRows) => prevRows.map((r) => (r.shop === row.shop ? { ...r, bookmark: true } : r)))
      }
    } catch (error) {
      console.error("Error writing document: ", error)
    }
  }

  const sortedRows = rows.slice().sort((a, b) => {
    if (orderBy === "star") {
      return b.star - a.star || b.n_review - a.n_review
    } else if (orderBy === "n_review") {
      return b.n_review - a.n_review || b.star - a.star
    }
    return 0
  })

  useEffect(() => {
    setRows(favorites)
  }, [favorites])

  return (
    <TableContainer
      component={Paper}
      style={{ height: "100%", overflowX: "hidden", overflowY: "auto", backgroundColor: "#fcfcfc" }}
    >
      <Table stickyHeader size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              <TableSortLabel
                active={orderBy === "n_review"}
                direction={"desc"}
                onClick={() => handleSortRequest("n_review")}
              >
                口コミ数
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              <TableSortLabel active={orderBy === "star"} direction={"desc"} onClick={() => handleSortRequest("star")}>
                ☆評価
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              店名
            </TableCell>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              お気に入り
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.place_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell align="left">{row.n_review}</TableCell>
              <TableCell component="th" scope="row">
                {row.star}
              </TableCell>
              <ScrollableTableCell align="left" onClick={() => onShopClick(row.place_id)}>
                <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>{row.shop}</span>
              </ScrollableTableCell>
              <TableCell align="left">
                <Checkbox
                  icon={<BookmarkBorderIcon />}
                  checkedIcon={<BookmarkIcon />}
                  checked={row.bookmark}
                  onChange={() => handleBookmarkChange(row)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default FavoriteTable
