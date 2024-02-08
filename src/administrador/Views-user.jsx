import React, { useState, useEffect, useRef } from "react";
import "./views-user.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

//iconos
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Button } from "@mui/material";

//icono calendario calendario
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserView = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [resultados, setResultados] = useState({
    statusScroll: false,
    data: []
  });
  const [llamada, setLlamada] = useState(false);
  const [nameProduct, setNameProduct] = useState("");
  const bottomRef = useRef(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [hayMasUsuarios, setHayMasUsuarios] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermChat, setSearchTermChat] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const vistaChatboxRef = useRef(null);
  //estado de scroll por usuario

  const handleLogout = () => {
    console.log("cierre de sesión");
    localStorage.removeItem("token");
    setUser({});
    navigate("/user");
  };

  // Búsqueda de los usuarios
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //busqueda de los mensajes
  const handleSearchChangeChat = (event) => {
    setSearchTermChat(event.target.value);
  };

  // Función para manejar la selección de fecha
  const handleDateChange = (formattedDate) => {
    setSelectedDate(formattedDate);
    setIsDatePickerVisible(false);
    obtenerUsuarios(nameProduct, 1, searchTerm, formattedDate.toISOString());
  };

  //normalice el texto y no impora si tiene caracteres especiales
  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prevShow) => !prevShow);
  };

  // Función para cambiar la visibilidad del menú de filtro
  const toggleDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  //actualizar lista de mensajes en tiempo real
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
  useEffect(() => {
    const actualizarUsuarios = async () => {
      obtenerUsuarios(nameProduct, 1, searchTerm);
    };
  
    const intervalo = setInterval(actualizarUsuarios, 3000);
  
    return () => {
      clearInterval(intervalo)
    };
  }, [nameProduct, searchTerm, selectedDate]); 

  //obtener los numeros de telefono
  const obtenerUsuarios = async (name_product, page, searchTerm, selectedDate) => {
    //console.log('testing');
    //console.log(name_product+' '+page+' '+searchTerm+' '+selectedDate);
    try {
      const response = await fetch("http://localhost:3000/obtenerNumeros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name_product,
          page,
          searchTerm,
          selectedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const nuevosUsuarios = await response.json();
      nuevosUsuarios.sort((a, b) => new Date(b.ultimoMensajeFecha) - new Date(a.ultimoMensajeFecha));
      if (nuevosUsuarios.length < 10) {
        setHayMasUsuarios(false);
      }
      //console.log("carga..: ", nuevosUsuarios);
      setUsuarios((prev) =>
        page === 1 ? nuevosUsuarios : [...prev, ...nuevosUsuarios]
      );
    } catch (error) {
      console.error(error);
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
        data: data
      });
    } catch (error) {
      console.error(error);
    }
  };

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
        data: data
      });
    } catch (error) {
      console.error(error);
    }
  };

  const mostrarFecha = (fecha, index,) => {
    return index === 0 ? <div className="fecha-flotante">{fecha}</div> : null;
  };

  const marcarTodosComoLeidos = async () => {
    try {
        const response = await fetch('http://localhost:3000/marcarTodosComoLeidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name_product: nameProduct }),
        });

        if (!response.ok) {
            throw new Error('No se pudo marcar los mensajes como leídos');
        }

        const data = await response.json();
        console.log(data.message);

        // Opcional: Actualiza la UI si es necesario, por ejemplo, recargando los usuarios/mensajes
        obtenerUsuarios(nameProduct, paginaActual, searchTerm, selectedDate);
    } catch (error) {
        console.error(error);
    }
};


  //Obtener nombre del producto seleccionado.
  useEffect(() => {
    if (location.state && location.state.name_product && !llamada) {
      const name_product = location.state.name_product;
      if (nameProduct !== name_product) {
        obtenerUsuarios(name_product, 1);
        setNameProduct(name_product);
        setLlamada(true);
      }
    } else {
      console.log("No se pasó name_product en el estado de navegación");
      setLlamada(false);
    }
  }, [location.state, llamada]);

  //carga de usuarios
  useEffect(() => {
    if (nameProduct) {
      setUsuarios([]);
      setPaginaActual(1);
      setHayMasUsuarios(true);
      obtenerUsuarios(nameProduct, 1, searchTerm);
    }
  }, [searchTerm]);

  //scroll de mensajes
  useEffect(() => {
    if (vistaChatboxRef.current) {
      //console.log('valor de scroll: ', resultados.statusScroll);
      if(!resultados.statusScroll) {
        requestAnimationFrame(() => {
          vistaChatboxRef.current.scrollTop = vistaChatboxRef.current.scrollHeight;
        });

      }
    }
  }, [resultados]);

  useEffect(() => {
    // Esta función se llama después de cada actualización de los mensajes.
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
  
  
  //scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hayMasUsuarios) {
          console.log("Cargar más usuarios");
          setPaginaActual(prevPage => prevPage + 1);
        }
      },
      { threshold: 0.5 } 
    );
  
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
  
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hayMasUsuarios, bottomRef.current]);
  
  

  //paginado
  useEffect(() => {
    if (paginaActual > 1 && nameProduct) {
      obtenerUsuarios(nameProduct, paginaActual, searchTerm);
    }
  }, [paginaActual, nameProduct, searchTerm]);

  // Resetear después de cargar usuarios
  useEffect(() => {
    setLlamada(false);
  }, [usuarios]);


  return (
    <>
      <div className="container">
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

        <div className="debajo_botones">
          <div className="leftSide">
            <div className="header">
              <ul className="nav_icons">{nameProduct}</ul>
              <Button onClick={marcarTodosComoLeidos}>
                <ul className="marcar-no-leidos">O</ul>
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
                <Button onClick={toggleDatePicker}>
                  <CalendarMonthIcon />
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
            
            <div className="chatlist" /*ref={bottomRef}*/>
              {usuarios.map((usuario, index) => (
                <div
                  className={`block ${
                    usuarioSeleccionado === usuario.user ? "active" : ""
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
                  <span>name</span>
                </h4>
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
                              {resultado.message} <br />
                              <span>{resultado.hora}</span>
                            </p>
                          </div>
                        )}

                        {resultado.response && (
                          <div className="message my_msg">
                            <p>
                              {resultado.response} <br />
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
        </div>
      </div>
    </>
  );
};

export default UserView;