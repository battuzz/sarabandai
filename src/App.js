import Navbar from './Navbar'
import Main from './Main'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline';


export default function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md">
        <Main />
      </Container>
    </div>
  );
}