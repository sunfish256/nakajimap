import React, { useEffect, useState } from "react"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
// import logo from "../assets/nakajimap_logo.png"

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<null | object>(null)

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

  return (
    <AppBar position="static" sx={{ width: "100%" }}>
      <Toolbar>
        {/* <img src={logo} alt="ロゴ" style={{ height: 40, marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate("/home")} /> */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "white",
              cursor: "pointer",
              fontSize: "1.5rem",
              letterSpacing: "0.2rem",
              fontWeight: 500,
              display: "inline-block",
              WebkitFontSmoothing: "antialiased",
            }}
            onClick={() => navigate("/home")}
          >
            nakajimap
          </Typography>
        </Box>
        <Button color="inherit" onClick={() => navigate("/favorite")} sx={{ fontSize: "0.9rem" }}>
          お気に入りリスト
        </Button>
        <Button color="inherit" onClick={() => navigate("/favorite_condition")} sx={{ fontSize: "0.9rem" }}>
          お気に入り条件
        </Button>
        <Button
          color="inherit"
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
          sx={{ fontSize: "0.9rem" }}
        >
          ログアウト
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
