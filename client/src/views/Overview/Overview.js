import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Overview.css";
import Companies from "../../components/Companies/Companies";
import Faq from "../../components/Faq/Faq";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Overview() {
  const [activeCourse, setActiveCourse] = useState(null);

  const [category, setCategory] = useState({
    id: 1,
    image:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/41/4d3d7c05fb42729c9d90352e072ca3/1060x596_GCC-photos_Karrim.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=320&h=180&fit=crop&q=50&crop=faces",
    courseName: "Data Science & Analytics",
    courseDuration: "2 months",
    btn1: "Backend dev",
    btn2: "Frontend dev",
    coursePrice: "50",
    courseDescription:
      "Learn data science and analytics with our comprehensive courses.",
    courseThumbnail:
      "https://ik.imagekit.io/sheryians/BackEnd%20Donation/nodeJs_0PymuvVgr.jpg",
    projects: "7",
    courseTeacher: "",

    assignment: "70+",
    lectures: "160",
  });

  const courseContent = {
    nodejs: [
      "Introduction to Node.js and NPM",
      "Setting up Node.js environment",
      "Understanding the Event Loop",
      "Working with Modules",
      "Creating HTTP Server",
      "Introduction to Express.js",
    ],
    expressjs: [
      "Setting up Express.js",
      "Routing in Express.js",
      "Middleware functions",
      "Building RESTful APIs",
      "Error handling in Express.js",
    ],
    mongodb: [
      "Introduction to MongoDB",
      "CRUD Operations",
      "Indexing and Aggregation",
      "Working with Mongoose",
      "Connecting MongoDB with Node.js",
    ],
  };

  const tools = [
    {
      name: "Node.js",
      image: "https://nodejs.org/static/images/logo.svg",
    },

    {
      name: "VS Code",
      image: "https://code.visualstudio.com/assets/images/code-stable.png",
    },
    {
      name: "Postman",
      image: "https://www.postman.com/assets/logos/postman-logo-stacked.svg",
    },
    {
      name: "GitHub",
      image:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    },
    {
      name: "Docker",
      image:
        "https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png",
    },
  ];

  const { courseCode } = useParams();

  const type = useSelector((state) => state.user.user);

  console.log("type => ", type);

  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `/api/course/getCourseByCode?courseCode=${courseCode}`
      );

      console.log(" response => ", response);

      console.log("data => ", response.data);
      // alert(response.data.message);

      setCategory(response.data.data);
    } catch (error) {
      console.log(error);
      alert("could not fetch the course");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const checkoutHandler = async (amount, courseCode) => {
    try {
      const {
        data: { key },
      } = await axios.get("/api/getkey");

      const data = {
        amount: amount || 2000,
      };

      const {
        data: { order },
      } = await axios.post("/api/payment/createPaymentForCourse", data);

      console.log(window);

      const options = {
        key,
        amount: amount,
        currency: "INR",
        name: "gaurav ghuge",
        description: "Test Transaction of softwares",

        image: "https://example.com/your_logo",
        order_id: order.id,
        callback_url: `/api/payment/verifyPaymentForCourse/${courseCode}`,

        prefill: {
          name: "Gaurav ghuge",
          email: "gauravghuge@microsoft.com",
          contact: "8767482793",
        },

        notes: {
          address: "Razorpay Corporate Office",
        },

        theme: {
          color: "#83E633",
        },
      };

      let razor = new window.Razorpay(options);

      razor.open();
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  return (
    <div>
      <Navbar />

      <div key={category.id}>
        <div className="text-center my-3">
          <h1 className="text-5xl font-bold text-cyan-500">
            Welcome to Our {category.courseName}
          </h1>

          {/* 
              <p className="text-xl text-gray-300 mt-4">
                Master Backend Development with Node.js, Express.js, and MongoDB
              </p> 
            */}
        </div>

        <div className="bg-gradient-to-b from-gray-800 to-cyan-850 text-white rounded-lg shadow-lg overflow-hidden my-5 p-5 mx-5 sm:mx-10">
          <div className="flex flex-col lg:flex-row justify-around items-center p-5 lg:p-20">
            <div className="flex-1 mb-5 lg:mb-0">
              <p className="text-3xl sm:text-4xl font-bold">
                {category.courseName}
              </p>
              <p className="text-xl sm:text-2xl mt-7 font-semibold">
                <span className="bg-gray-700 rounded p-2 pl-4 pr-4">
                  {category.btn1}
                </span>
                <span className="ml-2 bg-gray-700 rounded p-2 pl-4 pr-4">
                  {category.btn2}
                </span>
              </p>
              <p className="text-4xl sm:text-5xl font-bold mt-14">
                Only:{" "}
                <span className=" text-cyan-400">
                  {" "}
                  💵 ₹ {category.coursePrice}
                </span>
              </p>


              <button
                onClick={
                  
                  type === "student"
                    ? () => checkoutHandler(category.coursePrice, courseCode)
                    : navigate("/login")


                }
                className="mt-8 p-4 bg-cyan-500 rounded hover:bg-cyan-850 font-bold text-2xl mb-5"
              >
                Buy Now - Start Learning
              </button>


              <p className="text-base sm:text-2xl font-semibold mt-2">
                {category.courseDescription}
              </p>
            </div>

            <div className="flex-1">
              <img
                src={category.courseThumbnail.private_url}
                alt={category.courseName}
                className="h-48 sm:h-72 lg:ml-20 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10 items-center">
          <img
            src={category.courseThumbnail.private_url}
            alt={category.courseName}
            className="h-48 sm:h-72 lg:ml-20 rounded-lg mb-10"
          />
        </div>

        <div className="flex justify-center flex-wrap my-20">
          <div className="relative text-center font-bold text-3xl mr-10 ml-10 p-10 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl border-2 border-transparent animate-pulse"></div>
            <div className="relative text-cyan-400 bg-gray-800 rounded-3xl p-10 font-sans">
              <p className="text-4xl">{category.projects}</p>
              Projects
            </div>
          </div>
          <div className="relative text-center font-bold text-3xl mr-10 ml-10 p-10 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl border-2 border-transparent animate-pulse"></div>
            <div className="relative text-cyan-400 bg-gray-800 rounded-3xl p-10 font-sans">
              <p className="text-4xl">{category.assignment}</p>
              Assignments
            </div>
          </div>
          <div className="relative text-center font-bold text-3xl mr-10 ml-10 p-10 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl border-2 border-transparent animate-pulse"></div>
            <div className="relative text-cyan-400 bg-gray-800 rounded-3xl p-10 font-sans">
              <p className="text-4xl">{category.lectures}</p>
              Lectures
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-20 mb-10">
          <h2 className="text-4xl text-cyan-500 mt-20 font-bold">
            What You ll Learn
          </h2>
          <h2 className="text-4xl text-white mt-2 font-bold">
            From Start to Victory
          </h2>
          <button
            className="bg-gray-800 text-white text-2xl mt-12 p-3 cource-button rounded-lg m-2 hover:bg-cyan-700"
            onClick={() =>
              setActiveCourse(activeCourse === "nodejs" ? null : "nodejs")
            }
          >
            {activeCourse === "nodejs" ? "Hide" : "Show"} Node.js Content
          </button>
          {activeCourse === "nodejs" && (
            <div className="p-4 bg-gray-800 text-cyan-400 rounded-lg mt-8 w-11/12 text-xl font-bold">
              <h2 className="text-3xl mb-4">Node.js Course Content</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                {courseContent.nodejs.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="bg-gray-800 text-white text-2xl p-3 mt-7 rounded-lg cource-button  hover:bg-cyan-700"
            onClick={() =>
              setActiveCourse(activeCourse === "expressjs" ? null : "expressjs")
            }
          >
            {activeCourse === "expressjs" ? "Hide" : "Show"} Express.js Content
          </button>
          {activeCourse === "expressjs" && (
            <div className="p-4 bg-gray-800 text-cyan-400 rounded-lg mt-2 w-11/12 text-xl font-bold">
              <h2 className="text-3xl mb-4">Express.js Course Content</h2>
              <ul className="list-disc text-white list-inside space-y-2">
                {courseContent.expressjs.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="bg-gray-800 text-white p-3 text-2xl mt-7  cource-button rounded-lg m-2 hover:bg-cyan-700"
            onClick={() =>
              setActiveCourse(activeCourse === "mongodb" ? null : "mongodb")
            }
          >
            {activeCourse === "mongodb" ? "Hide" : "Show"} MongoDB Content
          </button>
          {activeCourse === "mongodb" && (
            <div className="p-4 bg-gray-800  text-cyan-400 rounded-lg mt-2 w-11/12 text-2xl font-bold">
              <h2 className="text-3xl mb-4">MongoDB Course Content</h2>
              <ul className="list-disc text-white list-inside space-y-2">
                {courseContent.mongodb.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center mt-20 mb-10">
          <h2 className="text-4xl text-cyan-500 mt-20 font-bold">
            Master These Tools
          </h2>
          <div className="flex overflow-x-auto mt-10">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white rounded-lg shadow-lg m-4 p-5 text-center"
                style={{ minWidth: "200px" }}
              >
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="h-20 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold">{tool.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Companies />

      {/* <Faq/> */}
      <Footer />
    </div>
  );
}

export default Overview;
