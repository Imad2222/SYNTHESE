import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { TextField, Grid } from "@mui/material";

import HttpsIcon from '@mui/icons-material/Https';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { InputAdornment } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import EmailIcon from '@mui/icons-material/Email';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const defaultTheme = createTheme();

const Register = () => {
    const navigate = useNavigate();

    const [registerInput, setRegisterInput] = useState({
        name: '',
        email: '',
        password: '',
        error_list: [],
    });

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const handleInput = (e) => {
        e.persist();
        setRegisterInput({ ...registerInput, [e.target.name]: e.target.value });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const registerSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: registerInput.name,
            email: registerInput.email,
            password: registerInput.password,
        };

        axios.get('/sanctum/csrf-cookie')
            .then(response => {
                axios.post('/api/register', data)
                    .then(res => {
                        if (res.data.status === 200) {
                            localStorage.setItem('auth_token', res.data.token);
                            localStorage.setItem('auth_name', res.data.username);
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: res.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            navigate('/');
                        } else {
                            setRegisterInput({ ...registerInput, error_list: res.data.Validation_errors });
                            setOpenSnackbar(true);
                            const errorMessage = Object.values(res.data.Validation_errors).join('\n');
                            setSnackbarMessage(errorMessage);
                        }
                    });
            });
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
              < AccountCircleIcon sx={{ fontSize: '48px' ,color:'#020873' }} />
  
              <Typography component="h1" variant="h5" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'  }}>
                Sign Up
             </Typography>
  
              <Box component="form" noValidate onSubmit={registerSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  onChange={handleInput} value={registerInput.name}
                  autoComplete="name"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountBoxIcon />
                        </InputAdornment>
                    ),
                }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={handleInput} value={registerInput.email}
                  autoComplete="email"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            < EmailIcon/>
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
                  onChange={handleInput} value={registerInput.password}
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
                  Sign Up
                </Button>
                
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
};

export default Register;
