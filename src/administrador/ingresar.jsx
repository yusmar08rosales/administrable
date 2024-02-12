import React, { useState } from "react";
import axios from 'axios';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import instagramIcon from '/public/icons8-instagram-48.png';
import whatsappIcon from '/public/icons8-whatsapp-48.png';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        objectfit: 'fill',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url(${whatsappIcon})`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#06d755',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode,
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '50px',
            backgroundImage: `url(${instagramIcon})`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#7505ad',
        borderRadius: 20 / 2,
    },
}));

const Ingresa = () => {

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [switchState, setSwitchState] = useState(true);
    const [values, setValues] = useState({
        name_product: '',
        asistente: '',
        descripcion: '',
        estado: '',
        numero: '',
        plataforma: '',
        dbURI: '',
        codigo: '58',
        cuenta: '@'
    })

    const handleSubmit = (event) => {
        event.preventDefault();

        // Asegúrate de que todos los campos necesarios están completos
        if (!values.name_product || !values.asistente || !values.descripcion || !values.estado || !values.numero || !values.plataforma || !values.dbURI) {
            alert('Por favor, complete todos los campos del formulario');
            return;
        }

        let updatedValues = {
            ...values,
            plataforma: values.plataforma === 'Meta' ? '../public/meta.png' : '../public/bot-wpp.png',
        };

        if (switchState) {
            updatedValues.numero = `${values.codigo}${values.numero}`;
            delete updatedValues.codigo;
        } else {
            updatedValues.numero = values.cuenta;
        }

        // Procede a enviar updatedValues
        axios.post('http://localhost:3000/registroProduct', updatedValues)
            .then(res => {
                console.log(res);
                setIsFormSubmitted(true);
                setMessage('Producto registrado con éxito');
                setMessageType('success');
            })
            .catch(err => {
                console.log(err);
            });
    };


    const handleSwitchChange = (event) => {
        setSwitchState(event.target.checked);
    };

    return (
        <>
            <div className="modalContainer" >
                <div className="botones">
                    <AppBar position="static" sx={{ backgroundColor: "#128C7E" }}>
                        <Toolbar>
                            <Link className="button-back" to={"/user/administrador"}>
                                <ArrowBackIcon />
                            </Link>
                        </Toolbar>
                    </AppBar>
                </div>
                
                <div className="modal" >
                    <header className="modal_header">
                        <h2 className="modal_header-title">
                            REGISTRAR PRODUCTO
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
                                label='Nombre del producto'
                                placeholder='Nombre del producto'
                                value={values.name_product}
                                onChange={e => setValues({ ...values, name_product: e.target.value })}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Plataforma</InputLabel>
                                <Select
                                    label='Plataforma'
                                    value={values.plataforma}
                                    onChange={e => setValues({ ...values, plataforma: e.target.value })}
                                >
                                    <MenuItem value="Meta">Meta</MenuItem>
                                    <MenuItem value="Baileys">Baileys</MenuItem>

                                </Select>
                            </FormControl>

                            <FormGroup>
                                <FormControlLabel onClick={handleSwitchChange}
                                    control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
                                />
                            </FormGroup>

                            {switchState ? (
                                <div className="whatsappInputs">

                                    <Select
                                        className="codigo"
                                        label='numero'
                                        value={values.codigo}
                                        onChange={e => setValues({ ...values, codigo: e.target.value })}
                                    >
                                        <MenuItem value="93">93</MenuItem>
                                        <MenuItem value="355">355</MenuItem>
                                        <MenuItem value="213">213</MenuItem>
                                        <MenuItem value="244">244</MenuItem>
                                        <MenuItem value="54">54</MenuItem>
                                        <MenuItem value="374">374</MenuItem>
                                        <MenuItem value="297">297</MenuItem>
                                        <MenuItem value="61">61</MenuItem>
                                        <MenuItem value="43">43</MenuItem>
                                        <MenuItem value="501">501</MenuItem>
                                        <MenuItem value="229">229</MenuItem>
                                        <MenuItem value="591">591</MenuItem>
                                        <MenuItem value="55">55</MenuItem>
                                        <MenuItem value="359">359</MenuItem>
                                        <MenuItem value="237">237</MenuItem>
                                        <MenuItem value="56">56</MenuItem>
                                        <MenuItem value="86">86</MenuItem>
                                        <MenuItem value="57">57</MenuItem>
                                        <MenuItem value="506">506</MenuItem>
                                        <MenuItem value="385">385</MenuItem>
                                        <MenuItem value="53">53</MenuItem>
                                        <MenuItem value="809">809</MenuItem>
                                        <MenuItem value="829">829</MenuItem>
                                        <MenuItem value="849">849</MenuItem>
                                        <MenuItem value="593">593</MenuItem>
                                        <MenuItem value="503">503</MenuItem>
                                        <MenuItem value="372">372</MenuItem>
                                        <MenuItem value="358">358</MenuItem>
                                        <MenuItem value="33">33</MenuItem>
                                        <MenuItem value="220">220</MenuItem>
                                        <MenuItem value="995">995</MenuItem>
                                        <MenuItem value="502">502</MenuItem>
                                        <MenuItem value="592">592</MenuItem>
                                        <MenuItem value="509">509</MenuItem>
                                        <MenuItem value="504">504</MenuItem>
                                        <MenuItem value="852">852</MenuItem>
                                        <MenuItem value="91">91</MenuItem>
                                        <MenuItem value="98">98</MenuItem>
                                        <MenuItem value="972">972</MenuItem>
                                        <MenuItem value="39">39</MenuItem>
                                        <MenuItem value="81">81</MenuItem>
                                        <MenuItem value="876">876</MenuItem>
                                        <MenuItem value="850">850</MenuItem>
                                        <MenuItem value="82">82</MenuItem>
                                        <MenuItem value="856">856</MenuItem>
                                        <MenuItem value="231">231</MenuItem>
                                        <MenuItem value="853">853</MenuItem>
                                        <MenuItem value="356">356</MenuItem>
                                        <MenuItem value="52">52</MenuItem>
                                        <MenuItem value="377">377</MenuItem>
                                        <MenuItem value="976">976</MenuItem>
                                        <MenuItem value="977">977</MenuItem>
                                        <MenuItem value="505">505</MenuItem>
                                        <MenuItem value="507">507</MenuItem>
                                        <MenuItem value="595">595</MenuItem>
                                        <MenuItem value="51">51</MenuItem>
                                        <MenuItem value="63">63</MenuItem>
                                        <MenuItem value="351">351</MenuItem>
                                        <MenuItem value="787">787</MenuItem>
                                        <MenuItem value="939">939</MenuItem>
                                        <MenuItem value="974">974</MenuItem>
                                        <MenuItem value="40">40</MenuItem>
                                        <MenuItem value="7">7</MenuItem>
                                        <MenuItem value="232">232</MenuItem>
                                        <MenuItem value="34">34</MenuItem>
                                        <MenuItem value="886">886</MenuItem>
                                        <MenuItem value="66">66</MenuItem>
                                        <MenuItem value="868">868</MenuItem>
                                        <MenuItem value="90">90</MenuItem>
                                        <MenuItem value="598">598</MenuItem>
                                        <MenuItem value="58">58</MenuItem>
                                        <MenuItem value="84">84</MenuItem>
                                        <MenuItem value="260">260</MenuItem>
                                    </Select>


                                    <TextField
                                        className="numero"
                                        fullWidth
                                        autoFocus
                                        type='text'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Número'
                                        placeholder='Número'
                                        value={values.numero}
                                        onChange={e => setValues({ ...values, numero: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div className="instagramInput">
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        type='text'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Usuario de Instagram'
                                        placeholder='Usuario de Instagram'
                                        value={values.cuenta}
                                        onChange={e => setValues({ ...values, cuenta: e.target.value })}
                                    />
                                </div>
                            )}

                            <FormControl fullWidth>
                                <InputLabel>Actividad</InputLabel>
                                <Select
                                    label='Actividad'
                                    value={values.asistente}
                                    onChange={e => setValues({ ...values, asistente: e.target.value })}
                                >
                                    <MenuItem value="Asistente">Asistente</MenuItem>
                                    <MenuItem value="Prompt">Prompt</MenuItem>

                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                autoFocus
                                type='text'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Descripción'
                                placeholder='Descripción'
                                value={values.descripcion}
                                onChange={e => setValues({ ...values, descripcion: e.target.value })}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    label='Estado'
                                    value={values.estado}
                                    onChange={e => setValues({ ...values, estado: e.target.value })}
                                >
                                    <MenuItem value="A">Activo</MenuItem>
                                    <MenuItem value="I">Inactivo</MenuItem>
                                    <MenuItem value="R">Revisión</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                autoFocus
                                type='text'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='dbURI'
                                placeholder='dbURI'
                                value={values.dbURI}
                                onChange={e => setValues({ ...values, dbURI: e.target.value })}
                            />

                            <TextField
                                fullWidth
                                autoFocus
                                type='text'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='ID'
                                placeholder='ID'
                                value={values.botClientId}
                                onChange={e => setValues({ ...values, botClientId: e.target.value })}
                            />
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
                        {isFormSubmitted && (
                            <div style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                backgroundColor: messageType === 'success' ? 'green' : 'red',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '50px',
                                marginRight: '35%',
                            }}>
                                {message}
                            </div>
                        )}
                    </footer>
                </div>
            </div>
        </>
    );
}

export default Ingresa;
