import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './components/Home'
import Signup from './components/SignUp'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
return (
<BrowserRouter>
<Routes>
<Route path='/home' element={<Home />}></Route>
<Route path='/signup' element={<Signup />}></Route>
<Route path='/login' element={<Login />}></Route>
</Routes>
</BrowserRouter>
)
}
export default App