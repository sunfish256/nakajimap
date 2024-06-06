import * as React from "react";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function createData(star: number, n_review: number, shop: string, bookmark: boolean) {
  return { star, n_review, shop, bookmark };
}

const initialRows = [
  createData(4.5, 4, "AAAAAAAAAAAAA", true),
  createData(4.0, 237, "BBBBBBBBBBBBBB", false),
  createData(4.5, 262, "CCCCCCCCCCCCCC", true),
  createData(3.5, 305, "DDDDDDDDDDDDDDDDDDDDDD", false),
  createData(4.0, 356, "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", true),
];

export default function SearchResult() {
  const [rows, setRows] = useState(initialRows);

  const handleBookmarkChange = (shop: string) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.shop === shop ? { ...row, bookmark: !row.bookmark } : row
      )
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">評価</TableCell>
            <TableCell align="left">口コミ&nbsp;(件)</TableCell>
            <TableCell align="left">店名</TableCell>
            <TableCell align="left">行きたい</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.shop} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.star}
              </TableCell>
              <TableCell align="left">{row.n_review}</TableCell>
              <TableCell align="left">{row.shop}</TableCell>
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
  );
}
