import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import TapasIcon from '@mui/icons-material/Tapas';
const LogoCollection = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        color="text.secondary"
      >
        Our Services
      </Typography>
      <Grid container justifyContent="center" sx={{ mt: 0.5, opacity: 0.6 }}>
        <Grid item>
          <LunchDiningIcon
            style={{
              width: '100px',
              height: '80px',
              margin: '0 32px',
              opacity: 0.7,
              color: isLightMode ? 'black' : 'white',
            }}
          />
        </Grid>
        <Grid item>
          <LocalPizzaIcon
            style={{
              width: '100px',
              height: '80px',
              margin: '0 32px',
              opacity: 0.7,
              color: isLightMode ? 'black' : 'white',
            }}
          />
        </Grid>
        <Grid item>
          <RamenDiningIcon
            style={{
              width: '100px',
              height: '80px',
              margin: '0 32px',
              opacity: 0.7,
              color: isLightMode ? 'black' : 'white',
            }}
          />
        </Grid>
        <Grid item>
          <SoupKitchenIcon
            style={{
              width: '100px',
              height: '80px',
              margin: '0 32px',
              opacity: 0.7,
              color: isLightMode ? 'black' : 'white',
            }}
          />
        </Grid>
        <Grid item>
          <TapasIcon
            style={{
              width: '100px',
              height: '80px',
              margin: '0 32px',
              opacity: 0.7,
              color: isLightMode ? 'black' : 'white',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LogoCollection;
