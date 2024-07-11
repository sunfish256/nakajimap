import React, { useEffect, useState } from "react"
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

interface TableProps {
  results: any[]
}

function createData(star: number, n_review: number, shop: string, bookmark: boolean) {
  return { star, n_review, shop, bookmark }
}

const ScrollableTableCell = styled(TableCell)({
  maxWidth: "240px",
  overflowX: "auto",
  whiteSpace: "nowrap",
})

const SearchResult: React.FC<TableProps> = ({ results }) => {
  const [rows, setRows] = useState(results)
  const [order, setOrder] = useState<"desc" | null>(null)
  const [orderBy, setOrderBy] = useState<string | null>(null)

  useEffect(() => {
    const newRows = results.map((result) => createData(result.rating, result.user_ratings_total, result.name, false))
    setRows(newRows)
  }, [results])

  const handleSortRequest = (property: string) => {
    if (orderBy === property && order === "desc") {
      setOrder(null)
      setOrderBy(null)
    } else {
      setOrder("desc")
      setOrderBy(property)
    }
  }

  const handleBookmarkChange = (shop: string) => {
    setRows((prevRows) => prevRows.map((row) => (row.shop === shop ? { ...row, bookmark: !row.bookmark } : row)))
  }

  const sortedRows = order
    ? rows.slice().sort((a, b) => {
        if (orderBy === "star") {
          return b.star - a.star || b.n_review - a.n_review
        } else if (orderBy === "n_review") {
          return b.n_review - a.n_review || b.star - a.star
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
                active={orderBy === "star"}
                direction={order === "desc" ? "desc" : "desc"}
                onClick={() => handleSortRequest("star")}
              >
                ☆評価
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" style={{ backgroundColor: "#eaeafa" }}>
              <TableSortLabel
                active={orderBy === "n_review"}
                direction={order === "desc" ? "desc" : "desc"}
                onClick={() => handleSortRequest("n_review")}
              >
                口コミ数
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
            <TableRow key={row.shop} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.star}
              </TableCell>
              <TableCell align="left">{row.n_review}</TableCell>
              <ScrollableTableCell align="left">{row.shop}</ScrollableTableCell>
              <TableCell align="left">
                <Checkbox
                  icon={<BookmarkBorderIcon />}
                  checkedIcon={<BookmarkIcon />}
                  checked={row.bookmark}
                  onChange={() => handleBookmarkChange(row.shop)}
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
