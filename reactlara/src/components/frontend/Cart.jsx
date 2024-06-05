import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
// import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Navbar from '../../layouts/frontend/Navbar';
import getLPTheme from '../../component/getLPTheme';
import axios from 'axios';
import Load from '../../Load';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { IconButton, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Swal from 'sweetalert2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Paper } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';





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

function Cart() {


    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    var totalcartPrice = 0 ;

   

    const [mode, setMode] = React.useState('light');
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });



    
   

    if(!localStorage.getItem('auth_token')){

        navigate('/');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "You are not logged in!",
        });
    }


    useEffect(() => {
        if(!localStorage.getItem('auth_token')){
            navigate('/');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "You are not logged in!",
            });
        } else {
            const token = localStorage.getItem("auth_token");
            axios.get(`/api/cart`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }).then((res) => {
                if (res.data.status === 200) {
                    setCart(res.data.cart);
                    setLoading(false);
                } else if (res.data.status === 401) {
                    navigate('/');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: res.data.message,
                    });
                }
            });
        }
    }, [navigate]);
    
    
    // function pour increment et decrement à patir de la B.D

    const  handleIncrement =  (cart_id) => {
        setCart(cart =>
        cart.map((item)=> cart_id == item.id ? { ...item, product_qte : item.product_qte + (item.product_qte < 10 ? 1 : 0) } : item )
        ); // la kant item.product_qte < 10 rah ran incremiw b 1 +1  sinon ran  incremew b 0
        updateCartQuantity(cart_id,"inc"); // pour la BD 
    }

    const  handleDecrement =  (cart_id) => {
        setCart(cart =>
        cart.map((item)=> cart_id == item.id ? { ...item, product_qte : item.product_qte - (item.product_qte > 1 ? 1 : 0) } : item )
        ); // la kant item.product_qte > 1  rah ran decremiw b 1 -1  sinon ran  decremew b 0
        updateCartQuantity(cart_id,"dec"); // pour la BD 
    }
    

    function updateCartQuantity(cart_id, scope) {
        const token = localStorage.getItem('auth_token');  // Récupérer le jeton d'authentification depuis le stockage local
 
        axios.put(`/api/cart-updateQuantity/${cart_id}/${scope}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`, // Inclure le jeton d'authentification dans les en-têtes de la requête
            }
        }).then(res => {
            if (res.data.status === 200) {
                // Swal.fire({
                //     position: "center",
                //     icon: "success",
                //     title: `${res.data.message}`,
                // });
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }


    function deleteCartItem(e, cart_id) {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');
        
        axios.delete(`/api/cart-delete/${cart_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => {
            if (res.data.status === 200) {
                // Suppression réussie, mettre à jour l'état local du panier
                setCart(cart => cart.filter(item => item.id !== cart_id));
    
                Swal.fire({
                    icon: "success",
                    title: res.data.message,
                });
            } else if (res.data.status === 404) {
                Swal.fire({
                    icon: "warning",
                    title: res.data.message,
                });
            }
        });
    }
    
    
    


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
    }
    
    var cart_html  = '';

    if(cart.length > 0)
    {
         // Réinitialiser totalcartPrice à 0 avant de recalculer
        totalcartPrice = 0;
        cart_html = 
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 8 },
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
                mt: 5, // Ajout du margin-top personnalisé pour décaler le texte vers le bas
              }}
            >
              Cart Items
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>

              <TableContainer sx={{ maxWidth: '100%', borderRadius: 2, boxShadow: 2 }}>
                        <Table>
                        <TableHead>
                                <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Remove</TableCell>
                                </TableRow>
                        </TableHead>

                        <TableBody>
                            {cart.map((item)=>{
                                
                                // Extraire le nombre du prix de vente en utilisant une expression régulière
                               const sellingPrice = parseFloat(item.product.selling_price.match(/\d+/)[0]);
                               totalcartPrice +=  sellingPrice  * item.product_qte;
                                return (

                                <TableRow  key={item.id}>
                                <TableCell>
                                    <img src={`http://127.0.0.1:8000/${item.product.image}`} alt={item.product.name} style={{ width: 50 }} />
                                </TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>{item.product.selling_price}</TableCell>
                                <TableCell>

                                    <Stack direction="row" alignItems="center">
                                    <IconButton color="primary" onClick={() => handleDecrement(item.id)}>
                                        <RemoveIcon />
                                    </IconButton>

                                    <input type="text" value={item.product_qte} style={{ width: 30, textAlign: 'center' }} readOnly />
                                    <IconButton color="primary" onClick={() => handleIncrement(item.id)}>
                                        <AddIcon />
                                    </IconButton>
                                    </Stack>

                                </TableCell>
                                <TableCell>{(sellingPrice * item.product_qte).toFixed(2)} DH</TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={ (e) => deleteCartItem(e, item.id)}>
                                    <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>

                                )
                                })}
                        </TableBody>

                        </Table>
              </TableContainer>

            </Stack>
            {/* afficher Checkout pour le paiment si il a cart sinon il ne s'affiche rien  */}
            <Paper sx={{ float: 'right', marginRight: '60px', marginBottom:'100px', width: '400px',mt:'25px' }}>
                <Table size="small">
                    <TableBody>
                    
                    <TableRow>
                        <TableCell component="th" scope="row">
                        Grand Total  :
                        </TableCell>
                        <TableCell align="right"><strong>{totalcartPrice.toFixed(2)} DH</strong></TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell align="center" colSpan={2}>
                        <IconButton color="error" component={Link}  to="/checkout">
                            <ShoppingCartCheckoutIcon /> Checkout
                        </IconButton>
                    </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </Paper>
          </Stack>
          
        </Container>
        
    }
    else
    {
        // makaynache 
        cart_html = (
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: { xs: 14, sm: 8 },
                pb: { xs: 8, sm: 12 },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 64, color: 'rgba(0, 0, 0, 0.5)', mb: 2 , mt:6}} />
              <Typography
                component="h4"
                variant="h4"
                sx={{
                  textAlign: 'center',
                  mt: 1, // Marge-top personnalisée pour décaler le texte vers le bas
                  textShadow : '2px 2px 4px rgba(0,0,0,.3)' // Ajout d'une ombre sur le texte
                }}
              >
                Your shopping cart is empty!
              </Typography>
            </Container>
          );
    }

    const toggleColorMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

  return (
    <>
  <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <Navbar mode={mode} toggleColorMode={toggleColorMode} />
            <Box
                id="hero"
                sx={{
                    width: '100%',
                    backgroundImage: (theme) => `linear-gradient(180deg, ${theme.palette.mode === 'light' ? '#CEE5FD, #FFF' : '#02294F, ' + alpha('#090E10', 0.0)})`,
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {cart_html}
                <hr />
                {/* Ajout de la Card pour afficher le montant total */}
               
            </Box>
        </ThemeProvider>

   
    
</>
  )
}
export default Cart;
