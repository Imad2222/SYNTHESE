
import { Container, Typography, Box, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Tky = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <CheckCircleOutlineIcon style={{ fontSize: 80, color: 'green' }} />
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Order placed successfully
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Your order has been placed successfully. Always be with us and benefit again from these prizes .
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          style={{ marginTop: '20px' }}
          href="/collection"
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}

export default Tky;
