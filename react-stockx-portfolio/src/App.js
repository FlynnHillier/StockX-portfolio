import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import { Container } from 'react-bootstrap';

import Header from './components/Common/Header'

import { BrowserRouter} from "react-router-dom"
import Views from './Views';





function App() {


  return (
      <BrowserRouter>
        <Header title="Lokker"/>
        <Container fluid className="view p-4">
            <Views></Views>            
        </Container>
      </BrowserRouter>
  );
}

export default App;
