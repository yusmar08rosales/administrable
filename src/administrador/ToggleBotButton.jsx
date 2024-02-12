import React, { useState, useEffect } from "react";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const ToggleBotButton = ({ userId, productName }) => {
  const [isActive, setIsActive] = useState(null);

  useEffect(() => {

    if (!userId || !productName || productName === "MARCUSS TRANSCRIPTOR" || productName === "MARCUSS PREMIUM") {
      setIsActive(null); // Si el producto no debe mostrar el switch, mantenemos isActive como null.
      return;
    }

    // Cargar el estado inicial del botón al montar el componente y cuando cambien userId o productName
    const fetchIsUserBlacklisted = async () => {
      if (!userId || !productName) {
        setIsActive(null); // Manejar el caso en que userId o productName no estén definidos
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3000/api/bot/status/${productName}/${userId}`
        );
        const data = await response.json();
        console.log("data blacklist: ", data);
        setIsActive(data.isBlacklisted == false); // El bot está activo si el usuario no está en la lista negra
      } catch (error) {
        console.error("Error al verificar el estado del bot:", error);
        setIsActive(null); // En caso de error, resetear el estado
      }
    };

    fetchIsUserBlacklisted();
  }, [userId, productName]);

  const toggleBotStatus = async () => {
    if (isActive === null || !userId || !productName) return; // No hacer nada si el estado es null o si falta userId o productName

    try {
      const response = await fetch(
        `http://localhost:3000/api/bot/toggle/${productName}/${userId}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (data.success) {
        setIsActive(!isActive); // Cambiar el estado del botón si el backend responde con éxito
      } else {
        throw new Error(data.message || "Error al cambiar el estado del bot");
      }
    } catch (error) {
      console.error("Error al cambiar el estado del bot:", error);
    }
  };

  // Si el producto es MARCUSS TRANSCRIPTOR o MARCUSS PREMIUM, no renderizar el componente
  if (productName === "MARCUSS TRANSCRIPTOR" || productName === "MARCUSS PREMIUM") {
    return null;
  }

  return (
    <div onClick={toggleBotStatus}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={isActive} // Usa el estado `isActive` para controlar el componente
              onChange={toggleBotStatus} // Maneja el cambio cuando el usuario interactúa con el switch
            />
          }
          label={isActive === null ? "Cargando..." : isActive ? "Bot Activo" : "Bot Desactivado"}
        />
      </FormGroup>
    </div>
  );
};

export default ToggleBotButton;
