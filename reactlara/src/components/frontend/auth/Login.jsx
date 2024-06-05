



import { useState } from "react";
// import Navbar from "../../../layouts/frontend/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import HttpsIcon from '@mui/icons-material/Https';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { InputAdornment, TextField } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import LoginIcon from '@mui/icons-material/Login';
import MailLockIcon from '@mui/icons-material/MailLock';


const defaultTheme = createTheme();
const Login = () => {
    const navigate = useNavigate();

    const [loginInput, setLoginInput] = useState({
        email: "",
        password: "",
        error_list: [],
    });

    const handleInput = (e) => {
        e.persist();
        setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
    };

    const loginSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email: loginInput.email,
            password: loginInput.password,
        };

        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('api/login', data);

            if (res.data.status === 200) {
                localStorage.setItem('auth_token', res.data.token);
                localStorage.setItem('auth_name', res.data.username);
                Swal.fire({
                    icon: "success",
                    title: res.data.message,
                    
                    showClass: {
                      popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                      `
                    },
                    hideClass: {
                      popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                      `
                    }
                  });

                // Check the role and redirect accordingly
                if (res.data.role === 'admin') {
                  window.location.href = '/admin/dashboard';
                } else {
                    navigate('/');
                }
            } else if (res.data.status === 401) {
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: res.data.message,
                });
            } else {
                setLoginInput({ ...loginInput, error_list: res.data.Validation_errors });
            }
        } catch (error) {
            console.error("API call error:", error);
        }
    };
    const image_path = "src/images/Foood.png";

    return (
        <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${image_path})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[200] : t.palette.grey[800],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} style={{backgroundColor:'#D9D9D9'}} elevation={0} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <LoginIcon sx={{ fontSize: '48px' ,color:'#020873' }} />

            <Typography component="h1" variant="h5" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'  }}>
              Sign in
           </Typography>

            <Box component="form" noValidate onSubmit={loginSubmit} sx={{ mt: 1 }}>
              {/* <MailLockIcon/> */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={handleInput} value={loginInput.email}
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                          <MailLockIcon />
                      </InputAdornment>
                  ),
              }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={handleInput} value={loginInput.password}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                          <HttpsIcon />
                      </InputAdornment>
                  ),
              }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{backgroundColor:"#020873"}}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign in
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="reset-password" variant="body2"  style={{color:'#020873'}}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2"  style={{color:'#020873'}}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    );
};

export default Login;