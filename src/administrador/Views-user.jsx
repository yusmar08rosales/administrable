import React from "react";
import "./views-user.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";


import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

//iconos
import LogoutIcon from "@mui/icons-material/Logout";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

//figuras
import ToggleBotButton from "./ToggleBotButton"; //switch
import DatePicker from "react-datepicker";//calendario
import "react-datepicker/dist/react-datepicker.css";

const UserView = () => {

  /*-------------------
           ESTADOS
  -------------------*/
  const navigate = useNavigate();//navegacion entre paginas
  const location = useLocation();//localizacion para la localizacion de los usuarios
  const { setUser } = useAuth();//autenticacion para el control de las rutas

  const [nameProduct, setNameProduct] = useState("");//estado de todos los productos
  const [usuarios, setUsuarios] = useState([]);//estado de todos los usuarios
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);//estado de los usuarios seleccionados
  const [resultados, setResultados] = useState({
    statusScroll: false,
    data: [],
  }); //estado de todos los resultados
  const [paginaActual, setPaginaActual] = useState(1);//estado de pagina actual
  const [totalSuscriptores, setTotalSuscriptores] = useState(0);//estado que muesta el numero total de suscriptores
  const [selectedDate, setSelectedDate] = useState(new Date());//estado de fecha y hora


  //estado para cambiar la visibilidad
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); //calendario
  const [showSearchBar, setShowSearchBar] = useState(false);//barra de busqueda de chat
  const [llamada, setLlamada] = useState(false);//llamadas de usuarios
  const [hayMasUsuarios, setHayMasUsuarios] = useState(true);//usuarios nuevos

  //estado de los scroll
  const bottomRef = useRef(null); //scroll de los usuarios
  const vistaChatboxRef = useRef(null);//scroll de mensajes

  //barra de busqueda
  const [searchTerm, setSearchTerm] = useState("");//barra de busqueda de usuarios
  const [searchTermChat, setSearchTermChat] = useState("");// barra de de busqueda de chat

  //estados laura
  const [cargando, setCargando] = useState(false);
  const [bloquearCarga, setBloquearCarga] = useState(false);
  
  /*--------------------------------------------------------------------
    localiza el producto seleccionado para cargar toda su informacion
  --------------------------------------------------------------------*/
  useEffect(() => {
    if (location.state && location.state.name_product && !llamada) {
      const name_product = location.state.name_product;
      if (nameProduct !== name_product) {
        cargarUsuarios(name_product, paginaActual, searchTerm, selectedDate);
        setNameProduct(name_product);
        setLlamada(true);
      }
    } else {
      setLlamada(false);
    }
  }, [location.state, llamada]);

  /*------------------------
      CONEXION CON LA API
  ------------------------*/
  //obtener los numeros de telefono
  const cargarUsuarios = async (nameProduct, paginaActual, searchTerm, selectedDate) => {
    try {
      const response = await fetch("http://localhost:3000/obtenerNumeros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name_product: nameProduct,
          page: paginaActual,
          searchTerm: searchTerm,
          selectedDate: selectedDate,
        }),
      });

      if (!response.ok) {
        // Lanza un error si la respuesta de la API no es exitosa
        throw new Error("Error al cargar los usuarios");
      }
      const nuevosUsuarios = await response.json();
      console.log("nuevosUsuarios: ", nuevosUsuarios);
      setUsuarios(prevUsuarios => paginaActual === 1 ? nuevosUsuarios : [...prevUsuarios, ...nuevosUsuarios]);

      setHayMasUsuarios(nuevosUsuarios.length >= 10);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setCargando(false); // Restablecer indicador de carga
    }
  };

  //obtener los mensajes de cada usuario
  const obtenerMsm = async (usuario, name_product) => {
    console.log("usuario: ", usuario);
    setUsuarioSeleccionado(usuario);
    try {
      // Marcar mensajes como leídos
      fetch("http://localhost:3000/marcarComoLeidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: usuario, name_product: name_product }),
      });

      const response = await fetch("http://localhost:3000/consulta_msm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: usuario, name_product: name_product }),
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setResultados({
        statusScroll: true,
        data: data.mensajes,
        nombreUsuario: data.nombreUsuario,
      });
    } catch (error) {
      console.error(error);
    }
  };

  //obtener los mensajes de cada usuario para el estado del scroll de mensajes
  const obtenerMsm2 = async (usuario, name_product) => {
    console.log("usuario: ", usuario);
    setUsuarioSeleccionado(usuario);
    try {
      const response = await fetch("http://localhost:3000/consulta_msm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: usuario, name_product: name_product }),
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setResultados({
        statusScroll: false,
        data: data.mensajes,
        nombreUsuario: data.nombreUsuario,
      });
    } catch (error) {
      console.error(error);
    }
  };

  //marca a los usuarios si no se ha leido su chat
  const marcarTodosComoLeidos = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/marcarTodosComoLeidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name_product: nameProduct }),
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo marcar los mensajes como leídos");
      }

      const data = await response.json();
      console.log(data);
      // Opcional: Actualiza la UI si es necesario, por ejemplo, recargando los usuarios/mensajes
      cargarUsuarios(
        nameProduct,
        paginaActual,
        searchTerm,
        selectedDate.toISOString()
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener total de suscriptores
  useEffect(() => {
    const obtenerTotalSuscriptores = async () => {
      if (!nameProduct) return; // Asegúrate de que nameProduct esté definido

      try {
        const url = `http://localhost:3000/obtenerTotalSuscriptores?name_product=${encodeURIComponent(
          nameProduct
        )}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Error al obtener el total de suscriptores");
        }

        const { totalSuscriptores } = await response.json();
        setTotalSuscriptores(totalSuscriptores); // Actualiza el estado con el total obtenido
      } catch (error) {
        console.error("Error al obtener total de suscriptores:", error);
      }
    };

    obtenerTotalSuscriptores();
  }, [nameProduct]);

  /*-----------------
          BOTONES
    -----------------*/
  //cierre de sesión
  const handleLogout = () => {
    console.log("cierre de sesión");
    localStorage.removeItem("token");
    setUser({});
    navigate("/user");
  };

  //estado de la barra de búsqueda me los mensajes
  const toggleSearchBar = () => {
    setShowSearchBar((prevShow) => !prevShow);
  };

  //estado del calendario 
  const toggleDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  //selección de fecha para obtener solo a los usuarios que escribieron en dicha fecha
  const handleDateChange = (selectedDate) => {
    setSelectedDate(date || new Date());
    setIsDatePickerVisible(false);
    cargarUsuarios(nameProduct, 1, searchTerm, selectedDate);
  };
  /*----------------
        SCROLL
  ----------------*/
  //usuarios
  /*useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Verifica si el elemento observado está intersectando
        if (entries[0].isIntersecting && hayMasUsuarios) {
          setPaginaActual((prevPage) => prevPage + 1);
          console.log("Error línea 347");
        }
      },
      { threshold: 1.0 }
    );
  
    // Si existe el elemento a observar, entonces observarlo
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
  
    // Limpiar el observer al desmontar el componente
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hayMasUsuarios, bottomRef.current]);*/
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hayMasUsuarios) {
        cargarMasUsuarios(); // Asegúrate de que esta función maneja correctamente el estado de `cargando`
      }
    }, { threshold: 1.0 });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hayMasUsuarios]);

  const cargarMasUsuarios = () => {
    const nuevaPagina = paginaActual + 1;
    cargarUsuarios(
      nameProduct,
      nuevaPagina,
      searchTerm,
      selectedDate.toISOString()
    );
    setPaginaActual(nuevaPagina);
  };

  //mensajes
  useEffect(() => {
    if (vistaChatboxRef.current) {
      if (!resultados.statusScroll) {
        requestAnimationFrame(() => {
          vistaChatboxRef.current.scrollTop =
            vistaChatboxRef.current.scrollHeight;
        });
      }
    }

    const ajustarScrollDespuesDeCargarMensajes = () => {
      if (!usuarioSeleccionado) {
        vistaChatboxRef.current.scrollTop = vistaChatboxRef.current.scrollHeight;
      } else {
        const estabaAlFinal = vistaChatboxRef.current.scrollHeight - vistaChatboxRef.current.clientHeight <= vistaChatboxRef.current.scrollTop + 1;
        if (estabaAlFinal) {
          vistaChatboxRef.current.scrollTop = vistaChatboxRef.current.scrollHeight;
        }
      }
    };
    ajustarScrollDespuesDeCargarMensajes();

  }, [resultados]);

  /*---------------------------
        BARRA DE BUSQUEDA
  ---------------------------*/
  //usuarios
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //mensajes
  const handleSearchChangeChat = (event) => {
    setSearchTermChat(event.target.value);
  };


  /*--------------------
    ESTADO DE REFRESCO
  --------------------*/
  //lista de mensajes en tiempo real
  useEffect(() => {
    const verificarYActualizarMensajes = async () => {
      if (usuarioSeleccionado) {
        obtenerMsm(usuarioSeleccionado, nameProduct);
      }
    };

    const intervaloMensajes = setInterval(verificarYActualizarMensajes, 5000);

    return () => {
      clearInterval(intervaloMensajes);
    };
  }, [usuarioSeleccionado, nameProduct]);

  //actualizar lista de usuarios en tiempo real

  //Ojo este useEffect


  /*useEffect(() => {
    const actualizarUsuarios = async () => {
      cargarUsuarios(nameProduct, 1, searchTerm);
      console.log("Error línea 134");
    };

    const intervalo = setInterval(actualizarUsuarios, 3000);

    return () => {
      clearInterval(intervalo);
    };
  }, [nameProduct, searchTerm]);*/

  /* Esta parte es importante, está comentada sólo por ahora
  useEffect(() => {
    //cargarUsuarios(1, "", new Date());
    const intervalId = setInterval(() => {
      cargarUsuarios(
        nameProduct,
        paginaActual,
        searchTerm,
        selectedDate.toISOString()
      );
    }, 5000); // Actualiza cada 5 segundos.

    return () => clearInterval(intervalId); // Limpieza al desmontar el componente.
  }, [nameProduct, paginaActual, searchTerm, selectedDate]);*/

  /*---------------------------------
      FUNCIONES ADICIONALES 
  ---------------------------------*/
  //normalice el texto y no importa si tiene caracteres especiales
  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  //divisor para mostrar la fecha
  const mostrarFecha = (fecha, index) => {
    return index === 0 ? <div className="fecha-flotante">{fecha}</div> : null;
  };

  //paginado
  useEffect(() => {
    if (paginaActual > 1 && nameProduct) {
      cargarUsuarios(nameProduct, paginaActual, searchTerm, selectedDate);
    }
  }, [nameProduct, paginaActual, searchTerm, selectedDate]);

  //carga de usuarios
  useEffect(() => {
    if (nameProduct) {
      setUsuarios([]);
      setPaginaActual(1);
      setHayMasUsuarios(true);
      cargarUsuarios(nameProduct, 1, searchTerm);
    }
  }, [nameProduct, searchTerm, selectedDate.toISOString()]);

  //colocados por laura
  useEffect(() => {
    // Se llama al iniciar y cuando cambian las dependencias relevantes.
    if (!nameProduct || typeof selectedDate === 'undefined') return;
    cargarUsuarios(nameProduct, 1, searchTerm, selectedDate.toISOString());
  }, [nameProduct, searchTerm, selectedDate]);

  useEffect(() => {
    // Cargar inicialmente y luego cada 5 segundos, si no está bloqueado
    const cargarYActualizarUsuarios = async () => {
      if (!bloquearCarga) {
        await cargarUsuarios(nameProduct, paginaActual, searchTerm, selectedDate.toISOString());
        setBloquearCarga(true); // Bloquear nuevas cargas
        setTimeout(() => setBloquearCarga(false), 5000); // Desbloquear después de 5 segundos
      }
    };
  
    cargarYActualizarUsuarios();
  
    // Este efecto solo se activa cuando cambian estas dependencias
  }, [nameProduct, paginaActual, searchTerm, selectedDate]);

  /*------------------------
      BARRA SUPERIOR
  ------------------------*/
  const barra = () => {
    return (
      <>
        <div className="botones">
          <AppBar position="static" sx={{ backgroundColor: "#128C7E" }}>
            <Toolbar>
              <Link className="button-back" to={"/user/administrador"}>
                <ArrowBackIcon />
              </Link>
              <br />
              <br />
              <IconButton
                edge="end"
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
              >
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      </>
    );
  }

  /*----------------------------------------------
        CAJA PARA VISUALIZAR LOS USUARIOS
  -----------------------------------------------*/
  const muestraUsuarios = () => {
    return (
      <>
        <div className="leftSide">
          <div className="header">
            <ul className="nav_icons">{nameProduct}</ul>
            <div className="total-suscriptores">
              <p>Total: {totalSuscriptores}</p>
            </div>
            <Button onClick={marcarTodosComoLeidos}>
              <MarkChatReadIcon className="marcar-no-leidos" />
            </Button>
          </div>
          <div className="search_chat">
            <div className="buscador">
              <input
                type="text"
                placeholder="Search or start new chat"
                onChange={handleSearchChange}
              />
              <ion-icon name="search-outline">
                <SearchIcon />
              </ion-icon>
            </div>
            <div className="filter">
              <Button className="calendary" onClick={toggleDatePicker}>
                <CalendarMonthIcon className="marcar-no-leidos" />
              </Button>
              {isDatePickerVisible && (
                <div className="datepicker-container">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    inline
                  />
                </div>
              )}
            </div>
          </div>

          <div className="chatlist">
            {usuarios.map((usuario, index) => (
              <div
                className={`block ${usuarioSeleccionado === usuario.user ? "active" : ""
                  }`}
                key={index}
              >
                <div className="imgBox">
                  <img src="../perfil.jpg" className="cover" alt="" />
                </div>
                <Button
                  className="buttonHead"
                  onClick={() => obtenerMsm2(usuario.user, nameProduct)}
                >
                  <div className="details">
                    <div className="listHead">
                      <h4>
                        {nameProduct === "MARCUSS INSTAGRAM" ? "@" : "+"}
                        {usuario.user}
                      </h4>
                      <p className="time">
                        {usuario.hora}
                        <br />
                        {usuario.fecha}
                      </p>
                    </div>
                    <div className="message_p">
                      <p>{usuario.lastMessage}</p>
                    </div>
                  </div>
                  <div
                    key={index}
                    className={`usuario ${usuario.leido ? "" : "no-leido"}`}
                  ></div>
                </Button>
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>
        </div>
      </>
    )
  }

  /*---------------------------------------
      CAJA PARA VISUALIZAR LOS MENSAJES
  ---------------------------------------*/
  const muestraMensajes = () => {
    return (
      <>
        <div className="rightSide">
          {!usuarioSeleccionado && (
            <div className="logo">
              <img src="../logo.png" alt="" className="cover" />
            </div>
          )}
          <div className="header">
            <div className="imgText">
              <div className="userimg">
                <img src="../perfil.jpg" alt="" className="cover" />
              </div>
              <h4>
                {nameProduct === "MARCUSS INSTAGRAM" ? "@" : "+"}
                {usuarioSeleccionado
                  ? usuarioSeleccionado
                  : "Sin Seleccionar"}
                <br />
                <span>{resultados.nombreUsuario}</span>
              </h4>
              <ToggleBotButton
                userId={usuarioSeleccionado}
                productName={nameProduct}
              />
            </div>
            <ul className="nav_icons">
              <li onClick={toggleSearchBar}>
                <SearchIcon></SearchIcon>
              </li>
            </ul>
          </div>

          <div
            className={`vista_chatbox ${showSearchBar ? "" : "with-search"}`}
          ref={vistaChatboxRef}
          >
            {Object.entries(resultados.data).map(([fecha, resultados]) => (
              <React.Fragment key={fecha}>
                {resultados
                  .filter(
                    (resultado) =>
                      normalizeText(resultado.message).includes(
                        normalizeText(searchTermChat)
                      ) ||
                      (resultado.response &&
                        normalizeText(resultado.response).includes(
                          normalizeText(searchTermChat)
                        ))
                  )
                  .map((resultado, index) => (
                    <div
                      className="chatbox"
                      key={index}
                      ref={index === resultados.length - 1 ? bottomRef : null}
                    >
                      {mostrarFecha(fecha, index, resultados)}

                      {resultado.message && (
                        <div className="message friend_msg">
                          <p>
                            {resultado.message}<br />
                            <span>{resultado.hora}</span>
                          </p>
                        </div>
                      )}

                      {resultado.response && (
                        <div className="message my_msg">
                          <p>
                            {resultado.response}<br />
                            <span className="horamsg">{resultado.hora}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </div>

          <div className={`chat_input ${showSearchBar ? "" : "hidden"}`}>
            <ion-icon name="happy-outline"></ion-icon>
            <ion-icon name="happy-outline"></ion-icon>
            <input
              type="text"
              placeholder="Buscar en el chat..."
              onChange={handleSearchChangeChat}
            />
            <ion-icon name="mic"></ion-icon>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="container">
      {barra()}
      <div className="debajo_botones">
        {muestraUsuarios()}
        {muestraMensajes()}
      </div>
    </div>
  );
};
export default UserView;