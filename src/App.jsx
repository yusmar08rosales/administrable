import './App.scss'
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext'
import axios from 'axios';

function App() {

  const { user, setUser} = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    user: '',
    password: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.user === '' || values.password === '') {
      alert('Por favor, complete todos los campos del formulario');
      return;
    }

    axios.post('http://localhost:3000/ingreso', values)
      .then(res => {
        console.log("Respuesta del servidor:", res);
        if (res.data.Message === "Inicio de sesión exitoso") {
          handleLoginSuccess(res.data);
          // Guardar el nombre de usuario en el almacenamiento local
          localStorage.setItem('user', values.user);
          // Opcional: Guardar el token JWT si lo vas a usar más adelante
          localStorage.setItem('token', res.data.token);
        } else {
          alert('Credenciales inválidas');
        }
      })
      .catch(err => {
        console.log(err);
        alert('Error al intentar iniciar sesión, credenciales inválidas');
      });
  };

  const handleLoginSuccess = (userData) => {
    const base64Payload = userData.token.split('.')[1];
    const payload = atob(base64Payload);
    const userPayload = JSON.parse(payload);

    const userRole = userPayload.role;
    console.log("userRole:", userRole);

    const userInfo = { token: userData.token, rol: userRole };
    setUser(userInfo);
    redirigirSegunRol(userInfo);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const redirigirSegunRol = (user) => {
    if (user.rol === 'admin') {
      navigate('/user/administrador');
    } else if (user.rol === 'user') {
      navigate('/user/usuario');
    }
  };

  return (
    <>
      <div className="modalContainer" >
        <div className="modal" >
          <header className="modal_header">
            <h2 className="modal_header-title">
              Ingresar
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
                name='user'
                value={values.user}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type='password'
                color='primary'
                margin='normal'
                variant='outlined'
                label='Contraseña'
                placeholder='Contraseña'
                name='password'
                value={values.password}
                onChange={handleChange}
              />
            </form>
          </main>

          <footer className="modal_footer">
              <Button
                color='primary'
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

export default App