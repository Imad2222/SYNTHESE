import * as React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Load from '../../../Load';
import Navbar from "../../../layouts/frontend/Navbar";
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from '../../../component/getLPTheme';
import {   Alert, Button, Grid, Snackbar } from '@mui/material';



function ToggleCustomTheme() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100dvw',
                position: 'fixed',
                bottom: 24,
            }}
        >
            Welcome
        </Box>
    );
}
ToggleCustomTheme.propTypes = {
    showCustomTheme: PropTypes.shape({
        valueOf: PropTypes.func.isRequired,
    }).isRequired,
    toggleCustomTheme: PropTypes.func.isRequired,
};

function ProductDetail() {

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState([]);
    const [Quantité, setQuantité] = useState(0);
    const navigate = useNavigate();

    // slug jay mn route :slug
    const { category_slug } = useParams();
    const { product_slug } = useParams();

    const [mode, setMode] = React.useState('light');
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    // Quantite increment / decrement 
    const Increment = () => {
        if (Quantité < 10) {

            setQuantité(prevCount => prevCount + 1);
        }

    }

    const Decrement = () => {
        if (Quantité > 1) {
            setQuantité(prevCount => prevCount - 1);
        }

    }



    // cart

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const submitAddCart = (e) => {
        const token = localStorage.getItem("auth_token");

        e.preventDefault();

        const data = {
            product_id: product.id,
            product_qte: Quantité,
        }

        axios.post(`/api/add-to-cart`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            if (res.data.status === 201) {
                setSnackbarSeverity('success');
                setSnackbarMessage(res.data.message);
                setSnackbarOpen(true);
            } else if (res.data.status === 409) { // already added to cart
                setSnackbarSeverity('warning');
                setSnackbarMessage(res.data.message);
                setSnackbarOpen(true);
            } else if (res.data.status === 401) { // Unauthenticated
                setSnackbarSeverity('error');
                setSnackbarMessage(res.data.message);
                setSnackbarOpen(true);
            } else if (res.data.status === 404) { // Not Found 
                setSnackbarSeverity('warning');
                setSnackbarMessage(res.data.message);
                setSnackbarOpen(true);
            }
        })
    }

    useEffect(() => {
        axios.get(`/api/viewproductdetail/${category_slug}/${product_slug}`).then((res) => {
            if (res.data.status === 200) {
                setProduct(res.data.product);
                setLoading(false);
            } else if (res.data.status === 404) {
                navigate('/collection')
                setSnackbarSeverity('error');
                setSnackbarMessage(res.data.message);
                setSnackbarOpen(true);
            }
        });
    }, [category_slug, product_slug, navigate]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                }}
            >
                <Load />
            </Box>
        );
    } else {
        var avail_stock = '';
        if (product.qte > 0) {
            // Afficher le produit et les options d'achat lorsque la quantité est supérieure à zéro
            avail_stock = (
                <Box>
                    <Button variant="contained" color="success" sx={{ px: 4, mt: 2 }}>In Stock </Button>
                    <Grid container spacing={2} mt={3}>
                        <Grid item xs={4}>
                            <Box >
                                <button type='button' onClick={Decrement} className='input-group-text' style={{ backgroundColor: '#EEF1D9' }}>-</button>
                                <input type="text" readOnly className='form-control text-center' value={Quantité} />
                                <button type='button' onClick={Increment} className='input-group-text' style={{ backgroundColor: '#EEF1D9' }}>+</button>
                            </Box>
                        </Grid>
                        <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={submitAddCart} fullWidth>Add To Cart</Button>
                        </Grid>
                    </Grid>
                </Box>
            );
        } else {
            // Afficher le message d'alerte lorsque la quantité est égale ou inférieure à zéro
            avail_stock = (
                <Box>
                    <Alert severity="error">This product is currently out of stock.</Alert>
                </Box>
            );
        }

    }


    const toggleColorMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <>
            <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
                <CssBaseline />
                <Navbar mode={mode} toggleColorMode={toggleColorMode} />
                <Box
                    id="hero"
                    sx={{
                        width: '100%',
                        backgroundImage: (theme) => `linear-gradient(180deg, ${theme.palette.mode === 'light' ? '#CEE5FD, #FFF' : '#02294F, ' + alpha('#090E10', 0.0)})`,
                        backgroundSize: '100% 20%',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <Container
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            pt: { xs: 14, sm: 20 },
                            pb: { xs: 8, sm: 12 },
                        }}
                    >


                        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
                            <Typography
                                component="h3"
                                variant="h3"
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                {product.category.slug}

                            </Typography>

                            <Typography variant="body1" textAlign="center" color="text.secondary">
                                <Typography
                                    component="span"
                                    variant="h5"
                                    sx={{
                                        color: (theme) => theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                                    }}
                                >
                                    {product.name}
                                </Typography>
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} alignSelf="center" spacing={1} useFlexGap sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>

                                {/* {category.name} */}
                                <Container>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4} sx={{ borderRight: '1px solid #ccc', display: 'flex', justifyContent: 'center' }}>
                                            <img src={`http://127.0.0.1:8000/${product.image}`} alt={product.name} style={{ maxWidth: '100%', maxHeight: '200px', margin: 'auto' }} />
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Typography
                                                style={{ textShadow: '0 2px 2px rgba(0, 0, 0, 1.1)' }}
                                                component="span"
                                                variant="h4"
                                                sx={{
                                                    color: (theme) => theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                                                }}>
                                                {product.name}
                                                <Button variant="outlined" color="error" size="small" sx={{ float: 'right' }}>{product.brand}</Button>
                                            </Typography>
                                            <Typography variant="body1">
                                                Product description  : {product.description}
                                            </Typography>
                                            <Typography variant="h4" mb={1}>
                                                RS:{product.selling_price}  <br />
                                                <s style={{ color: '#7E100E' }}> RS:{product.original_price}</s>
                                            </Typography>
                                            <Box>

                                                {avail_stock} <br />

                                            </Box>
                                            <Button variant="contained" color="error" mt={3} >Add to Wishlist</Button>
                                        </Grid>
                                    </Grid>
                                </Container>


                            </Stack>
                        </Stack>

                    </Container>
                </Box>
            </ThemeProvider>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                ContentProps={{
                    sx: {
                        backgroundColor: snackbarSeverity === 'success' ? 'green' : snackbarSeverity === 'warning' ? 'orange' : 'red',
                    },
                }}
            />
        </>
    )
}

export default ProductDetail;
