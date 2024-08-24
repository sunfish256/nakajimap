import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth } from "../firebase"
import { useAuth } from "../AuthContext"

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate("/home") // ログインしている場合、ホームへリダイレクト
    }
  }, [currentUser, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(userCredential.user)
        alert("会員登録が完了しました！")
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        navigate("/home")
      }
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("登録済みのアカウントです。")
          break
        case "auth/invalid-email":
          alert("メールアドレスの形式が正しくありません。")
          break
        case "auth/weak-password":
          alert("メールアドレスの形式が正しくありません。")
          break
        case "auth/invalid-credential":
          alert("メールアドレスまたはパスワードのどちらかが正しくありません。")
          break
        default:
          alert("認証に失敗しました。")
      }
      console.error("Authentication error", error)
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      console.log("Google sign in succeeded!")
      navigate("/home")
    } catch (error) {
      console.error("Google sign in failed!", error)
      alert("Google sign in failed!")
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignUp ? "会員登録" : "ログイン"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value)
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value)
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1, fontSize: "1.05rem" }}>
            {isSignUp ? "会員登録" : "ログイン"}
          </Button>

          <Grid container>
            <Grid item>
              <Link href="#" variant="body2" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "すでにアカウントをお持ちですか？ サインイン" : "アカウントをお持ちでないですか？ 会員登録"}
              </Link>
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 4, mb: 2, fontSize: "1.05rem", textTransform: "none" }}
            onClick={handleGoogleSignIn}
          >
            Googleでログイン
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
