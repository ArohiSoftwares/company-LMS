import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Comment from "../../Tabs/Comment";
import Attachment from "../../Tabs/Attachment";
import Doubts from "../../Tabs/Doubts";
import Refrence from "../../Tabs/Refrence";
import axios from "axios";
import { useParams } from "react-router-dom";

function ViewLecture() {
  const { courseCode } = useParams();

  const [activeVideo, setActiveVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const playVideo = (data, video) => {
    setActiveVideo(video);
    setPlaying(true);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSeek = (seconds) => {
    setPlaying(false);
    setTimeout(() => setPlaying(true), 100);
    activeVideo.ref.seekTo(seconds, "seconds");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [lectureList, setLectureList] = useState([
    {
      lectureName: "Lecture Name",
      lectureDescription: "Lecture Description",
      teacherName: "Teacher Name",
      lectureImage: "https://www.w3schools.com/w3images/avatar.png",
    },
  ]);

  const [lectureDetails, setLectureDetails] = useState([
    {
      lectureName: "",
      lectureDescription: "",
      lectureVideo: "",
      lectureImage: "",
    },
  ]);

  const fetchLectureList = async () => {

    try {
      // form-urlencoded
      const code = new URLSearchParams();
      code.append("courseCode", courseCode);
      const response = await axios.post(
        `/api/student/getLecturesByCourse/`,
        code
      );
      response.data.data?.map((data) => {
        setLectureDetails([
          ...lectureDetails,
          {
            lectureName: data.video[0].lectureName,
            lectureDescription: data.video[0].lectureDescription,
            lectureVideo: data.video[0].private_url,
          },
        ]);
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };



  const fetchLectureDetails = async (lectureCode) => {
    try {
      const response = await axios.get(
        `/api/student/getLectureDetails/${lectureCode}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLectureList();
  }, []);


  return (
    <div className="flex  flex-col md:flex-row md:h-[60rem] w-full">

      <nav
        className="text-center items-center w-full h-16 bg-gray-600 px-4 py-2 text-white"
      > 
        <p className="text-center m-auto"> View Your Course Lectures Here </p>

      </nav>


      {activeVideo && (
        <div className="w-full md:w-3/4 flex flex-col items-center bg-gray-900 p-5">

          <div className="w-full md:h-96">
            <ReactPlayer
              ref={(player) => {
                activeVideo.ref = player;
              }}
              lectureImage={activeVideo.lectureImage}
              playing={playing}
              controls
              width="100%"
              height="5rem"
              className="rounded"
            />
          </div>

          

          <div className="mt-5 flex space-x-4">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => handleSeek(activeVideo.ref.getCurrentTime() - 5)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              -5s
            </button>
            <button
              onClick={() => handleSeek(activeVideo.ref.getCurrentTime() + 5)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              +5s
            </button>
          </div>

          <ul className="text-white flex flex-col md:flex-row gap-2 md:gap-5 py-5 md:py-10">
            <li className="flex-1 text-center">
              <button
                className="p-2 w-full cursor-pointer tracking-wider hover:text-slate-300"
                onClick={() => handleTabChange("comments")}
              >
                Comments
              </button>
            </li>

            <li className="flex-1 text-center">
              <button
                className="p-2 w-full cursor-pointer tracking-wider hover:text-slate-300"
                onClick={() => handleTabChange("attachments")}
              >
                Attachments
              </button>
            </li>

            <li className="flex-1 text-center">
              <button
                className="p-2 w-full cursor-pointer tracking-wider hover:text-slate-300"
                onClick={() => handleTabChange("doubts")}
              >
                Doubts
              </button>
            </li>

            <li className="flex-1 text-center">
              <button
                className="p-2 w-full cursor-pointer tracking-wider hover:text-slate-300"
                onClick={() => handleTabChange("refrence")}
              >
                Refrence
              </button>
            </li>
          </ul>

          <div className="w-full">
            {activeTab === "comments" && <Comment />}
            {activeTab === "attachments" && <Attachment />}
            {activeTab === "doubts" && <Doubts />}
            {activeTab === "refrence" && <Refrence />}
          </div>
        </div>
      )}



      <ul className="space-y-5 py-5 mx-auto md:w-1/4 w-full bg-gray-700 max-w-screen-md">
        
        <h2 className="text-center text-gray-300 text-xl"> Lectures List </h2>

        {lectureDetails.map((data, i) => (

          <button
            key={i}
            onClick={() => playVideo(data, data.lectureVideo)}
            className="flex flex-col w-full md:flex-row items-center shadow-lg gap-5 md:gap-10 px-5 md:px-10 bg-gray-800 rounded-lg hover:bg-slate-400"
            // onClick={() => fetchLectureDetails()}
          >
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-medium mb-2 text-white">
                {data.lectureName || "Lecture Name"}
              </h3>
              {/* <h5 className="text-gray-100 mb-2 text-lg md:text-xl">
                {data.lectureDescription || "Lecture Description"}
              </h5> */}
              <p className="text-gray-500">{data.channel || "Channel"}</p>
            </div>
          </button>
        ))}
      </ul>
    </div>
  );
  
}

export default ViewLecture;
