import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Load2 from "../../../Load2";
import { Button, Card, CardContent, CardHeader, TableContainer, Typography ,Table,TableRow,TableHead,Paper,TableBody} from "@mui/material";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Pagination } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
function ViewProduct  () {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f0f0f0',
      color: theme.palette.common.black,
      fontWeight: 'bold',
      fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const [loading, setLoading] = useState('true');
  const [viewProduct, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'View Product';

    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.log("No authentication token found.");
        return;
    }

    axios.get(`/api/view-product?page=${currentPage}`, { // Inclure le numéro de page dans l'URL de la requête
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if (res.status === 200) {
            setProduct(res.data.products.data);
            setLoading(false);
        }
    }).catch(err => {
        console.log(err);
        setLoading(false);
    });
}, [currentPage]); // Ajouter currentPage comme dépendance pour recharger les données lorsque currentPage change



const handleChangePage = (event, value) => {
  setCurrentPage(value);
};


var  displayProduct_data = '';

if(loading)
    {
        return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"80vh"}}>
        <Load2/>
   </div>
    }
    else
    {
      var ProdStatus = ''; 

      displayProduct_data = viewProduct.map((item) => {
        if (item.status == '0')
        {
          ProdStatus = 'shown';
        }
        else if (item.status == '1')
        {
          ProdStatus = 'Hidden';
        }
            return (
                <StyledTableRow key={item.id}>
                    <StyledTableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    {item.id}
                    </StyledTableCell>
                    <StyledTableCell align="right"  >{item.category.name}</StyledTableCell>
                    <StyledTableCell align="right">{item.name}</StyledTableCell>
                    <StyledTableCell align="right">{item.selling_price}</StyledTableCell>
                    <StyledTableCell align="right"><img src={`http://127.0.0.1:8000/${item.image}`} width="70px" alt="Image" /></StyledTableCell>
                    <StyledTableCell align="right">
                        <Link to={`/admin/edit-product/${item.id}`} style={{ textDecoration: "none"}} >
                        <Button variant="contained"  size="small">
                                                    <ModeEditIcon/>
                        </Button>
                        </Link>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{
                          backgroundColor:'green',
                          borderRadius:'5px',
                          textAlign:'center',
                          fontWeight: 'bold', // Éventuellement, rendre le texte en gras
                        }}
                      >
                        {ProdStatus}
                      </Typography>
                    </StyledTableCell>
                </StyledTableRow>
            )
        });
    }


  return (
    <Card variant="outlined" sx={{ mt: 4, mx: 4, p: 2 }}> 
        <CardHeader
      title={
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Product List
          <Link to="/admin/add-product" style={{ textDecoration: "none" }}>
            <Button variant="contained" style={{backgroundColor:'#020873'}} size="small">
              <AddIcon/> Product
            </Button>
          </Link>
        </Typography>
      }
      sx={{ backgroundColor: "#f0f0f0", p: 2 }}
    />


        <CardContent>  
            <TableContainer component={Paper}>

                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                          <TableRow>
                              <StyledTableCell style={{ fontWeight: 'bold' }}>ID</StyledTableCell>
                              <StyledTableCell align="right" style={{ fontWeight: 'bold' }}>Category Name</StyledTableCell>
                              <StyledTableCell align="right" style={{ fontWeight: 'bold' }}>Product Name</StyledTableCell>
                              <StyledTableCell align="right" style={{ fontWeight: 'bold' }}>Selling Price</StyledTableCell>
                              <StyledTableCell align="right" style={{ fontWeight: 'bold' }}>Image</StyledTableCell>
                              <StyledTableCell align="right" style={{ fontWeight: 'bold' }}>Edit</StyledTableCell>
                              <StyledTableCell align="right" style={{ fontWeight: 'bold' }}>Status</StyledTableCell>
                          </TableRow>
                      </TableHead>
                        <TableBody>
                        {displayProduct_data}
                        </TableBody>  
                  </Table>

            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    count={10} // Nombre total de pages
                    page={currentPage} // Page actuelle
                    onChange={handleChangePage} // Fonction appelée lors du changement de page
                    // color="secondary" // Couleur de la pagination
                />
            </div>
        </CardContent> 

</Card>
  )
}

export default ViewProduct