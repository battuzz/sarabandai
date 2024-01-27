import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SarabandAI
          </Typography>
          <a href="/sarabandai"><Button color="inherit">Nuova partita</Button></a>
          <Link to="/leaderboard"><Button color="inherit">Leaderboard</Button></Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}