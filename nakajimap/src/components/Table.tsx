import React, { useState, useEffect } from "react"
import { collection, doc, addDoc, getDoc, getDocs, deleteDoc, query, where } from "firebase/firestore"
import { styled } from "@mui/material/styles"
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
import { db } from "../firebase"
import { useAuth } from "../AuthContext"

interface TableProps {
  results: any[]
  onShopClick: (placeId: string) => void
}

const ScrollableTableCell = styled(TableCell)({
  maxWidth: "240px",
  overflowX: "auto",
  whiteSpace: "nowrap",
})

const SearchResult: React.FC<TableProps> = ({ results, onShopClick }) => {
  const { currentUser } = useAuth()

  const [rows, setRows] = useState<any[]>([])
  const [order, setOrder] = useState<"desc" | "asc">("desc")
  const [orderBy, setOrderBy] = useState<string>("n_review")

  async function checkBookmark(place_id: string, userId: string) {
    const q = query(collection(db, "favorite"), where("place_id", "==", place_id), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return false
    }

    const doc = querySnapshot.docs[0]
    console.log(`Document found: ${doc.id}`, doc.data())

    // Bookmarkフィールドの存在と値を確認
    return doc.data().bookmark === true
  }

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return

      const newRows = await Promise.all(
        results.map(async (result) => {
          const bookmark = await checkBookmark(result.place_id, currentUser.uid)
          return {
            place_id: result.place_id,
            geometry: result.geometry,
            shop: result.name,
            vicinity: result.vicinity,
            star: result.rating,
            n_review: result.user_ratings_total,
            business_status: result.business_status,
            bookmark: bookmark,
          }
        })
      )
      setRows(newRows)
    }
    fetchData()
  }, [results, currentUser])

  const handleSortRequest = (property: string) => {
    if (orderBy === property) {
      // 既に選択されているプロパティの場合、昇順・降順を切り替える
      setOrder(order === "desc" ? "asc" : "desc")
    } else {
      // 別のプロパティが選択された場合は降順でソートを開始
      setOrder("desc")
      setOrderBy(property)
    }
  }

  const handleBookmarkChange = async (row: any) => {
    const updatedRow = {
      ...row,
      bookmark: !row.bookmark,
    }

    setRows((prevRows) => prevRows.map((r) => (r.shop === row.shop ? updatedRow : r)))

    if (currentUser) {
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
  }

  const sortedRows = order
  ? rows.slice().sort((a, b) => {
      if (orderBy === "star") {
        return order === "desc"
          ? b.star - a.star || b.n_review - a.n_review
          : a.star - b.star || a.n_review - b.n_review
      } else if (orderBy === "n_review") {
        return order === "desc"
          ? b.n_review - a.n_review || b.star - a.star
          : a.n_review - b.n_review || a.star - b.star
      }
      return 0
    })
  : rows
  
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
                direction={order === "asc" ? "asc" : "desc"}
                onClick={() => handleSortRequest("n_review")}
              >
                口コミ数
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              <TableSortLabel
                active={orderBy === "star"}
                direction={order === "asc" ? "asc" : "desc"}
                onClick={() => handleSortRequest("star")}
              >
                ☆評価
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              店名
            </TableCell>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              行きたい
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
              <ScrollableTableCell align="left" onClick={() => {
                console.log("Clicked shop:", row.shop, "with placeId:", row.place_id)
                onShopClick(row.place_id)
                }}>
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

export default SearchResult
