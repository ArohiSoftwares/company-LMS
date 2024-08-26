import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import "./teacherProfile.css";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";

const TeacherProfile = () => {
  const loginUser = "teacher";

  const [profile, setProfile] = useState({
    teacherFullName: "",
    teacherEmail: "",
    teacherPhoneNumber: "",
    teacherAddress: "",
    teacherAge: "",
    teacherGender: "",
    profilePicture: "",
    qualifications: "",
  });
  const [teacherSubjects,setteacherSubjects] =useState([])
  const [aadhar, setAadhar] = useState(null);
  const [panCard, setPanCard] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      teacherFullName: profile.teacherFullName,
      teacherEmail: profile.teacherEmail,
      teacherPhoneNumber: profile.teacherPhoneNumber,
      teacherGender: profile.teacherGender,
      teacherAge: profile.teacherAge,
      teacherAddress: profile.teacherAddress,
      profilePicture: profile.profilePicture,
      teacherSubjects: teacherSubjects,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    try {
      
      const response = await axios.put(`/api/teacher/update`, profile , config);

      console.log("response =>", response);



      if (aadhar) {
        const form = new FormData();
        form.append("aadhar", aadhar);
        console.log(form);
        const aadharResp = await axios.post(
          `/api/teacher/aadhar`,
          form,
          config
        );
        console.log("Aadhard resp", aadharResp);
      }
      if (panCard) {
        const panResponse = await axios.post(
          `/api/teacher/pancard`,
          panCard,
          config
        );
        console.log("Pan resp", panResponse);
      }
    } 
    catch (error) {
      console.log(error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/teacher/getProfile/`);
      console.log("get profile response =>", response);
      setProfile(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubjects = (e) => {
    const check = teacherSubjects.filter((subject) => subject !== e.target.value);
    console.log(check, e.target.checked)
    if(e.target.checked === false){
      const newarr = teacherSubjects.filter((subject) => subject !== e.target.value);
      setteacherSubjects([...newarr])
    }
    if (e.target.checked && check){
       setteacherSubjects([...teacherSubjects,e.target.value]);
    };
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="maincontainer">
      <Navbar />
      <div className="profile-page">
        <main className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-container">
                <Avatar
                  src={profile.profilePicture}
                  alt="Profile"
                  className="avatar"
                  onClick={() => document.getElementById("avatarInput").click()}
                />
                <input
                  type="file"
                  id="avatarInput"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <h2>Teacher Profile</h2>
            </div>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="teacherFullName"
                    value={profile.teacherFullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="teacherEmail"
                    value={profile.teacherEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Qualifications *</label>
                <textarea
                  rows={4}
                  cols={48}
                  className="rounded-lg"
                  name="qualifications"
                  value={profile.qualifications}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <h3 className="text-white font-bold">Subjects</h3>

                <div className="flex gap-4 my-6">

                  <label className="flex gap-0">
                    <input
                      type="checkbox"
                      onChange={handleSubjects}
                      name="teacherSubjects"
                      className=""
                      value={"Wev Development"}
                    />{" "}
                    Web Development{" "}
                  </label>


                  <label className="flex gap-0">
                    <input
                      type="checkbox"
                      onChange={handleSubjects}
                      name="teacherSubjects"
                      className=""
                      value={"AIDS"}
                    />{" "}
                    AIDS{" "}
                  </label>

                  <label className="flex gap-0">
                    <input
                      type="checkbox"
                      onChange={handleSubjects}
                      name="teacherSubjects"
                      className=""
                      value={"Data Analytics"}
                    />{" "}
                    Data Analytics{" "}
                  </label>

                  <label className="flex gap-0">
                    <input
                      type="checkbox"
                      onChange={handleSubjects}
                      name="teacherSubjects"
                      className=""
                      value={"Mobile Development"}
                    />{" "}
                    Mobile Development{" "}
                  </label>
                  <label className="flex gap-0">
                    <input
                      type="checkbox"
                      onChange={handleSubjects}
                      name="teacherSubjects"
                      className=""
                      value={"GenAi"}
                    />{" "}
                    GenAi{" "}
                  </label>

                </div>

              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mobile No *</label>
                  <input
                    type="tel"
                    name="teacherPhone"
                    value={profile.teacherPhoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="teacherGender"
                    value={profile.teacherGender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="teacherAge"
                    value={profile.teacherAge}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="teacherAddress"
                    value={profile.teacherAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="">
                <h2>Documents</h2>

                <div className="flex my-4  gap-6 flex-wrap">
                  <span>
                    <label>Aadhar card</label>
                    <input
                      type="file"
                      onChange={(e) => setAadhar(e.target.files[0])}
                      accept=".png, .jpg, .jpeg .pdf"
                      placeholder="Aadhar card"
                    />
                  </span>
                  <span>
                    <label>Pan card</label>
                    <input
                      type="file"
                      onChange={(e) => setPanCard(e.target.files[0])}
                      accept=".png, .jpg, .jpeg .pdf"
                      placeholder="Pan card"
                    />
                  </span>
                  {/* <span>
                    <label>aadhar card</label>
                    <input type="file" placeholder="aadhar card" />
                  </span>
                  <span>
                    <label>aadhar card</label>
                    <input type="file" placeholder="aadhar card" />
                  </span> */}

                </div>
              </div>
              <button type="submit" className="save-changes">
                Save changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherProfile;
