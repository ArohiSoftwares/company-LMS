import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import TeacherDetails from "./TeacherDetails/TeacherDetails";


const inputClass =
  "w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const buttonClass = "px-3 py-1 border rounded-md";
const iconButtonClass = "text-blue-500 hover:text-blue-700";

const TeacherList = () => {
  const dialogRef = useRef();
  const teacherDetailsRef = useRef();
  const [teacherDetail, setTeacherDetail] = useState(null);
  const [teachers, setTeachers] = useState(null);
  useEffect(() => {
    const res = axios
      .get("/api/admin/getTeachers")
      .then((res) => setTeachers(res.data.data));
  }, []);
  return (
    <div className="min-h-screen w-full bg-zinc-100 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Teacher List</h1>
          <button
            onClick={() => {
              dialogRef.current.showModal();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            + Add new
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search here..."
            className={inputClass}
          />
          <span className="absolute right-3 top-3 text-zinc-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l4.243 4.243-1.414 1.414-4.243-4.243zM8 14a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-blue-500 to-green-400 text-white">
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Email</th>
                {/* <th className="py-2 px-4 border-b">Address</th> */}
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers?.map((teacher, index) => (
                <tr
                  onClick={() => {
                    setTeacherDetail(teacher);
                    teacherDetailsRef.current.showModal();
                  }}
                  key={index}
                  className="hover:bg-zinc-50 transition duration-200"
                >
                  <td className="py-2 px-4 border-b flex items-center space-x-3">
                    <img
                      src={teacher.image}
                      alt="Teacher"
                      className="rounded-full w-10 h-10"
                    />
                    <div>
                      <p className="font-medium">{teacher?.teacherFullName}</p>
                      {/* <p className="text-zinc-500 text-sm">Teacher</p> */}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {teacher.teacherPhoneNumber}
                  </td>
                  <td className="py-2 px-4 border-b">{teacher.teacherEmail}</td>
                  {/* <td className="py-2 px-4 border-b">{teacher.address}</td> */}
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button className={iconButtonClass}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 12a3 3 0 100-6 3 3 0 000 6zM2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v10h12V5H4z" />
                      </svg>
                    </button>
                    <button className={iconButtonClass}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="green"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM5 12V7H3v10a1 1 0 001 1h10v-2H6a1 1 0 01-1-1z" />
                      </svg>
                    </button>
                    <button className={iconButtonClass}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="red"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 3V3h4v2H8zm1 6a1 1 0 112 0v4a1 1 0 11-2 0v-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-8">
          <p className="text-zinc-600 text-xs">Showing 3 entries</p>
          <div className="flex space-x-1">
            <button
              className={
                buttonClass +
                " text-zinc-600 hover:bg-zinc-200 transition duration-300"
              }
            >
              1
            </button>
            <button className={buttonClass + " bg-blue-500 text-white"}>
              2
            </button>
            <button
              className={
                buttonClass +
                " text-zinc-600 hover:bg-zinc-200 transition duration-300"
              }
            >
              3
            </button>
          </div>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="w-[900px] absolute top-10 mx-auto z-100 rounded-lg p-4 border border-black"
      >
        <button
          className="absolute right-6"
          onClick={() => dialogRef.current.close()}
        >
          close
        </button>


        <input type="text" placeholder="studentEmail" />
        <input type="text" placeholder="studentPassword" />






        {/* <TeacherRegistrationForm /> */}
      </dialog>

      <dialog
        ref={teacherDetailsRef}
        className="w-[900px] absolute top-10 mx-auto z-100 rounded-lg p-4 border border-black"
      >
        <button
          className="absolute right-6"
          onClick={() => teacherDetailsRef.current.close()}
        >
          close
        </button>
        <TeacherDetails teacher={teacherDetail} />
      </dialog>
    </div>
  );
};

// const TeacherRegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     teacherFullName: '',
//     teacherUserName: '',
//     adminEmail: '',
//     teacherAge: '',
//     teacherGender: '',
//     teacherType: 'teacher',
//     teacherCourseCode: '',
//     teacherEmail: '',
//     teacherPassword: '',
//     teacherPhoneNumber: '',
//     teacherSubjects: [],
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubjectsChange = (e) => {
//     const subjects = e.target.value.split(',').map(subject => subject.trim());
//     setFormData(prevData => ({
//       ...prevData,
//       teacherSubjects: subjects
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Here you would typically send the data to your backend
//   };

//   return (
//     <div className="max-w-2xl  mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-2">Teacher Registration</h2>
//       <p className="text-gray-600 text-center mb-6">Please fill out the form below to register a teacher.</p>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div>
//             <label htmlFor="teacherFullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <input
//               type="text"
//               id="teacherFullName"
//               name="teacherFullName"
//               value={formData.teacherFullName}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="teacherUserName" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//             <input
//               type="text"
//               id="teacherUserName"
//               name="teacherUserName"
//               value={formData.teacherUserName}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
//           <input
//             type="email"
//             id="adminEmail"
//             name="adminEmail"
//             value={formData.adminEmail}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div>
//             <label htmlFor="teacherAge" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
//             <input
//               type="number"
//               id="teacherAge"
//               name="teacherAge"
//               value={formData.teacherAge}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="teacherGender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//             <select
//               id="teacherGender"
//               name="teacherGender"
//               value={formData.teacherGender}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label htmlFor="teacherCourseCode" className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
//           <input
//             type="text"
//             id="teacherCourseCode"
//             name="teacherCourseCode"
//             value={formData.teacherCourseCode}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label htmlFor="teacherEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             id="teacherEmail"
//             name="teacherEmail"
//             value={formData.teacherEmail}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="teacherPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//           <input
//             type="password"
//             id="teacherPassword"
//             name="teacherPassword"
//             value={formData.teacherPassword}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="teacherPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//           <input
//             type="tel"
//             id="teacherPhoneNumber"
//             name="teacherPhoneNumber"
//             value={formData.teacherPhoneNumber}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label htmlFor="teacherSubjects" className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma-separated)</label>
//           <input
//             type="text"
//             id="teacherSubjects"
//             name="teacherSubjects"
//             value={formData.teacherSubjects.join(', ')}
//             onChange={handleSubjectsChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

export default TeacherList;
