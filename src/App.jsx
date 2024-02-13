import './App.scss';
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import axios from 'axios';

function App() {
  const navigate = useNavigate();

  const {  setUser } = useAuth();
  const [step, setStep] = useState(1); // Controla el paso actual en el proceso de login
  const [values, setValues] = useState({
    user: '',
    password: '',
    codigo: '' // Asegúrate de que este campo se maneje correctamente
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Enviar solicitud de ingreso o verificar código según el paso
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step === 1) {
      try {
        const response = await axios.post('http://localhost:3000/ingreso', {
          user: values.user,
          password: values.password,
        });
        // Verifica la respuesta para cambiar al paso de verificación del código
        if (response.data.Message === "Código de verificación enviado al correo.") {
          setStep(2); // Cambia al paso de ingreso del código
        } else {
          alert(response.data.Message || 'Credenciales inválidas');
        }
      } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Error al intentar iniciar sesión, por favor intente de nuevo.');
      }
    } else if (step === 2) {
      verificarCodigo();
    }
  };

  // Verifica el código de verificación
  const verificarCodigo = async () => {
    try {
      const response = await axios.post('http://localhost:3000/verificarCodigo', {
        user: values.user,
        codigo: values.codigo,
      });
      if (response.data.message === 'Código verificado correctamente.') {
       handleLoginSuccess(response.data.message);
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
    }
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

  const redirigirSegunRol = (user) => {
    if (user.rol === 'admin') {
      navigate('/user/administrador');
    } else if (user.rol === 'user') {
      navigate('/user/usuario');
    }
  };

  return (
    <>
      <div className="modalContainer">
        <div className="modal">
          <header className="modal_header">
            <h2 className="modal_header-title">Ingresar</h2>
          </header>

          {step === 1 && (
            <main className="modal_content">
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
            </main>
          )}

          {step === 2 && (
            <main className="modal_content">
              <TextField
                fullWidth
                type='text'
                color='primary'
                margin='normal'
                variant='outlined'
                label='Código de Verificación'
                placeholder='Ingresa el código'
                name='codigo'
                value={values.codigo}
                onChange={handleChange}
              />
            </main>
          )}

          <footer className="modal_footer">
            <Button
              color='primary'
              variant='contained'
              size='large'
              onClick={handleSubmit}
            >
              ACEPTAR
            </Button>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;

/*import './App.scss'
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
export default App*/