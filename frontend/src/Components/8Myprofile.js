import React, { useEffect, useContext, useState } from "react";
import AuthContext from "./context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "./global";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Myprofile() {
  const [isActive, setIsActive] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newUserIdentity, setNewUserIdentity] = useState("");
  //const [selectedFile, setSelectedFile] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState("");
  const [identityAvailable, setIdentityAvailable] = useState(false);
  const [userId, setUserId] = useState("");
  const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/forum/`, {
          crossDomain: true,
          withCredentials: true,
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching forum stats:", error);
      }
    };

    fetchStats();
  }, []);
  useEffect(() => {
    async function getName() {
      try {
        const response = await axios.get(`${API_URL}/auth/user`, {
          crossDomain: true,
          withCredentials: true,
        });
        if (response.data.userName) {
          setNewUserName(response.data.userName);
          setNewLastName(response.data.lastName);
          setEmail(response.data.email);
          setUserId(response.data.userId);
          setNewProfilePic(response.data.profilePic);
          setNewUserIdentity(response.data.userIdentity);
        } else {
          setNewUserName("Guest");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getName();
  }, []);
  const handleProfilePicUpload = async (file) => {
    if (!file) {
      // alert("Please select an image to upload.");

      toast("Please select an image to upload", {
        position: "bottom-center", // Change the position to top-right
        type: "error",
        className: "toast-custom-style",
      });

      return;
    }

    const formData = new FormData();
    formData.append("sampleFile", file);

    try {
      // Upload the image
      const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        { crossDomain: true, withCredentials: true }
      );
      //console.log(response.data);
      // Update the user's profile picture URL
      const newProfilePic = response.data.link;
      setNewProfilePic(newProfilePic);
      // alert("Profile Picture Uploaded successfully!");

      toast("Profile Picture Uploaded successfully!", {
        position: "bottom-center", // Change the position to top-right
        type: "sucess",
        className: "toast-custom-style",
      });

      //   // Update the profile picture in the backend
      //   const sendData = {
      //     profilePic: newProfilePic,
      //     userId: userId,
      //   };

      //   await axios.put("${API_URL}/auth/updateProfile", sendData, { crossDomain: true,withCredentials: true });

      //   // Display a success message
      //   alert("Profile Picture Uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      // alert("Profile Picture Upload Failed. Please try again.");
      toast("Profile Picture Upload Failed. Please try again.", {
        position: "bottom-center", // Change the position to top-right
        type: "error",
        className: "toast-custom-style",
      });
    }
  };
  async function findIdentity(newUserIdentity) {
    const sendData = { userIdentity: newUserIdentity };
    const response = await axios.post(
      `${API_URL}/auth/findIdentity`,
      sendData,
      { crossDomain: true, withCredentials: true }
    );

    if (response.data === true) {
      setIdentityAvailable(true);
    } else if (response.data === false) {
      setIdentityAvailable(false);
    } else {
      setIdentityAvailable(false);
    }
  }
  const handlePasswordReset = async () => {
    const response = await axios.post(
      `${API_URL}/auth/forgotPassword`,
      {
        email: email,
      },
      { crossDomain: true, withCredentials: true }
    );
    if (response.data === "success") {
      // alert("Check your Email for Reset Password One-Time-Password");
      toast("Check your Email for Reset Password One-Time-Password", {
        position: "bottom-center", // Change the position to top-right
        type: "sucess",
        className: "toast-custom-style",
      });
      navigate("/forgotPassword");
    } else if (response.data === "processFailed") {
      // alert("There is some Problem sending you mail");
      toast("There is some Problem sending you mail", {
        position: "bottom-center", // Change the position to top-right
        type: "error",
        className: "toast-custom-style",
      });
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const updateData = {
        newProfilePic,
        newUserName,
        newLastName,
        newUserIdentity,
        userId,
      };
      const response = await axios.put(
        `${API_URL}/auth/updateProfile`,
        updateData,
        { crossDomain: true, withCredentials: true }
      );
      if (response.data === "please enter a password of atleast 6 charecters") {
        // alert("please enter a password of atleast 6 charecters");
        toast("please enter a password of atleast 6 charecters", {
          position: "bottom-center", // Change the position to top-right
          type: "error",
          className: "toast-custom-style",
        });
      } else if (response.data === "password doesnt match") {
        // alert("password doesnt match");
        toast("password doesnt match", {
          position: "bottom-center", // Change the position to top-right
          type: "error",
          className: "toast-custom-style",
        });
      } else if (response.data === "UserName Already Exists") {
        // alert("UserName Already Exists");
        toast("UserName Already Exists", {
          position: "bottom-center", // Change the position to top-right
          type: "error",
          className: "toast-custom-style",
        });
      } else if (response.data === "User Already Exists") {
        // alert("User Already Exists");
        toast("User Already Exists", {
          position: "bottom-center", // Change the position to top-right
          type: "error",
          className: "toast-custom-style",
        });
      } else {
        await getLoggedIn();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  }
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  //const { getLoggedIn } = useContext(AuthContext);
  //const [userName, setUserName] = useState("");
  //const [userId, setUserId] = useState("");
  // const [userIdentity, setUserIdentity] = useState("");
  // const [userProfilePic, setUserProfilePic] = useState("");
  // const [userNotifications, setUserNotifications] = useState([]);
  //const [unreadUserNotifications, setUnreadUserNotifications] = useState();
  const handleProfileUpdate = async () => {
    navigate("/Myprofile");
  };
  const handleLogin = async () => {
    navigate("/LoginPage");
  };
  const handleHome = async () => {
    navigate("/");
  };
  const handleCreatePost = async () => {
    navigate("/CreatePost");
  };
  const handleForumPage = async () => {
    navigate("/forumlist");
  };
  const NavigateToNotification = async () => {
    navigate("/Notification");
  };
  async function logout() {
    await axios.get(`${API_URL}/auth/logout`, {
      crossDomain: true,
      withCredentials: true,
    });
    await getLoggedIn();
    navigate("/LoginPage");
  }

  // Popup

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleModal1 = (e) => {
    e.preventDefault();
    setModal1(!modal1);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  if (modal1) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  // Popup

  const DeletePhotoFunction = (e) => {
    e.preventDefault();
    setNewProfilePic(
      "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
    );
    setModal(!modal);
  };

  const UserAcoountDelete = async (e) => {
    e.preventDefault();
    await axios.delete(`${API_URL}/auth/${userId}`);
    navigate("/");
  };

  // Popup

  const [modal2, setModal2] = useState(false);

  const toggleModal2 = (e) => {
    e.preventDefault();
    setModal2(!modal2);
  };

  if (modal2) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  // if (modal1) {
  //   document.body.classList.add("active-modal");
  // } else {
  //   document.body.classList.remove("active-modal");
  // }

  // Popup

  return (
    <div>
      <ToastContainer />
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="welcometorevnitro">
        <h1>Welcome to Revnitro Forum</h1>
      </div>
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="flexofcreatepost">
        <div className="widthofcreatepost">
          {/* <!--------------------- Revnitro Topics-------------------------------------> */}
          <div className="revnitrotopicssss">
            <div className="iconsflexss">
              <img src="./images/clarity_group-solid.webp" alt="" />
              <div className="textforumdynamic">
                {stats.totalHeadings} Topics
              </div>
            </div>
            <div className="iconsflexss">
              <img src="./images/lets-icons_book-check-fill.webp" alt="" />
              <div className="textforumdynamic">{stats.totalThreads} Posts</div>
            </div>
            <div className="iconsflexss">
              <img src="./images/mdi_account-view.webp" alt="" />
              <div className="textforumdynamic">{stats.totalViews} Views</div>
            </div>
          </div>
          {/* <!--------------------- Revnitro Topics------------------------------------->

        <!--------------------- input and filters-------------------------------------> */}
          <div>
            <div className="formsandfilters">
              <div className="inputformpage">
                <form action="" className="formflexx">
                  <input type="text" name="searchvalue" placeholder="Search" />
                  <button
                    className="searchbuttons"
                    disabled
                    style={{ backgroundColor: "#d5d5d5" }}
                  >
                    <img src="./images/Vector50.webp" alt="" />
                  </button>
                </form>
              </div>
              <div className="createpostdivwithnavigationflex">
                <div className="mobileshowndesktophide">
                  <div
                    id="nav-container"
                    className={isActive ? "is-active" : ""}
                  >
                    <div id="nav-toggle" onClick={toggleNav}></div>
                    <nav className="nav-items">
                      <div className="leftnavbarboxmobile">
                        {userId ? (
                          <div className="notificationinmobileversionzx">
                            <div
                              className="belliiconofmobile"
                              onClick={NavigateToNotification}
                            >
                              <img
                                src="./images/notificationimagesforum.png"
                                alt=""
                              />
                            </div>
                            {/* {{unreadUserNotifications > 0 && (
                              <div className="notificationnumberofmessage">
                                {unreadUserNotifications}
                              </div>
                            )}} */}
                          </div>
                        ) : (
                          <div
                            className="imageflexleftnavbarmobile"
                            style={{ paddingTop: "30px" }}
                          />
                        )}
                        <div className="imageflexleftnavbarmobile">
                          <div className="mobileversionnavbarimagesizess">
                            <div>
                              <img
                                src={
                                  newProfilePic ||
                                  "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                                }
                                alt=""
                              />
                            </div>
                            {userId && (
                              <div
                                className="editiconinmobileversionbox"
                                onClick={handleProfileUpdate}
                              >
                                <img src="./images/profileUpdate.png" alt="" />
                              </div>
                            )}
                          </div>
                          <div className="usernamenavbar">
                            <h3 className="mobilevrersionnamesize">
                              {newUserName}
                            </h3>
                            {userId && (
                              <div className="idnamenamemobile">
                                @{newUserIdentity}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="navigationbuttontopmobile">
                          <div
                            className="navigatelinksmobile"
                            onClick={() => {
                              handleHome();
                            }}
                          >
                            <div>
                              <img
                                src="./images/mdi_home.webp"
                                alt="hometext"
                              />
                            </div>
                            <div className="navigatenamesmobile">Home</div>
                          </div>
                          {userId && (
                            <div>
                              <div
                                className="navigatelinksmobile"
                                onClick={handleCreatePost}
                              >
                                <div>
                                  <img
                                    src="./images/gridicons_create.webp"
                                    alt="hometext"
                                  />
                                </div>
                                <div className="navigatenamesmobile">
                                  Create Post
                                </div>
                              </div>
                            </div>
                          )}
                          <div
                            className="navigatelinksmobile"
                            onClick={handleForumPage}
                          >
                            <div>
                              <img
                                src="./images/fluent_people-team-16-filled.webp"
                                alt="hometext"
                              />
                            </div>
                            <div className="navigatenamesmobile">Forum</div>
                          </div>

                          <div
                            className="navigatelinksmobile"
                            onClick={() => navigate(`/?creator=true`)}
                          >
                            <div>
                              <img
                                src="./images/CreatorsIcon.png"
                                alt="hometext"
                              />
                            </div>
                            <div className="navigatenamesmobile">Creators</div>
                          </div>

                          {!userId ? (
                            <div
                              className="navigatelinksmobile"
                              onClick={handleLogin}
                            >
                              <div>
                                <img
                                  src="./images/ooui_log-in-ltr.webp"
                                  alt="hometext"
                                />
                              </div>
                              <div className="navigatenamesmobile">Log in</div>
                            </div>
                          ) : (
                            <div
                              className="navigatelinksmobile"
                              // onClick={logout}
                            >
                              <div>
                                <img
                                  src="./images/ooui_log-in-ltr.webp"
                                  alt="hometext"
                                />
                              </div>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  // logout();
                                  setModal2(!modal2);
                                  if (modal2) {
                                    document.body.classList.add("active-modal");
                                  } else {
                                    document.body.classList.remove(
                                      "active-modal"
                                    );
                                  }
                                }}
                                className="navigatenamesmobile"
                              >
                                Log Out
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </nav>
                    <div className="MobilePOpupS">
                      {modal2 && (
                        <div className="modal">
                          <div onClick={toggleModal2} className="overlay"></div>
                          <div className="modal-content">
                            <h2>Are you sure want to Logout ?</h2>
                            <p className="PtAGFLEXFORTHEFOREJHIODHJID">
                              <button
                                className="lOGOUTbUTTONmOBILEVFRUHIDNFGIJG"
                                onClick={(e) => {
                                  e.preventDefault();
                                  logout();
                                }}
                              >
                                Yes
                              </button>
                              <button
                                className="nOLogoutbutttreinxdnbutton"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setModal2(!modal2);
                                }}
                              >
                                No
                              </button>
                            </p>

                            {/* <img
                          className="close-modal"
                          onClick={toggleModal}
                          src="./images/pop-up-close-1-48.png"
                        /> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="CreateYourPost">Profile Update</div>
              </div>
            </div>
          </div>
          {/* <!--------------------- input and filters------------------------------------->

        <!--------------------- flex post content-------------------------------------> */}
          <div>
            <div className="createpostfunction">
              <div className="leftnavbarbox">
                {userId ? (
                  <div
                    className="notificationareapostion"
                    onClick={NavigateToNotification}
                  >
                    <div>
                      <img src="./images/notificationimagesforum.png" alt="" />
                    </div>
                    {/*{unreadUserNotifications > 0 && (
                      <div className="notificationnumberofmessage">
                        {unreadUserNotifications}
                      </div>
                    )}*/}
                  </div>
                ) : (
                  <div
                    className="profilephotosssupate"
                    style={{ paddingTop: "30px" }}
                  />
                )}
                <div className="imageflexleftnavbar">
                  <div className="profilephotosssupate">
                    <img
                      src={
                        newProfilePic ||
                        "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                      }
                      alt="imagetext"
                    />
                  </div>
                  <div
                    className="editimageprofilepicsabsolute"
                    onClick={handleProfileUpdate}
                  >
                    <img src="./images/profileUpdate.png" alt="" />
                  </div>
                  <div className="usernamenavbar">
                    <h3>{newUserName}</h3>
                    {userId && (
                      <div className="idnamename">@{newUserIdentity}</div>
                    )}
                  </div>
                </div>
                <div className="navigationbuttontop">
                  <div className="navigatelinks" onClick={handleHome}>
                    <div>
                      <img src="./images/mdi_home.webp" alt="hometext" />
                    </div>
                    <div className="navigatenames">Home</div>
                  </div>
                  {userId && (
                    <div>
                      <div className="navigatelinks" onClick={handleCreatePost}>
                        <div>
                          <img
                            src="./images/gridicons_create.webp"
                            alt="hometext"
                          />
                        </div>
                        <div className="navigatenames">Create Post</div>
                      </div>
                    </div>
                  )}
                  <div className="navigatelinks" onClick={handleForumPage}>
                    <div>
                      <img
                        src="./images/fluent_people-team-16-filled.webp"
                        alt="hometext"
                      />
                    </div>
                    <div className="navigatenames">Forum</div>
                  </div>

                  <div
                    className="navigatelinks"
                    onClick={() => navigate(`/?creator=true`)}
                  >
                    <div>
                      <img src="./images/CreatorsIcon.png" alt="hometext" />
                    </div>
                    <div className="navigatenames">Creators</div>
                  </div>

                  {!userId ? (
                    <div className="navigatelinks" onClick={handleLogin}>
                      <div>
                        <img
                          src="./images/ooui_log-in-ltr.webp"
                          alt="hometext"
                        />
                      </div>
                      <div className="navigatenames">Log in</div>
                    </div>
                  ) : (
                    <div
                      className="navigatelinks"
                      //  onClick={logout}
                    >
                      <div>
                        <img
                          src="./images/ooui_log-in-ltr.webp"
                          alt="hometext"
                        />
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          // logout();
                          setModal2(!modal2);
                          if (modal2) {
                            document.body.classList.add("active-modal");
                          } else {
                            document.body.classList.remove("active-modal");
                          }
                        }}
                        className="navigatenames"
                      >
                        Log Out
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="rightcreatepost">
                <div className="createpostdiv">
                  <div>
                    <div className="myprofilepagerightsidediv">
                      <form action="" onSubmit={handleSubmit}>
                        <div className="profilephototattachdiv">
                          <div className="myprofilephotouploaddiv">
                            <img src={newProfilePic} alt="" />
                          </div>
                          <div className="postionabsoluteofprofile">
                            <div className="myprofilefile-input">
                              <input
                                type="file"
                                name="myprofilefile-input"
                                id="myprofilefile-input"
                                className="myprofilefile-input__input"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  //setSelectedFile(file);
                                  handleProfilePicUpload(file); // Pass the file directly, not selectedFile
                                }}
                              />
                              <label
                                className="myprofilefile-input__label"
                                htmlFor="myprofilefile-input"
                              >
                                <img
                                  src="./images/solar_camera-bold.png"
                                  alt=""
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={toggleModal}
                          className="Deleteofthihbsvddg"
                        >
                          <div className="deletebuttifdgbshgfdhss">
                            <img
                              style={{ cursor: "pointer" }}
                              src="./images/DeleteImageICon.png"
                              alt="Delete Icon"
                            />
                          </div>
                          <div
                            style={{ cursor: "pointer" }}
                            className="DeleteImageprofilejbhdf"
                          >
                            Delete Image
                          </div>
                        </div>
                        {modal && (
                          <div className="modal">
                            <div
                              onClick={toggleModal}
                              className="overlay"
                            ></div>
                            <div className="modal-content">
                              <h2>Are you sure want to Delete it?</h2>
                              <p className="PtAGFLEXFORTHEFOREJHIODHJID">
                                <button
                                  className="lOGOUTbUTTONmOBILEVFRUHIDNFGIJG"
                                  onClick={DeletePhotoFunction}
                                >
                                  Yes
                                </button>
                                <button
                                  className="nOLogoutbutttreinxdnbutton"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setModal(!modal);
                                  }}
                                >
                                  No
                                </button>
                              </p>

                              {/* <img
                                style={{ cursor: "pointer" }}
                                className="close-modal"
                                onClick={toggleModal}
                                src="./images/pop-up-close-1-48.png"
                              /> */}
                            </div>
                          </div>
                        )}
                        <div className="MyPrileUPlaterghgdvbjfdf">
                          <div className="myheadingtopics">
                            <div className="headingcreatepost">
                              First&nbsp;Name
                            </div>
                            <div className="semicolonhide">:</div>
                            <div className="cinputforumcreatepost">
                              <input
                                type="text"
                                name="newUserName"
                                value={newUserName}
                                placeholder="New User Name"
                                onChange={(e) => setNewUserName(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="myheadingtopics">
                            <div className="headingcreatepost">
                              Last&nbsp;Name
                            </div>
                            <div className="semicolonhide">:</div>
                            <div className="cinputforumcreatepost">
                              <input
                                type="text"
                                name="newLastName"
                                value={newLastName}
                                placeholder="New Last Name"
                                onChange={(e) => setNewLastName(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="myheadingtopics">
                            <div className="headingcreatepost">
                              User ID &nbsp; &nbsp;&nbsp;&nbsp;
                            </div>
                            <div className="semicolonhide">:</div>
                            <div className="cinputforumcreatepost">
                              <input
                                type="text"
                                name="text"
                                value={newUserIdentity}
                                placeholder="User ID"
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setNewUserIdentity(newValue);
                                  findIdentity(newValue);
                                }}
                                required
                              />
                            </div>
                          </div>

                          <div className="myprofileidalreadytaken">
                            {identityAvailable && `*ID Already Taken`}
                          </div>
                        </div>

                        <button
                          className="updatechangesbuttondiv"
                          type="submit"
                        >
                          Update Changes
                        </button>
                        <button
                          onClick={toggleModal1}
                          style={{ background: "red" }}
                          className="updatechangesbuttondiv"
                          type="submit"
                        >
                          Delete Account
                        </button>

                        {modal1 && (
                          <div className="modal">
                            <div
                              onClick={toggleModal1}
                              className="overlay"
                            ></div>
                            <div className="modal-content">
                              <h2>Are you sure Delete Account ?</h2>
                              <p className="PtAGFLEXFORTHEFOREJHIODHJID">
                                <button
                                  className="lOGOUTbUTTONmOBILEVFRUHIDNFGIJG"
                                  onClick={UserAcoountDelete}
                                >
                                  Yes
                                </button>
                                <button
                                  className="nOLogoutbutttreinxdnbutton"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setModal1(!modal1);
                                  }}
                                >
                                  No
                                </button>
                              </p>
                            </div>
                          </div>
                        )}

                        <div
                          className="myprofileforogtopassword"
                          onClick={handlePasswordReset}
                        >
                          Forgot Password
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--------------------- flex post content-------------------------------------> */}
        </div>
      </div>
      {modal2 && (
        <div className="modal">
          <div onClick={toggleModal2} className="overlay"></div>
          <div className="modal-content">
            <h2>Are you sure want to Logout ?</h2>
            <p className="PtAGFLEXFORTHEFOREJHIODHJID">
              <button
                className="lOGOUTbUTTONmOBILEVFRUHIDNFGIJG"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Yes
              </button>
              <button
                className="nOLogoutbutttreinxdnbutton"
                onClick={(e) => {
                  e.preventDefault();
                  setModal2(!modal2);
                }}
              >
                No
              </button>
            </p>

            {/* <img
                          className="close-modal"
                          onClick={toggleModal}
                          src="./images/pop-up-close-1-48.png"
                        /> */}
          </div>
        </div>
      )}
    </div>
  );
}

// function notificationclickfunction() {
//   var notificationnumberofmessage = document.getElementsByClassName(
//     "notificationnumberofmessage"
//   );
//   notificationnumberofmessage[0].style.display = "none";
//   notificationnumberofmessage[1].style.display = "none";
// }

export default Myprofile;
