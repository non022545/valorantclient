import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';
import Nav from '../components/Nav';

function Alllogin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    
    axios.get('https://valorantserver.onrender.com/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data.username))  // หรือ res.data.userId ขึ้นกับ API response
      .catch(() => setUser(null));
  }, []);



  return (
    <>
    <Nav/>
    <div>
      {!user && <Login />}
    </div>
    </>
  );
}

export default Alllogin;
