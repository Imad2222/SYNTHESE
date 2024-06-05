import React, { useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Load from '../../Load';
import Swal from 'sweetalert2';

// const products = [
//   {
//     name: 'Professional plan',
//     desc: 'Monthly subscription',
//     price: '$15.00',
//   },
//   {
//     name: 'Dedicated support',
//     desc: 'Included in the Professional plan',
//     price: 'Free',
//   },
//   {
//     name: 'Hardware',
//     desc: 'Devices needed for development',
//     price: '$69.99',
//   },
//   {
//     name: 'Landing page template',
//     desc: 'License',
//     price: '$49.99',
//   },
// ];

function Info() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
//   var totalcartPrice = 0;

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      navigate('/');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "You are not logged in!",
      });
    } else {
      const token = localStorage.getItem("auth_token");
      axios.get(`/api/cart`, {
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

   // Calcul du total du panier
   const totalcartPrice = cart.reduce((total, item) => {
    const sellingPrice = parseFloat(item.product.selling_price.match(/\d+/)[0]);
    return total + (sellingPrice * item.product_qte);
  }, 0);
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Load />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
      {totalcartPrice.toFixed(2)} DH
      </Typography>
      <List disablePadding>
        {cart.map((item) => {
            
            
             return(
                <ListItem key={item.product.name} sx={{ py: 1, px: 0 }}>
                <ListItemText
                  sx={{ mr: 2 }}
                  primary={item.product.name}
                  secondary={item.product.selling_price}
                />
                Qte :
                <ListItemText
                  sx={{ mr: 2 }}
                  primary={item.product_qte}
                  
                />
                
                <Typography variant="body1" fontWeight="medium">
                {(parseFloat(item.product.selling_price.match(/\d+/)[0]) * item.product_qte).toFixed(2)} DH
                </Typography>
                 
              </ListItem>
             )
         
})}
      </List>
    </React.Fragment>
  );
}


export default Info;
