  import { useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom'; // <-- ต้อง import ตัวนี้ด้วย


  function Login() {
    const [username, setU] = useState('');
    const [password, setP] = useState('');
    const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

    const login = async () => {  // เปลี่ยนชื่อจาก Login เป็น login
      try {
        const res = await axios.post('http://localhost:3000/login', { username, password });
        const token = res.data.token; 
        localStorage.setItem('token', token);
        alert('Logged in!');
         navigate('/admin_Npass_non0625232145');
      } catch {
        alert('ชื่อผู้ใช้/รหัส ไม่ถูกต้อง');
      }
    };

    return (
      <div>
        <h2>Login</h2>
        <input onChange={e => setU(e.target.value)} placeholder="Username" />
        <input onChange={e => setP(e.target.value)} type="password" placeholder="Password" />
        <button onClick={login}>Login</button>  {/* ต้องตรงกับชื่อฟังก์ชัน */}
      </div>
    );
  }



  export default Login;

