import * as React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Load from '../../../Load';
import Swal from "sweetalert2";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import Navbar from "../../../layouts/frontend/Navbar";
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from '../../../component/getLPTheme';



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



  
function ViewProductt() {

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  const productCount = product.length;

  // slug jay mn route :slug
  const { slug } = useParams();


  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });


  useEffect(() => {
    axios.get(`/api/fetchProducts/${slug}`).then(res => {
      if (res.data.status === 200) {
        setProduct(res.data.product_data.product);
        setCategory(res.data.product_data.category);
        setLoading(false);
      }
      else if (res.data.status === 400) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: res.data.message,
        });
      }
      else if (res.data.status === 404) {
        navigate('/collection')
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message,
        });
      }
    });
  }, [slug, navigate]);

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
  else {
    var showProductList = '';
    if (productCount) 
    {
      showProductList = product.map((item, index) => (
        <Box key={index} sx={{ width: '100%', maxWidth: '25%', p: 2, boxSizing: 'border-box' }}>
          <Box sx={{ p: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', '&:hover': { boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' } }}>
            <Link to={`/collection/${item.category.slug}/${item.slug}`} style={{ textDecoration: 'none' }}>
              <img src={`http://127.0.0.1:8000/${item.image}`} alt={item.slug} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              {/* Ajoutez height: '200px' et objectFit: 'cover' pour que les images aient la même taille */}
              <Link to={`/collection/${item.category.slug}/${item.slug}`}>

              <Typography variant="h5" style={{ marginTop: '8px' }}>{item.slug}</Typography>
              

              </Link>
            </Link>
          </Box>
        </Box>
      ));
    }
    else 
    {
      
      // Si aucun produit n'est disponible
    showProductList = (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px', // Hauteur du message
                borderRadius: '8px', // Bord arrondi
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Ombre légère
                padding: '20px', // Espacement intérieur
            }}
            >
            <ReportGmailerrorredIcon sx={{ fontSize: 64, marginRight: '10px', color: '#f44336' }} /> <br/>{/* Icon */}
            <Typography variant="h4">No Product Found in this Category Now !</Typography> {/* Message */}
        </Box>
      );
    }
  }



  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };


  return (
    <>
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
    <Navbar  mode={mode} toggleColorMode={toggleColorMode}/>
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
            Our&nbsp;
            <Typography
              component="span"
              variant="h3"
              sx={{
                color: (theme) => theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
              Product
            </Typography>
          </Typography>

          <Typography variant="body1" textAlign="center" color="text.secondary">
            {/* Votre description ici */}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} alignSelf="center" spacing={1} useFlexGap sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Typography component="H4" variant="H4">
                {category.name}
            </Typography>
          </Stack>
        </Stack>

        <Box
          id="image"
          sx={{
            mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 200, sm: 700 },
            width: '100%',
            backgroundImage: (theme) => theme.palette.mode === 'light' ? 'url("/static/images/templates/templates-images/hero-light.png")' : 'url("/static/images/templates/templates-images/hero-dark.png")',
            backgroundSize: 'cover',
            borderRadius: '10px',
            outline: '1px solid',
            outlineColor: (theme) => theme.palette.mode === 'light' ? alpha('#BFCCD9', 0.5) : alpha('#9CCCFC', 0.1),
            boxShadow: (theme) => theme.palette.mode === 'light' ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}` : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
          }}
        >
          <div>
            <div className="py-3">
              <div className="container">
                <div className="row">
                  {showProductList}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </Box>
    <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
    </ThemeProvider>
    </>
  )
}

export default ViewProductt;
