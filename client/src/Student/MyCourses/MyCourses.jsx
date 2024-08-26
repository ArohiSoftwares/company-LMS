import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import {useParams} from "react-router-dom"

function MyCourses() {
  const [courses, setCourses] = useState([{
    
    _id: "",
    courseName : "",
    adminEmail:"",
    courseDescription : "",
    courseImage : "",
    courseLanguges : "",
    courseAuthor : "",
    viewCoursesLink : "/viewLecture",
    viewcourses:"View Courses",
    uploadCoursesLink : "/uploadvideo",
    uploadcourses:"Upload Lecture ",
    courseCode:"",
    courseThumbnail:"",
   


  }]);

  const { courseCode }=useParams();

  
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`/api/student/getMyCourses`);
      console.log("get all courses response=>", response);
      console.log("response.data =>", response.data);
      console.log("response.data.data =>", response.data.data);

      if(response.data.data.length === 0){
        return (
          <div> 
            <p> you have not purchased any course yet</p>
          </div>
        )
      }

      setCourses(response.data.data); // assuming your data is in response.data.data
    } 
    catch (error) {
      console.log(error);
      window.location.href="/login";
    }
  };

  useEffect(() => {
    fetchCourses();

  },[]); // Adding an empty dependency array to prevent infinite loops

  return (
    <>
      <Navbar />
      <div className="max-w-[1200px] mx-auto ">
        <h1 className="text-white text-center text-3xl font-semibold my-12">
          My Courses
        </h1>
        <div className="flex flex-wrap gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-black text-white rounded-lg shadow-lg w-[40%] overflow-hidden"
            >
              <img
                src={course.courseThumbnail.private_url}
                alt={course.courseName}
                className="w-full h-[250px]"
                height="200px"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold mt-4 mb-2">
                  {course.courseName}
                </h2>
                <p className="text-gray-400 mb-5">{course.courseDescription}</p>
                <hr />
               {/* <div className="text-cyan-400 mt-7 font-semibold text-xl ">
                    
                  {course.courseTeacher.map((teacher, index) => (
                    <div key={index}>{teacher}</div>
                  ))}
                </div>*/}
                <div className="mt-7 flex justify-between mb-2 text-gray-300 text-xl font-bold">
                  <div>By {course.adminEmail}</div>
                  <div>Price: ₹{course.coursePrice}</div>
                </div>
              </div>
              <div className="flex justify-center space-x-4 text-2xl mb-2">
                <Link to={`/student/viewlecture/${course.courseCode}`}>
                  <button className="bg-cyan-400 text-black font-bold p-2 rounded">
                    {course.buy || "View Course"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyCourses;