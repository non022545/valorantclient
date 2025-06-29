import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import imageCompression from 'browser-image-compression'



{/**************************************************   UseState   *************************************************/ }

function App() {
  const [datavalolist, setDatavalolist] = useState([])
  const [user_name, setUser_name] = useState("")
  const [name, setName] = useState("")
  const [rankvalo, setRankvalo] = useState("")
  const [cost_price, setCost_price] = useState("")
  const [selling_price, setSelling_price] = useState("")
  const [profit_price, setProfit_price] = useState("")
  const [link_user, setLink_user] = useState("")
  const [status, setStatus] = useState("ยังมีสินค้า")
  const [description, setDescription] = useState("ติดต่อมือ1ได้ เปลี่ยนเมล/รหัสได้ ปลอดภัย 100%")
  const [purchase_date, setPurchase_date] = useState("")
  const [sell_date, setSell_date] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [editId, setEditId] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [additem, setAdditem] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");



  {/**************************************************   UseEffect   *************************************************/ }



  {/**********************************   Fatchdata   ************************************/ }
  useEffect(() => {
    fetchdatavalo()
  }, [])

  {/**********************************   DarkMode   *************************************/ }
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  {/**************************************************   Check Log datavalolist   *************************************************/ }
  useEffect(() => {
    // console.log('datavalolist:', datavalolist);
  }, [datavalolist]);

  {/**************************************************   Auto calc Profit_price    *************************************************/ }
  useEffect(() => {
    const profit = (parseFloat(selling_price) || 0) - (parseFloat(cost_price) || 0);
    setProfit_price(profit);
  }, [cost_price, selling_price]);


  useEffect(() => {
    async function loadData() {
      // const response = await axios.get("/api/get_stockvalorant/1");
      const response = await axios.get("https://valorantserver.onrender.com/stockvalorant/1");
      const dbDate = response.data.purchase_date;

      if (dbDate) {
        const formatted = toInputDateTimeLocal(dbDate);
        setPurchase_date(formatted);
      } else {
        setPurchase_date("");
      }
    }

    loadData();
  }, []);




  {/**************************************************   Event Handler   *************************************************/ }


  {/*******************************************   Change File size   ********************************************/ }
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1024 }
        const compressedFile = await imageCompression(file, options)
        setImageFile(compressedFile)
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.log("Compression error:", error)
      }
    } else {
      setImageFile(null)
      setImagePreview("")
    }
  }

  {/******************************************   toggleDarkMode   ***********************************************/ }
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('isDarkMode', newMode);
  };

  {/*******************************************   Save & Update   ***********************************************/ }

  const purchaseDateForMysql = toMysqlDateTime(purchase_date);
  const sellDateForMysql = toMysqlDateTime(sell_date);


  function toMysqlDateTime(localDateTime) {
    if (!localDateTime) return null;
    return localDateTime.replace('T', ' ') + ':00';
  }


  const saveOrUpdate = async () => {
    if (!user_name.trim() || !name.trim() || !rankvalo.trim() || cost_price === "" || isNaN(Number(cost_price)) || selling_price === "" || isNaN(Number(selling_price)) || profit_price === "" || isNaN(Number(profit_price)) || !link_user.trim() || !status.trim() || !description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'โปรดกรอกข้อมูลให้ครบถ้วน',
      })

      return
    }

    setIsLoading(true)

    console.log({
      user_name,
      name,
      rankvalo,
      cost_price,
      selling_price,
      profit_price,
      link_user,
      status,
      description,
      imageFile,
      purchase_date: purchaseDateForMysql, 
      sell_date: sellDateForMysql          
    });


    try {
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("user_name", user_name.trim())
      formData.append("rankvalo", rankvalo.trim())
      formData.append("cost_price", Number(cost_price))
      formData.append("selling_price", Number(selling_price))
      formData.append("profit_price", Number(profit_price))
      formData.append("link_user", link_user.trim())
      formData.append("status", status.trim())
      formData.append("description", description.trim())
      formData.append("purchase_date", purchaseDateForMysql);
      formData.append("sell_date", sellDateForMysql);



      if (imageFile) {
        formData.append('image', imageFile);
      }
      console.log("📤 กำลังส่งข้อมูลไป backend...");
      // const url = editId === null
      //   ? `http://localhost:3000/createid`
      //   : `http://localhost:3000/updateid/${editId}`
      const url = editId === null
        ? `https://valorantserver.onrender.com/createid`
        : `https://valorantserver.onrender.com/updateid/${editId}`

      const method = editId === null ? 'post' : 'put'

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log("Response from server:", response.data)

      Swal.fire({
        icon: 'success',
        title: editId === null ? 'เพิ่มข้อมูลสำเร็จ!' : 'อัปเดตข้อมูลสำเร็จ!',
        text: editId === null ? 'ข้อมูลถูกเพิ่มแล้วในระบบ' : 'ข้อมูลถูกแก้ไขเรียบร้อยแล้ว',
      })

      if (editId !== null) setEditId(null)

      await fetchdatavalo()
      setUser_name("")
      setName("")
      setRankvalo("")
      setCost_price("")
      setSelling_price("")
      setProfit_price("")
      setLink_user("")
      setStatus("ยังมีสินค้า")
      setDescription("ติดต่อมือ1ได้ เปลี่ยนเมล/รหัสได้ ปลอดภัย 100%")
      setImageFile(null)
      setImagePreview("")
      setPurchase_date("")
      setSell_date("")


    } catch (error) {
      console.error("Error saving item:", error)
      alert("Error saving item")
    } finally {
      setIsLoading(false);
    }
  }

  {/**************************************************   Delete   *************************************************/ }
  const deletevalo = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "ข้อมูลนี้จะถูกลบถาวร!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    })

    if (confirmResult.isConfirmed) {
      try {
        // await axios.delete(`http://localhost:3000/deleteid/${id}`)
        await axios.delete(`https://valorantserver.onrender.com/deleteid/${id}`)
        await fetchdatavalo()
        Swal.fire('ลบแล้ว!', 'ข้อมูลถูกลบเรียบร้อย.', 'success')
      } catch (error) {
        console.error("Error deleting item:", error)
        Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้.', 'error')
      }
    }
  }

  {/**********************************************   fetchdatavalo   **********************************************/ }
  const fetchdatavalo = async () => {
    try {
      // const response = await axios.get(`http://localhost:3000/stockvalorant`)
      const response = await axios.get(`https://valorantserver.onrender.com/stockvalorant`)
      setDatavalolist(response.data)
    } catch (error) {
      console.log("Fail fetchdatavalorant")
    }
  }

  {/**************************************************   SelectStatus   *************************************************/ }

  // ✅ สร้าง status list จากข้อมูลจริง
  const statusList = Array.from(
    new Set(datavalolist.map(item => item.status.trim()))
  );

  // 1️⃣ สร้าง map สี
  const statusColors = {
    "ยังมีสินค้า": "green",
    "ออกแล้ว": "red",
    "ผ่อน": "yellow",
    // ถ้ามี status อื่นเพิ่มได้เลย
  };

  // ✅ ฟิลเตอร์ข้อมูลตามสถานะที่เลือก
  const filteredData = datavalolist.filter(product =>
    selectedStatus === "all" ? true : product.status.trim() === selectedStatus
  );

  // ✅ ฟังก์ชันแปลง ISO / Z → local + format สำหรับ <input type="datetime-local">
  function toInputDateTimeLocal(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function toInputDateTimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }



  {/**************************************************   Document Object Model   *************************************************/ }


  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-300 dark:bg-gray-900 py-8 px-4 transition-colors duration-500">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="text-white mt-4">กำลังบันทึกข้อมูล...</p>
          </div>
        )}
        <div className="max-w-5xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Toggle Dark Mode */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-300 mb-8">
            ระบบจัดการสินค้าคงคลัง Id Valorant
          </h1>

          <div className='flex justify-end'>
            <button
              onClick={() => setAdditem(!additem)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              {additem ? "❌ ซ่อนฟอร์ม" : "➕ เพิ่มสินค้า"}
            </button>
          </div>

          {/**************************************************   Form   *************************************************/}
          {additem &&
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
                {editId === null ? "เพิ่มสินค้าใหม่" : "อัพเดทสินค้า"}
              </h2>
              <form className="space-y-4">
                {/**************************************************   File   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    เลือกรูปภาพ
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                               shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               cursor-pointer
                               file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                             file:bg-blue-600 file:text-white
                             file:hover:bg-blue-700
                               file:cursor-pointer
                               file:transition-colors"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <img
                    key={imagePreview}
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-100 object-cover mb-2 rounded"
                  />
                )}

                {/**************************************************   User Name   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">Username</label>
                  <input
                    type="text"
                    value={user_name}
                    onChange={(e) => setUser_name(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Username"
                  />
                </div>

                {/**************************************************   Name   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">ชื่อไอดี</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="ชื่อ ID"
                  />
                </div>

                {/**************************************************   Rank   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">แรงค์</label>
                  <select
                    value={rankvalo}
                    onChange={(e) => setRankvalo(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-- กรุณาเลือกแรงค์ --</option>
                    <option value="Iron">Iron</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Ascendant">Ascendant</option>
                    <option value="Immortal">Immortal</option>
                    <option value="Radiant">Radiant</option>
                  </select>
                </div>

                {/**************************************************   Cost_price   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">ต้นทุน</label>
                  <input
                    type="number"
                    value={cost_price}
                    onChange={(e) => setCost_price(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="ราคาต้นทุน"
                  />
                </div>

                {/**************************************************   Selling_Price   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">ราคาขาย</label>
                  <input
                    type="number"
                    value={selling_price}
                    onChange={(e) => setSelling_price(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="ราคาขาย"
                  />
                </div>

                {/**************************************************   Profit_price   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">กำไร</label>
                  <input
                    type="number"
                    value={profit_price}
                    readOnly
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                    placeholder="กำไร"
                  />
                </div>

                {/**************************************************   Link_user   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">ลิ้ง Facebook มือ 1/2</label>
                  <input
                    type="text"
                    value={link_user}
                    onChange={(e) => setLink_user(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="ลิ้ง Facebook"
                  />
                </div>

                {/**************************************************   Purchase Date   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">วันที่ซื้อ</label>
                  <input
                    type="datetime-local"
                    value={purchase_date}
                    onChange={(e) => setPurchase_date(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/**************************************************   Sell Date   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">วันที่ขาย</label>
                  <input
                    type="datetime-local"
                    value={sell_date}
                    onChange={(e) => setSell_date(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/**************************************************   Status   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">สถานะ</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="ยังมีสินค้า">ยังมีสินค้า</option>
                    <option value="ออกแล้ว">ออกแล้ว</option>
                    <option value="ผ่อน">ผ่อน</option>
                  </select>
                </div>
                {/**************************************************   description   *************************************************/}
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">รายละเอียด</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="รายละเอียด"
                  />
                </div>
              </form>
              {/**************************************************   Btn Save & Update   *************************************************/}
              <button
                onClick={() => {
                  // console.log("Save or Update clicked")
                  saveOrUpdate()
                }}
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {editId === null ? "บันทึก" : "อัพเดท"}
              </button>
            </div>
          }

          {/**************************************************   Table List   *************************************************/}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
              สินค้าทั้งหมด
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {/* ปุ่ม 'ทั้งหมด' */}
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-3 py-1 rounded ${selectedStatus === "all" ? "bg-blue-600" : "bg-blue-500"
                  } text-white hover:bg-blue-700`}
              >
                ทั้งหมด
              </button>

              {/* ✅ ปุ่มกรอง Status */}
              {[...statusList]
                .sort((a, b) => {
                  const order = ["ยังมีสินค้า", "ผ่อน", "ออกแล้ว"];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map(status => {
                  const color = statusColors[status] || "purple";
                  const isSelected = selectedStatus === status;

                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1 rounded 
                    ${isSelected ? `bg-${color}-500` : `bg-${color}-500`} 
                    text-white hover:bg-opacity-80`}
                    >
                      {status}
                    </button>
                  );
                })}

            </div>

            {/* ✅ ถ้าไม่มีข้อมูล */}
            {filteredData.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">ไม่มีข้อมูล</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map(product => {
                  const imageSrc = product.imageurl || "";

                  return (
                    <div
                      key={product.id}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-md bg-white dark:bg-gray-700"
                    >
                      {/* ✅ Image */}
                      {imageSrc && (
                        <div className="rounded overflow-hidden mb-4">
                          <img
                            src={product.imageurl || "https://placehold.co/300x180?text=No+Image"}
                            alt={product.name}
                            className="w-full h-100 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/300x180?text=No+Image";
                            }}
                          />
                        </div>
                      )}

                      {/* ✅ ข้อมูลสินค้า */}
                      <div className="mb-2">
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                          ID {product.id}
                        </h3>
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-lg text-yellow-600">
                          <span className="font-semibold">Username:</span>{" "}
                          <span className="text-green-500 dark:text-green-400 font-bold">
                            {product.user_name}
                          </span>
                        </p>
                        <p className="text-lg text-yellow-600">
                          <span className="font-semibold">แรงค์:</span>{" "}
                          <span className="text-pink-500 dark:text-pink-400 font-bold">
                            {product.rankvalo}
                          </span>
                        </p>
                        <p className="text-lg text-yellow-600 mt-1">
                          <span className="font-semibold">ต้นทุน:</span>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {product.cost_price}
                          </span>
                        </p>
                        <p className="text-lg text-yellow-600 mt-1">
                          <span className="font-semibold">ราคาขาย:</span>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {product.selling_price}
                          </span>
                        </p>
                        <p className="text-lg text-yellow-600 mt-1">
                          <span className="font-semibold">กำไร:</span>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {product.profit_price}
                          </span>
                        </p>
                        <p className="text-lg text-yellow-600 mt-1">
                          <span className="font-semibold">สถานะ:</span>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {product.status}
                          </span>
                        </p>
                        {/* <p className="text-lg text-yellow-600 mt-1">
                          <span className="font-semibold">รายละเอียด:</span>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {product.description}
                          </span>
                        </p> */}
                        <p className="text-lg text-yellow-600 mt-1">
                          <span className="font-semibold">วันที่ซื้อ:</span>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {new Date(product.purchase_date).toLocaleString('th-TH', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour24: false
                            }).replace(':', '.')}
                          </span>
                        </p>
                        <p className="text-lg text-yellow-600 mt-1">
                          <span className="font-semibold">วันที่ขาย:</span>{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            {new Date(product.sell_date).toLocaleString('th-TH', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour24: false
                            }).replace(':', '.')}
                          </span>
                        </p>
                        <p className="flex gap-2 text-2xl text-gray-700 dark:text-gray-300 mt-5">
                          <span className="font-semibold">ราคา:</span>{" "}
                          <span className="text-green-500 dark:text-green-400 font-bold">
                            {product.selling_price}
                          </span>{" "}
                          บาท
                        </p>
                      </div>

                      {/* ✅ ปุ่ม Edit/Delete */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setEditId(product.id);
                            setUser_name(product.user_name);
                            setName(product.name);
                            setRankvalo(product.rankvalo);
                            setCost_price(product.cost_price);
                            setSelling_price(product.selling_price);
                            setProfit_price(product.profit_price);
                            setLink_user(product.link_user);
                            setStatus(product.status);
                            setDescription(product.description);
                            setPurchase_date(toInputDateTimeLocal(product.purchase_date));
                            setSell_date(toInputDateTimeLocal(product.sell_date));
                            setImageFile(null);

                            const imageurl = product.imageurl || "";
                            const fullimageurl = imageurl.startsWith("http")
                              ? imageurl
                              : `https://valorantserver-production.up.railway.app${imageurl}`;

                            setImagePreview(imageurl ? fullimageurl : "");

                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setAdditem(true);
                          }}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deletevalo(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


        </div>
      </div>
    </div >
  )
}

export default App
