import { useState, useEffect } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline';
import Leaderboard from './Leaderboard';


export default function App() {
  const [pageState, setPageState] = useState({
    showMain : true,
    pageUpdated : false
  })

  const setMain = (b) => {
    setPageState( prev => ({
      showMain : b,
      pageUpdated : !prev.pageUpdated
    }))
  }
  return (
    <div className="App">
      <CssBaseline />
      <Navbar setMain={setMain} />
      <Container maxWidth="md">
        { pageState.showMain ? <Main key={Date.now()} /> : <Leaderboard key={Date.now()} /> }
      </Container>
    </div>
  );
}