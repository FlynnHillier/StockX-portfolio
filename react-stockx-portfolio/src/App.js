import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import Header from './components/Common/Header'


import { BrowserRouter} from "react-router-dom"

import Views from './Views';



function App() {
  return (
    <>
      <BrowserRouter>
        <Header title="Lokker"/>
        <Views/>
      </BrowserRouter>
    </>
  );
}

export default App;
