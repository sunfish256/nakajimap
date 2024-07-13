import React, { useEffect, useState } from "react"
import { AppBar, Toolbar, Typography, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"

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
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          ロゴ
        </Typography>
        <Button color="inherit" onClick={() => navigate("/home")}>
          ホーム
        </Button>
        <Button color="inherit" onClick={() => navigate("/favorite_condition")}>
          お気に入り条件
        </Button>
        <Button color="inherit"
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
