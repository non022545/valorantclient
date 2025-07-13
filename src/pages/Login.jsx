import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- ต้อง import ตัวนี้ด้วย
import Swal from 'sweetalert2'


function Login() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

  const login = async () => {  // เปลี่ยนชื่อจาก Login เป็น login
    try {
      const res = await axios.post('http://localhost:3000/login', { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ!',
        showConfirmButton: false,
        timer: 1500,
        position: 'center',
      });

      navigate('/admin_Npass_non0625232145');
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
        confirmButtonColor: '#d33',
        confirmButtonText: 'ลองใหม่',
        position: 'center',
      });

    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-[url("/images/pagelogin.jpg")]'>

      <div className="bg-black/80 text-white p-8 rounded-lg shadow-lg w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          onChange={e => setU(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          onChange={e => setP(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          onClick={login}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Login
        </button>
      </div>
    </div>

  );
}



export default Login;

