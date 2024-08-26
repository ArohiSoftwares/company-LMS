import axios from "axios";
import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../store/User/userSlice";
const AdminNavbar = () => {
  const dispatch = useDispatch();
  const user = localStorage.getItem("persist:root");
  console.log(user.split(",")[1].includes(true));

  async function logoutBtn() {
    const res = await axios.get("/api/admin/logout");
    if (res.status === 200) {
      localStorage.removeItem("persist:root");
    }
    dispatch(logout());

  }
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <div className="flex  ">
        <FaSearch className="text-gray-600 mr-5  mt-3" />
        <input
          type="text"
          placeholder="Search..."
          className=" shadow-md border-gray-300 rounded p-2 w-96"
        />
      </div>

      <div className="flex items-center gap-10">
        <span className="flex">
          <FaUserCircle className="text-gray-600 mr-2" size={24} />
          <span className="text-gray-600">Admin Name</span>
        </span>
        <span>
          
            <button onClick={logoutBtn}>Sign out</button>
  
        </span>
      </div>
    </nav>
  );
};

export default AdminNavbar;
