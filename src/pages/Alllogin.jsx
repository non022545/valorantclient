import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';

function Alllogin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    
    axios.get('http://localhost:3000/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data.username))  // หรือ res.data.userId ขึ้นกับ API response
      .catch(() => setUser(null));
  }, []);



  return (
    <div>
      {!user && <Login />}
    </div>
  );
}

export default Alllogin;
