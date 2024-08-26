import React, { useState } from "react";
import "./UploadVideo.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

const initialVideos = [];

const UploadVideo = () => {
  const [videos, setVideos] = useState(initialVideos);
  const [showForm, setShowForm] = useState(false);
  const [signedUrl, seteSignedUrl] = useState(null);
  const [newVideo, setNewVideo] = useState({
    video: "",
    duration: "",
    lectureName: "",
    courseCode: "",
    lectureDescription: "",
    lectureImage: "",
    attachments: "",
    rating: "",
    teacherMail: "",
  });

  const [file, setfile] = useState();

  const [filterDuration, setFilterDuration] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { courseCode } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo({ ...newVideo, [name]: value });
  };

  const handleFile = (e) => {
    setfile(e.target.files[0]);
  };
  const handleVideoUpload = async (e) => {
    if (!file) return;

    // const videoUrl = URL.createObjectURL(file);
    // const video = document.createElement("video");

    // video.preload = "metadata";
    // video.onloadedmetadata = () => {
    //   window.URL.revokeObjectURL(videoUrl);
    //   const duration = Math.floor(video.duration);
    //   const minutes = Math.floor(duration / 60);
    //   const seconds = duration % 60;
    //   setNewVideo({
    //     ...newVideo,
    //     video: videoUrl,
    //     duration: `${minutes}m ${seconds}s`,
    //   });
    // };
    // video.src = videoUrl;
    const response = await axios.post(
      `/api/course/uploadLectures?courseCode=${courseCode}`
    );
    seteSignedUrl(response.data.signedurl);
    console.log("response 1=>", response);

    const formData = new FormData();
    formData.append("file", file);
    const resposne2 = await axios.put(response.data.signedurl, formData, {
      headers: {
        "Content-Type": "video/mp4",
        "Access-Control-Allow-Origin":
          "videostreaming31.s3.eu-north-1.amazonaws.com",
        "Access-Control-Allow-Credentials": true,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    });

    setUploading(false);

    console.log("response 2=>", resposne2);
  };

  async function uploadVideo(videoFile) {
    //   const videoUrl = URL.createObjectURL(videoFile);
    //   const video = document.createElement("video");

    //   video.onloadedmetadata = async () => {
    //     window.URL.revokeObjectURL(videoUrl);
    //     const duration = Math.floor(video.duration);
    //     const minutes = Math.floor(duration / 60);
    //     const seconds = duration % 60;
    //     setNewVideo({
    //       ...newVideo,
    //       video: videoUrl,
    //       duration: `${minutes}m ${seconds}s`,
    //     });

    let data = new FormData();

    try {
      // Get pre-signed URL from backend
      const response = await axios.post(
        `/api/course/uploadLectures?courseCode=${courseCode}`
      );

      const signedUrl = response.data.signedurl;
      seteSignedUrl(signedUrl);

      console.log("response 1=>", response);
      // let config = {
      //   method: "put",
      //   maxBodyLength: Infinity,
      //   url: signedUrl,
      //   headers: {
      //     ...data.getHeaders(),
      //   },
      //   data: video,
      // };

      console.log(videoFile);
      const res = await axios.put(signedUrl, videoFile, {
        maxBodyLength: Infinity,
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "*",
          Host: "videostreaming31.s3.eu-north-1.amazonaws.com",
        },
      });

      console.log(res.data);

      // Upload video to S3 using pre-signed URL
      // const response2 = await axios.put(signedUrl, videoFile, {
      //   headers: {
      //     "Content-Type": videoFile.type,
      //     "Access-Control-Allow-Origin": "http://localhost:3000",
      //     "Access-Control-Allow-Credentials": true,
      //   },
      //   transformRequest: [(data) => data],
      // });
      // console.log("response 2=>", response2);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  }

  // video.src = videoUrl;
  // }

  // Usage example
  // uploadVideo(videoFile, courseCode, newVideo, setNewVideo, seteSignedUrl);

  const uploadLecture = async (e) => {
    e.preventDefault();

    const body = {
      video: newVideo.video,
      lectureName: newVideo.lectureName,
      lectureDescription: newVideo.lectureDescription,

      lectureImage: newVideo.lectureImage,
      attachments: newVideo.attachments,
    };

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    try {
      const response = await axios.post(
        `/api/course/uploadLectures?courseCode=${courseCode}`
      );
      seteSignedUrl(response.data.signedurl);
      console.log("response 1=>", response);
    } catch (error) {
      console.error("Error uploading lecture:", error);
    }
  };

  const filterVideosByDuration = (duration) => {
    setFilterDuration(duration);
  };

  const filterVideosByCategory = (category) => {
    setFilterCategory(category);
  };

  const filteredVideos = videos.filter((video) => {
    const videoDuration = parseInt(video.duration.split("m")[0]);
    const durationMatch =
      filterDuration === "" ||
      (filterDuration === "5" && videoDuration < 5) ||
      (filterDuration === "10" && videoDuration < 10) ||
      (filterDuration === "20" && videoDuration < 20) ||
      (filterDuration === "30" && videoDuration < 30) ||
      (filterDuration === "40" && videoDuration < 40) ||
      (filterDuration === "50" && videoDuration < 50) ||
      (filterDuration === "60" && videoDuration < 60) ||
      (filterDuration === "61" && videoDuration > 61);
    const categoryMatch =
      filterCategory === "" || video.category === filterCategory;
    return durationMatch && categoryMatch;
  });

  const handleVideoClick = (video) => {
    const videoElement = document.createElement("video");
    videoElement.src = video.video;
    videoElement.controls = true;
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    document.body.appendChild(videoElement);
    videoElement.requestFullscreen();
    videoElement.play();

    videoElement.onended = () => {
      videoElement.remove();
    };

    videoElement.onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        videoElement.remove();
      }
    };
  };

  return (
    <div className="upload-video-container">
      <Navbar />

      <div className="controls-container">
        <div className="filters-container">
          <div className="filter-sort-group">
            <label htmlFor="filter">Filter By:</label>
            <select
              className="select-box"
              onChange={(e) => filterVideosByDuration(e.target.value)}
              value={filterDuration}
            >
              <option value="">Select Duration</option>
              <option value="5">Less than 5 min</option>
              <option value="10">Less than 10 min</option>
              <option value="20">Less than 20 min</option>
              <option value="30">Less than 30 min</option>
              <option value="40">Less than 40 min</option>
              <option value="50">Less than 50 min</option>
              <option value="60">Less than 60 min</option>
              <option value="61">Greater than 60 min</option>
            </select>
          </div>
          <div className="filter-sort-group">
            <label htmlFor="sort">Sort By:</label>
            <select
              className="select-box"
              onChange={(e) => filterVideosByCategory(e.target.value)}
              value={filterCategory}
            >
              <option value="">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="AI">AI</option>
              <option value="ML">ML</option>
            </select>
          </div>
        </div>
        <div className="upload-btn-container">
          <button onClick={() => setShowForm(true)} className="upload-btn">
            Upload Video
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowForm(false)}>
              &times;
            </span>
            <form className="upload-form" onSubmit={(e) => e.preventDefault()}>
              <h2>Upload Video</h2>
              <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
                <div className="mb-4">
                  <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Choose a file
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFile}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                  />
                </div>
                <div className="form-group">
                  <label className="text-gray-800">Lecture Name *</label>
                  <input
                    type="text"
                    name="lectureName"
                    value={newVideo.lectureName}
                    onChange={handleInputChange}
                    placeholder="Lecture Name"
                    required
                  />
                </div>
                <div className="form-group my-4">
                  <label className="text-gray-800">Lecture Description *</label>
                  <textarea
                    name="lectureDescription"
                    value={newVideo.lectureDescription}
                    onChange={handleInputChange}
                    placeholder="Lecture Description"
                    required
                    className="p-1 text-black"
                  ></textarea>
                </div>
                <button
                  onClick={handleVideoUpload}
                  disabled={!file || uploading}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                {uploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-700">
                        Uploading...
                      </span>
                      <span className="text-sm font-medium text-blue-700">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/****
              <div className="form-row">

                <div className="form-group">
                  <label>Lecture Image *</label>
                  <input type="file" name="lectureImage" onChange={handleInputChange} accept="image/*" />
                </div>


                <div className="form-group">
                  <label>Attachments *</label>
                  <input type="file" name="attachments" onChange={handleInputChange} accept=".pdf,.doc,.ppt,.zip" />
                </div>

              </div>

 */}
            </form>
          </div>
        </div>
      )}

      <div className="video-list-container">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="video-item"
            onClick={() => handleVideoClick(video)}
          >
            <h3>{video.title}</h3>
            <p>Instructor: {video.instructor}</p>
            <p>Tags: {video.tags}</p>
            <p>Category: {video.category}</p>
            <p>Duration: {video.duration}</p>
            <p>Lecture Name: {video.lectureName}</p>
            <p>Course Code: {video.courseCode}</p>
            <p>Lecture Description: {video.lectureDescription}</p>
            <p>Rating: {video.rating}</p>
            <p>Teacher Mail: {video.teacherMail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadVideo;
