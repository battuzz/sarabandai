import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles.css'
import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';

import Game from './Game';
import Leaderboard from './Leaderboard'

// const Main = () => {
//     return (
//         // <Routes> {/* The Switch decides which component to show based on the current URL.*/}
//         //     <Route exact path='/sarabandai' element={<Game />}></Route>
//         //     <Route exact path='/leaderboard' element={<Leaderboard />}></Route>
//         // </Routes>

//         // <Game />

//         asdfdsaf
//     );
// }


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Game />
    </StrictMode>,
)

// export default Main;