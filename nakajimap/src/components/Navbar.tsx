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
    <AppBar position="static">
      <Toolbar>
        {/* <img src={logo} alt="ロゴ" style={{ height: 40, marginRight: 'auto', cursor: 'pointer' }} onClick={() => navigate("/home")} /> */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              color: 'white', 
              cursor: 'pointer', 
              fontSize: '1.5rem',
              letterSpacing: '0.2rem',
              fontWeight: 500,
              display: 'inline-block',
              '-webkit-font-smoothing': 'antialiased',
            }}
            onClick={() => navigate("/home")}
          >
            nakajimap
          </Typography>
        </Box>
        <Button color="inherit" onClick={() => navigate("/favorite_condition")}>
          お気に入りフィルタ
        </Button>
        <Button color="inherit" onClick={() => navigate("/favorite")}>
          お気に入りリスト
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
        >
          ログアウト
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
