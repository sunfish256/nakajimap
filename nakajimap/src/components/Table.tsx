import { useState } from "react"
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

function createData(star: number, n_review: number, shop: string, bookmark: boolean) {
  return { star, n_review, shop, bookmark }
}

const initialRows = [
  createData(4.5, 14, "AAAAAAAAAAAAAAAAAA", false),
  createData(4.0, 237, "BBBBBBBBBBBBBB", false),
  createData(4.5, 262, "CCCCCCCCCCCCCC", true),
  createData(3.5, 305, "DDDDDDDDDDDDDDDDDDDDDD", false),
  createData(4.0, 356, "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", true),
  createData(4.2, 120, "FFFFFFFFFFFFFFFFFFFF", true),
  createData(3.8, 210, "GGGGGGGGGGGGGGGGGGGGG", false),
  createData(4.6, 190, "HHHHHHHHHHHHHHHHHHHHHH", false),
  createData(3.9, 280, "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", false),
  createData(4.1, 150, "JJJJJJJJJJJJJJJJJJJJ", false),
  createData(3.7, 280, "KKKKKKKKKKKKKKKKKKKKKK", false),
  createData(4.3, 220, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL", true),
  createData(3.6, 330, "MMMMMMMMMMMMMMMMMMMMMMMM", false),
  createData(4.4, 180, "NNNNNNNNNNNNNNNNNNNNNNNNNN", true),
  createData(3.8, 280, "OOOOOOOOOOOOOOOOOOOOOOOOO", false),
]

export default function SearchResult() {
  const [rows, setRows] = useState(initialRows)
  const [order, setOrder] = useState<"desc" | null>(null)
  const [orderBy, setOrderBy] = useState<string | null>(null)

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

  const ScrollableTableCell = styled(TableCell)({
    maxWidth: "240px",
    overflowX: "auto",
    whiteSpace: "nowrap",
  })

  return (
    <TableContainer component={Paper} style={{ maxHeight: 366, overflow: "auto" }}>
      <Table stickyHeader style={{ width: 600 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <TableSortLabel
                active={orderBy === "star"}
                direction={order === "desc" ? "desc" : "desc"}
                onClick={() => handleSortRequest("star")}
              >
                評価
              </TableSortLabel>
            </TableCell>
            <TableCell align="left">
              <TableSortLabel
                active={orderBy === "n_review"}
                direction={order === "desc" ? "desc" : "desc"}
                onClick={() => handleSortRequest("n_review")}
              >
                口コミ件数
              </TableSortLabel>
            </TableCell>
            <TableCell align="left">店名</TableCell>
            <TableCell align="left">行きたい</TableCell>
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
