import React from "react"
// import Navbar from "./Navbar"
import { AppBar, Toolbar, Box, Typography } from "@mui/material"

const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                color: 'white', 
                fontSize: '1.5rem',
                letterSpacing: '0.2rem',
                fontWeight: 500,
              }}
            >
              nakajimap
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  )
}

export default AuthLayout
