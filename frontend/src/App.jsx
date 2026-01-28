import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProtectedRoute from './routes/ProtectedRoute';
const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  )
}

export default App