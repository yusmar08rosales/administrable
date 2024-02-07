import React from 'react'
import ReactDOM from 'react-dom/client'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import Modal from './registro/Modal';
import Views from './administrador/views';
import UserView from './administrador/Views-user';

import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './route/ProtectedRouter';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/user' element={<App />} />
					<Route path='/user/registro' element={<Modal />} />
					{/* Rutas para roles */}
					{/* ... otras rutas ... */}
					<Route path='/user/administrador' element={
						<ProtectedRoute roles={['admin']}>
							<Views />
						</ProtectedRoute>
					} />
					<Route path='/user/usuario' element={
						<ProtectedRoute roles={['user', 'admin']}>
							<UserView />
						</ProtectedRoute>
					} />

				</Routes>
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>,
)
