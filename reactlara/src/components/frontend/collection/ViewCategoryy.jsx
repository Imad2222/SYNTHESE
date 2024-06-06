import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Load from '../../../Load';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../layouts/frontend/Navbar';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from '../../../component/getLPTheme';
import CategoryIcon from '@mui/icons-material/Category';
import Photo from '../../../images/CATGR2.png';
import Footer from '../../../layouts/frontend/Footer';
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
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired,
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

export default function ViewCategoryy() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);

  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const handleImageClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    axios.get('/api/getCategory').then(res => {
      if (res.data.status === 200) {
        setCategory(res.data.category);
        setLoading(false);
      }
    });
  }, []);

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
    var showCategoryList = category.map((item, index) => (
      <Box key={index} sx={{ width: '100%', maxWidth: '50%', p: 2, boxSizing: 'border-box' }} className="categoryBox"  onClick={handleImageClick}>
        <Box sx={{ p: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', '&:hover': { boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' } }}>
          <Link to={`/collection/${item.slug}`} style={{ textDecoration: 'none' }}>
            <img src={Photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Typography variant="h5" style={{ marginTop: '8px' }}>{item.slug}</Typography>
          </Link>
        </Box>
      </Box>
    ));
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
                component="h2"
                variant="h2"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignSelf: 'center',
                  textAlign: 'center',
                }}
              >
                All &nbsp;
                <Typography
                  component="span"
                  variant="h2"
                  sx={{
                    color: (theme) => theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                  }}
                >
                  Category <CategoryIcon />
                </Typography>
              </Typography>

              <Typography variant="body1" textAlign="center" color="text.secondary">
                {/* Your description goes here */}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} alignSelf="center" spacing={1} useFlexGap sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>
                {/* Additional components can be added here if needed */}
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
                      {showCategoryList}
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Container>
        </Box>
        <Footer />
        <ToggleCustomTheme
          showCustomTheme={showCustomTheme}
          toggleCustomTheme={toggleCustomTheme}
        />
      </ThemeProvider>
    </>
  );
}
