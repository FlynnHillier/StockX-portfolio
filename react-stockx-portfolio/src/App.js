import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import Header from './components/Common/Header'


import Login_content from './pages/login/Login_content';

import { BrowserRouter,Routes,Route,Link} from "react-router-dom"



function App() {
  return (
    <>
      <BrowserRouter>
        <Header title="Lokker"/>
        <Routes>
          <Route path="/login" element={<Login_content/>} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
