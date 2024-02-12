import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import './views-user.css'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const views = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const { setUser } = useAuth();

    const [openDialog, setOpenDialog] = useState(false);
    const [promptContent, setPromptContent] = useState('');
    const [promptUpdat, setPromptUpdat] = useState('');

    // Funciones para abrir y cerrar el cuadro de diálogo
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleLogout = () => {
        console.log("cierre de sesión");
        localStorage.removeItem('token');
        setUser({});
        navigate('/user');
    };

    //conexion a la base de datos principal
    useEffect(() => {
        fetch('http://localhost:3000/obtenerDB')
            .then(response => {
                if (!response.ok) {
                    throw new Error('servidor no responde');
                }
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(error => console.error("Error al obtener datos:", error));
    }, []);

    //conexion a las diferentes bases de datos 
    const handleShowPrompt = async (name_product) => {
        try {
            const response = await fetch('http://localhost:3000/visualizarPrompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name_product })
            });

            if (!response.ok) {
                throw new Error('Error al obtener el prompt');
            }
            const result = await response.json();
            setPromptContent(result.data.prompts);
            setPromptUpdat(result.data.name_bot);
            handleOpenDialog();
        } catch (error) {
            console.error("Error al mostrar el prompt:", error);
        }
    };

    //conexion para actualizar el prompt o asistente
    const handleUpdatePrompt = async () => {
        try {

            const response = await fetch('http://localhost:3000/actualizarPrompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name_product: promptUpdat,
                    updatedPrompt: promptContent
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el prompt');
            }
            const result = await response.json();
            setPromptContent(result.data.prompts);
            console.log("Prompt actualizado con éxito");
            handleOpenDialog();
        } catch (error) {
            console.error("Error al actualizar el prompt:", error);
        }
    };

    const handleProductClick = async (name_product) => {
        //navegación
        navigate('/user/usuario', { state: { name_product: name_product } });
    };

    const handleProducto = async () => {
        console.log("registrar producto");
        navigate('/user/administrador/ingresa');
    };

    const handleCliente = async () => {
        console.log("registrar usuario");
        navigate('/user/administrador/registro');
    };

    //cuadro que muestra la actividad si es prompt o asistente 
    const renderDialog = () => (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            className='cuadro'
            fullWidth={true}
            maxWidth="md"
        >
            <h4
                className='title'
                onChange={(e) => setPromptUpdat(e.target.value)}>
                {promptUpdat}
            </h4>
            <Button>
                {(promptUpdat === 'MARCUSS CORPORATIVE' || promptUpdat === 'BOT ASISTENTE PRUEBAS EDUARDO') && (
                    <a href="https://platform.openai.com/assistants" target="_blank" rel="noopener noreferrer" className='linkAsis'>
                        Ir al asistente
                    </a>
                )}
            </Button>
            <DialogContent>
                <textarea
                    value={promptContent}
                    onChange={(e) => setPromptContent(e.target.value)}
                    className='textArea'
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdatePrompt} color='primary' variant='contained'>
                    Actualizar
                </Button>

                <Button onClick={handleCloseDialog} color='primary' variant='contained'>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );


    return (
        <>
            <div>
                {renderDialog()}
            </div>
            <AppBar position="static" sx={{ backgroundColor: '#128C7E' }}>
                <Toolbar>
                    <Button color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </Button>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button color="inherit" onClick={handleProducto}>
                        <PlaylistAddIcon />
                    </Button>
                    <Button color="inherit" onClick={handleCliente} className='icono'>
                        <PersonAddIcon />
                    </Button>
                </Toolbar>
            </AppBar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Plataforma</TableCell>
                            <TableCell>Número</TableCell>
                            <TableCell>Actividad</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Métricas</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={uuidv4()}
                            >
                                <TableCell>
                                    <Button className="button-product" onClick={() => handleProductClick(product.name_product)}>
                                        {product.name_product}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <img src={product.plataforma} style={{ maxWidth: '50px' }} />
                                </TableCell>
                                <TableCell>
                                    {product.numero}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleShowPrompt(product.name_product)}>
                                        {product.asistente}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {product.descripcion}
                                </TableCell>
                                <TableCell>
                                    {product.estado}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );


};

export default views;