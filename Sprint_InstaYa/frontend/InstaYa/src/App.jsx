// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/Signup'
import UserDetails from './components/UserDetails'
import Reset from './components/Reset'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/userDetails" element={<UserDetails />} />
            <Route path="/reset" element={<Reset />} />
          </Routes>
        </div>
      </div>
    </div>
  </Router>
  );
}

export default App
