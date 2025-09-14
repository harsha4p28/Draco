import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Nav from './Nav/Nav';
import Post from './Post/Post';

function App() {
  return (
      <Router>
        <Nav />
        <Routes>  
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/addPost' element={<Post />} />
          
          
        </Routes>
      </Router>
    
  );
}

export default App;
