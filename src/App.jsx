import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import imageCompression from 'browser-image-compression'

function App() {
  const [datavalolist, setDatavalolist] = useState([])
  const [name, setName] = useState("")
  const [rankvalo, setRankvalo] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("ติดต่อมือ1ได้ เปลี่ยนเมล/รหัสได้ ปลอดภัย 100%")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [editId, setEditId] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [additem, setAdditem] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const btnadditem = () => {
    setAdditem(true)
  }

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

  useEffect(() => {
    console.log('datavalolist:', datavalolist);
  }, [datavalolist]);


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

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('isDarkMode', newMode);
  };

  const saveOrUpdate = async () => {

    if (!name.trim() || !rankvalo.trim() || price === "" || isNaN(Number(price)) || !description.trim()) {
      alert("โปรดกรอกข้อมูลให้ครบถ้วน")
      return
    }
    console.log("Setting loading true")
    setIsLoading(true)
    console.log("Loading state set to true")
    console.log({
      name,
      rankvalo,
      price,
      description,
      imageFile
    })

    try {
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("rankvalo", rankvalo.trim())
      formData.append("price", Number(price))
      formData.append("description", description.trim())

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = editId === null
        ? `https://valorantserver-production.up.railway.app/createid`
        : `https://valorantserver-production.up.railway.app/updateid/${editId}`

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
      setName("")
      setRankvalo("")
      setPrice("")
      setDescription("ติดต่อมือ1ได้ เปลี่ยนเมล/รหัสได้ ปลอดภัย 100%")
      setImageFile(null)
      setImagePreview("")

    } catch (error) {
      console.error("Error saving item:", error)
      alert("Error saving item")
    } finally {
      setIsLoading(false);
    }
  }


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
        await axios.delete(`https://valorantserver-production.up.railway.app/deleteid/${id}`)
        await fetchdatavalo()
        Swal.fire('ลบแล้ว!', 'ข้อมูลถูกลบเรียบร้อย.', 'success')
      } catch (error) {
        console.error("Error deleting item:", error)
        Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้.', 'error')
      }
    }
  }

  const fetchdatavalo = async () => {
    try {
      // const response = await axios.get(`http://localhost:3000/stockvalorant`)
      const response = await axios.get(`https://valorantserver-production.up.railway.app/stockvalorant`)
      setDatavalolist(response.data)
    } catch (error) {
      console.log("Fail fetchdatavalorant")
    }
  }

  useEffect(() => {
    fetchdatavalo()
  }, [])

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 transition-colors duration-500">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="text-white mt-4">กำลังบันทึกข้อมูล...</p>
          </div>
        )}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Toggle Dark Mode */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-blue-300 mb-8">
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

          {/* Form */}
          {additem &&
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
                {editId === null ? "เพิ่มสินค้าใหม่" : "อัพเดทสินค้า"}
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">เลือกรูปภาพ</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Image Preview */}
                {/* Image Preview */}
                {imagePreview && (
                  <img
                    key={imagePreview}  // บังคับรีเฟรชเมื่อเปลี่ยน
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-100 object-cover mb-2 rounded"
                  />
                )}


                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">ชื่อไอดี</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">แรงค์</label>
                  <select
                    value={rankvalo}
                    onChange={(e) => setRankvalo(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-- Select Rank --</option>
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

                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">ราคา</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">รายละเอียด</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Description"
                  />
                </div>
              </form>
              <button
                onClick={() => {
                  console.log("Save or Update clicked")
                  saveOrUpdate()
                }}
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {editId === null ? "บันทึก" : "อัพเดท"}
              </button>
            </div>
          }

          {/* List */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
              สินค้าทั้งหมด
            </h2>
            {datavalolist.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No data available.</p>

            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datavalolist.map((product) => {
                  console.log(product.imageUrl)

                  const imageSrc = product.imageUrl || "";

                  return (
                    <div key={product.id}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-md bg-white dark:bg-gray-700">
                      {imageSrc && (
                        <div className="rounded overflow-hidden mb-4">
                          <img
                            src={product.imageUrl || "https://placehold.co/300x180?text=No+Image"}
                            alt={product.name}
                            className="w-full h-100 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/300x180?text=No+Image";
                            }}
                          />


                        </div>
                      )}

                      <div className="mb-2">
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                          #{product.id} - {product.name}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">แรงค์:</span> {product.rankvalo}
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                          <span className="font-semibold">รายละเอียด:</span> {product.description}
                        </p>
                        <p className="flex gap-2 text-2xl text-gray-600 dark:text-gray-300 mt-5">
                          <span className="font-semibold">ราคา:</span> <p className='text-green-600 font-bold'>{product.price}</p> บาท
                        </p>


                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setEditId(product.id)
                            setName(product.name)
                            setRankvalo(product.rankvalo)
                            setPrice(product.price)
                            setDescription(product.description)
                            setImageFile(null)

                            const imageUrl = product.imageUrl || "";
                            const fullImageUrl = imageUrl.startsWith("http")
                              ? imageUrl
                              : `https://valorantserver-production.up.railway.app${imageUrl}`;

                            setImagePreview(imageUrl ? fullImageUrl : "")

                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            setAdditem(true)
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
                  )
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
