import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import { Container } from 'react-bootstrap';

import Header from './components/Common/Header'

import { BrowserRouter} from "react-router-dom"
import Views from './Views';





function App() {


  return (
    <Container
      fluid
      className="app user-select-none" 
    >
      <BrowserRouter>
        <Header title="Lokker"/>
        <Container fluid className="view p-4">
            <Views></Views>            
        </Container>
      </BrowserRouter>
    </Container>
  );
}

export default App;
