import  React, { useState, useEffect } from 'react';
import ReactDOM from  'react-dom';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Load from '../../Load';
import Container from '@mui/material/Container';



import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function AddressForm() {

    const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
//   var totalcartPrice = 0;

if(!localStorage.getItem('auth_token')){

    navigate('/');
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "You are not logged in!",
    });
}



const [checkoutInput,setCheckoutInput] = useState({
    firstname:'',
    lastname :'',
    address : '',
    city : '' ,
    state :'' ,
    phone :'',
    zipcode:'',
    email:'',
});
const [error, setError] = useState([]);

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

const handleInput = (e) =>
{
    e.persist();
    setCheckoutInput({...checkoutInput, [e.target.name]: e.target.value });
}

var orderinfo_data = {
  firstname : checkoutInput.firstname,
  lastname : checkoutInput.lastname,
  phone : checkoutInput.phone,
  email : checkoutInput.email,
  address : checkoutInput.address,
  city: checkoutInput.city,
  state : checkoutInput.state,
  zipcode : checkoutInput.zipcode,
  payment_mode : 'Paid By Paypal',
  payment_id : '',
}

// Paypal code 

const PayPalButton = window.paypal.Buttons.driver( "react", { React, ReactDOM });
const createOrder = (data, actions) => {
  return actions.order.create({
    purchase_units: [
      {
      amount: { 
        // value: totalcartPrice
        value: totalcartPrice.toString()
       },
      },
    ],
                             });
    };
    const onApprove = (data, actions) => {

      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.log("No authentication token found.");
        return;
    }

      // return actions.order.capture();
      return actions.order.capture().then(function(details){
        console.log(details);

        orderinfo_data.payment_id  = details.id;



        axios.post(`/api/place-order`, orderinfo_data ,{
          headers: {
              Authorization: `Bearer ${token}`,
                    },
                }).then(res=>{
                    if(res.data.status === 200)
                    {
                        Swal.fire({
                            icon: "success",
                            title: res.data.message,
                        });
                        setError([]);
                        navigate('/thank-you');
            
                    }
                    else if (res.data.status === 422)
                    {
                        Swal.fire({
                            icon: "error",
                            title: "All Field Are mandetory",
                        });
                        setError(res.data.errors);
                    }
                });

      });

    };

 // End paypal code 





const submitOrder = (e , payment_mode) =>
{
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
        console.log("No authentication token found.");
        return;
    }

    const data = {
        firstname : checkoutInput.firstname,
        lastname : checkoutInput.lastname,
        phone : checkoutInput.phone,
        email : checkoutInput.email,
        address : checkoutInput.address,
        city: checkoutInput.city,
        state : checkoutInput.state,
        zipcode : checkoutInput.zipcode,
        payment_mode : payment_mode,
        payment_id : '',
    }

   

    switch(payment_mode){
      case 'cod':
        axios.post(`/api/place-order`, data ,{
          headers: {
              Authorization: `Bearer ${token}`,
                    },
                }).then(res=>{
                    if(res.data.status === 200)
                    {
                        Swal.fire({
                            icon: "success",
                            title: res.data.message,
                        });
                        setError([]);
                        navigate('/thank-you');
            
                    }
                    else if (res.data.status === 422)
                    {
                        Swal.fire({
                            icon: "error",
                            title: "All Field Are mandetory",
                        });
                        setError(res.data.errors);
                    }
                });
        break;
      
      case 'paypal':
        axios.post(`/api/Validate-order`, data ,{
          headers: {
              Authorization: `Bearer ${token}`,
                    },
                }).then(res=>{
                  if(res.data.status === 200)
                  {
                        
                      setError([]); // faire les erreur comme null
                      var myModal = new window.bootstrap.Modal(document.getElementById('PayOnlineModal'));
                      myModal.show();
                      
                  }
                  else if(res.data.status ===  422)

                  {
                        Swal.fire({
                          icon: "error",
                          title: "All Field Are mandetory",
                        });
                        setError(res.data.errors);
                        console.log(res.data.errors)
                  }
                });

        break;
      
      default:  
        break;
    }


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
      cart_html = <Container>
        <Grid container spacing={3}>
    
         <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          First name 
        </FormLabel>
        <TextField
          id="first-name"
          name="firstname"
          onChange={handleInput}
          value={checkoutInput.firstname}
          type="name"
          placeholder="First-name"
          autoComplete="first name"
          error={!!error.firstname}
          helperText={error.firstname}
          required
        />
        
      </FormGrid>
      
     
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Last name
        </FormLabel>
        <TextField
          id="last-name"
          name="lastname"
          onChange={handleInput}
          value={checkoutInput.lastname}
          type="last-name"
          placeholder="Last-name"
          autoComplete="lastname"
          error={!!error.lastname}
          helperText={error.lastname}
          required
        />
       
      </FormGrid>
      
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Email Address
        </FormLabel>
        <TextField
          id="email"
          name="email"
          onChange={handleInput}
          value={checkoutInput.email}
          type="email"
          placeholder="exemle@gmail.com"
          autoComplete="email"
          error={!!error.email}
          helperText={error.email}
          required
        />
        
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Full Address 
        </FormLabel>
        <TextField
          id="address"
          name="address"
          onChange={handleInput}
          value={checkoutInput.address}
          type="address"
          placeholder="Street name and number"
          autoComplete="shipping address-line1"
          error={!!error.address}
          helperText={error.address}
          required
        />
       

      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <TextField
          id="city"
          name="city"
          onChange={handleInput}
          value={checkoutInput.city}
          type="city"
          placeholder="City "
          autoComplete="City"
          error={!!error.city}
          helperText={error.city}
          required
        />
        

      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="state" required>
          State
        </FormLabel>
        <TextField
          id="state"
          name="state"
          onChange={handleInput}
          value={checkoutInput.state}
          type="state"
          placeholder="NY"
          autoComplete="State"
          error={!!error.state}
          helperText={error.state}
          required
        />
      

      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Zip / Postal code
        </FormLabel>
        <TextField
          id="zip"
          name="zipcode"
          onChange={handleInput}
          value={checkoutInput.zipcode}
          type="zip"
          placeholder="12345"
          autoComplete="shipping postal-code"
          error={!!error.zipcode}
          helperText={error.zipcode}
          required
        />
        

      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="country" required>
          Phone  number 
        </FormLabel>
        <TextField
          id="phone"
          name="phone"
          onChange={handleInput}
          value={checkoutInput.phone}
          type="phone"
          placeholder="Phone number"
          autoComplete="shipping country"
          error={!!error.phone}
          helperText={error.phone}
          required
        />


      </FormGrid>
      <FormGrid item xs={12}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid>
      <Button
          variant="contained"
          color="primary" // Couleur bleue
          onClick={(e)=>submitOrder(e, 'cod')}// Appel de la fonction de soumission
          style={{ float: 'right', marginTop: '20px' , marginLeft:'540px', marginBottom:'20px'}} // Positionnement en bas à droite
        >
          PlaceOrder
        </Button>
        <Button
          variant="contained"
          color="primary" // Couleur bleue
          onClick={(e)=>submitOrder(e, 'paypal')}// Appel de la fonction de soumission
          style={{ float: 'right' , marginLeft:'540px', marginBottom:'20px'}} // Positionnement en bas à droite
        >
          Online
        </Button>
        </Grid>
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
          <RemoveShoppingCartIcon sx={{ fontSize: 64, color: 'rgba(0, 0, 0, 0.5)', mb: 2 , mt:6}} />
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


  return (
    <div>
              
          <div className="modal fade" id="PayOnlineModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Online Payment</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                 <hr />
                 <PayPalButton 
                 createOrder={(data , actions) => createOrder( data , actions )}

                 onApprove={(data , actions) => onApprove( data , actions) }
                 />
                </div>
                
              </div>
            </div>
          </div>
    <Grid container spacing={3}>
     {cart_html}
    </Grid>
    </div>
  );
}