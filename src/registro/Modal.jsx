import React, { useEffect, useState } from 'react'
import './style.scss'
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Modal = () => {
    const navigate = useNavigate();
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const [values, setValues] = useState({
        user: '',
        password: '',
        role: ''
    })

    const [objRoles, setObjRoles] = useState([]);



    const getRoles = async (event) => {
        axios.get('http://localhost:3000/roles')
            .then(res => {
                setObjRoles(res.data.objData);
            })
    }

    const handleChange = (event) => {
        console.log('test');
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (values.user === '' || values.password === '' || values.role === '') {
            alert('Por favor, complete todos los campos del formulario');
            return;
        }
        console.log('datos: ');
        console.log(values);
        axios.post('http://localhost:3000/registro', values)
            .then(res => {
                console.log(res);
                setIsFormSubmitted(true);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        getRoles();
    }, []);

    useEffect(() => {
        if (isFormSubmitted) {
            navigate('/user');
        }
    }, [isFormSubmitted, navigate]);



    return (
        <>
            <div className="modalContainer" >
                <div className="modal" >
                    <header className="modal_header">
                        <h2 className="modal_header-title">
                            REGISTRAR
                        </h2>
                    </header>

                    <main className="modal_content">
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                autoFocus
                                type='text'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Usuario'
                                placeholder='Usuario'
                                value={values.user}
                                onChange={e => setValues({ ...values, user: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                autoFocus
                                type='text'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Constraseña'
                                placeholder='Contraseña'
                                value={values.password}
                                onChange={e => setValues({ ...values, password: e.target.value })}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label=""
                                    onChange={e => setValues({ ...values, role: e.target.value })}
                                >
                                    {
                                        objRoles.map((value ,index) => {
                                            console.log(value);
                                            return <MenuItem value={value.rol}>{value.rol}</MenuItem>
                                        })
                                    }
                                    
                                </Select>
                            </FormControl>
                            
                        </form>
                    </main>

                    <footer className="modal_footer">
                        <Button color='primary'
                            className='boton-esp'
                            variant='contained'
                            size='large'
                            onClick={handleSubmit}>
                            ACEPTAR
                        </Button>
                    </footer>
                </div>
            </div>
        </>
    )
}
export default Modal