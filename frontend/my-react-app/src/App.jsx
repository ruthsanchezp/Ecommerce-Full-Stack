import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout'; // Importamos la nueva página de Checkout
import 'bootstrap/dist/css/bootstrap.min.css';
import ThankYouPage from './components/ThankYouPage';

const App = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token; // Verificar si el usuario está logueado
    const userName = isLoggedIn ? 'Welcome' : ''; 

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout isLoggedIn={isLoggedIn} userName={userName} />} /> {/* Pasar props al Checkout */}
                <Route path="/thank-you" element={<ThankYouPage />} /> {/* Ruta para la página de agradecimiento */}
            </Routes>
        </Router>
    );
};

export default App;
