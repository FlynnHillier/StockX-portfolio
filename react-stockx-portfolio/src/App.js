import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import Header from './components/Common/Header'

import { useState } from 'react';

import { BrowserRouter} from "react-router-dom"

import Views from './Views';
import SignupContent from './pages/signup/SignupContent';




function App() {

  const [email,setEmail] = useState("")

  return (
    <>
      <BrowserRouter>
        <Header title="Lokker"/>
            <Views></Views>
      </BrowserRouter>
    </>
  );
}

export default App;
