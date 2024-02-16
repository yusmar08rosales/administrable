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

  const [codigo, setCodigo] = useState({
    digito1: '',
    digito2: '',
    digito3: '',
    digito4: '',
    digito5: '',
    digito6: '',
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
    const codigoCompleto = Object.values(codigo).join('');
    try {
      const response = await fetch('http://localhost:3000/verificarCodigo', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: values.user, codigo: codigoCompleto }),
      });
      const data = await response.json(); // Convertir respuesta a JSON
  
      if (data.message === 'Código verificado correctamente.') {
        handleLoginSuccess(data); // Esta función necesita ser ajustada si pretendes usarla aquí
      } else{
        alert("codigo ingresado erroneo");
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      alert('Error al verificar el código');
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

  const handleCodigoChange = (event) => {
    const { name, value } = event.target;
    if (/^\d?$/.test(value)) {
      setCodigo(prev => ({ ...prev, [name]: value }));
      if (value) {
        const nextDigit = parseInt(name.charAt(name.length - 1), 10) + 1;
        if (nextDigit <= 6) document.querySelector(`input[name=digito${nextDigit}]`)?.focus();
      }
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
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <input 
                className='input-linea'
                key={`digito${index}`}
                type="text"
                margin="normal"
                variant="outlined"
                name={`digito${index}`}
                value={codigo[`digito${index}`]}
                onChange={handleCodigoChange}
              />
            ))}
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