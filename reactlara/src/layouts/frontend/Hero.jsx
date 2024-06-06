import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Home from '../../components/frontend/Home';
import jj from '../../images/BURGER.jpg'
import jjj from '../../images/A.jpg'
import jjjj from '../../images/E.jpg'
import { useNavigate } from 'react-router-dom';

// Sample product data
const products = [
  { id: 1, name: 'RRS', description: 'Snack meal leftovers : Burger / Sandwith ...', image: jj },
  { id: 2, name: 'RRB', description: 'Leftover Bakery meal : croissants /...', image: jjj },
  { id: 3, name: 'PPED', description: 'Packaged products with expiration dates close', image: jjjj },
];

export default function Hero() {

  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');

  const handleImageClick = () => {
    navigate('/login');
  };
  
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
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
        <Typography
          component="h1"
          variant="h1"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignSelf: 'center',
            textAlign: 'center',
          }}
        >
          Our latest&nbsp;
          <Typography
            component="span"
            variant="h1"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
            }}
          >
           services
          </Typography>
        </Typography>

        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          {token ? <Home /> : ""}
        </Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="170"
                  image={product.image}
                  onClick={handleImageClick}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
