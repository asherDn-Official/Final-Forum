import React, { useEffect, useState, useContext } from "react";
import AuthContext from "./context/authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./global";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [isActive, setIsActive] = useState(false);
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
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  // function notificationclickfunction() {
  //   var notificationnumberofmessage = document.getElementsByClassName(
  //     "notificationnumberofmessage"
  //   );
  //   notificationnumberofmessage[0].style.display = "none";
  //   notificationnumberofmessage[1].style.display = "none";
  // }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const loginData = { email, password };
      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        crossDomain: true,
        withCredentials: true,
      });
      if (response.data === "NoUser") {
        toast("Enter Proper Login Details", {
          position: "bottom-center", // Change the position to top-right
          type: "error",
          className: "toast-custom-style",
        });
      } else {
        await getLoggedIn();
        navigate("/");
      }
    } catch (err) {
      // alert("Enter Proper Login Details");
      toast("Enter Proper Login Details", {
        position: "bottom-center", // Change the position to top-right
        type: "error",
        className: "toast-custom-style",
      });
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      // alert("Type The Email");
      toast("Type The Email", {
        position: "bottom-center", // Change the position to top-right
        type: "error",
        className: "toast-custom-style",
      });
      return;
    }
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
        type: "error",
        className: "toast-custom-style",
      });
      navigate("/forgotPassword");
    } else if (response.data === "User Not Available") {
      // alert("User Doesn't Exists");
      toast("User Doesn't Exists , Please Register", {
        position: "bottom-center", // Change the position to top-right
        type: "error",
        className: "toast-custom-style",
      });
    } else if (response.data === "processFailed") {
      // alert("There is some Problem sending you mail");
      toast("There is some Problem sending you mail", {
        position: "bottom-center", // Change the position to top-right
        type: "error",
        className: "toast-custom-style",
      });
    }
  };
  const { getLoggedIn } = useContext(AuthContext);
  //const [userName, setUserName] = useState("");
  // const [userId, setUserId] = useState("");
  // const [userIdentity, setUserIdentity] = useState("");
  // const [userProfilePic, setUserProfilePic] = useState("");
  // const handleProfileUpdate = async () => {
  //   navigate("/Myprofile");
  // };
  // const handleLogin = async () => {
  //   navigate("/LoginPage");
  // };
  const handleHome = async () => {
    navigate("/");
  };
  // const handleCreatePost = async () => {
  //   navigate("/CreatePost");
  // };
  const handleForumPage = async () => {
    navigate("/forumlist");
  };
  async function logout() {
    await axios.get(`${API_URL}/auth/logout`, {
      crossDomain: true,
      withCredentials: true,
    });
    await getLoggedIn();
    navigate("/LoginPage");
  }
  const navigateToRegister = () => {
    navigate("/Register");
  };
  // const NavigateToNotification = () => {};

  // Popup

  const [modal, setModal] = useState(false);
  //const [modal1, setModal1] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  // const toggleModal1 = (e) => {
  //   e.preventDefault();
  //   setModal1(!modal1);
  // };

  if (modal) {
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
      <div className="indexpagemediaqueryflex">
        <div className="mediaqueryindex">
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
                        <div
                          className="imageflexleftnavbarmobile"
                          style={{ paddingTop: "30px" }}
                        >
                          <div className="mobileversionnavbarimagesizess">
                            <div>
                              <img
                                src={
                                  "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                                }
                                alt=""
                              />
                            </div>
                            {/* {userId && (
                              <div
                                className="editiconinmobileversionbox"
                                onClick={handleProfileUpdate}
                              >
                                <img src="./images/profileUpdate.png" alt="" />
                              </div>
                            )} */}
                          </div>
                          <div className="usernamenavbar">
                            <h3 className="mobilevrersionnamesize">
                              {/* {userName} */}
                            </h3>
                            {/* {userId && (
                              <div className="idnamenamemobile">
                                @{userIdentity}
                              </div>
                            )} */}
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
                          {/* {userId && (
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
                          )} */}
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

                          {/* {!userId ? (
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
                                  setModal(!modal);
                                  if (modal) {
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
                          )} */}
                        </div>
                      </div>
                    </nav>
                    <div className="MobilePOpupS">
                      {modal && (
                        <div className="modal">
                          <div onClick={toggleModal} className="overlay"></div>
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
                                  setModal(!modal);
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
                <div className="CreateYourPost">Login Page</div>
              </div>
            </div>
          </div>
          {/* <!--------------------- input and filters------------------------------------->

        <!--------------------- flex post content-------------------------------------> */}
          <div>
            <div className="postmapfunctionarea">
              <div className="leftnavbarbox">
                <div className="imageflexleftnavbar">
                  <div
                    className="profilephotosssupate"
                    style={{ paddingTop: "30px" }}
                  >
                    <img
                      src={
                        "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                      }
                      alt="imagetext"
                    />
                  </div>

                  <div className="usernamenavbar">
                    {/* <h3>{userName}</h3> */}
                    {/* {userId && (
                      <div className="idnamename">@{userIdentity}</div>
                    )} */}
                  </div>
                </div>
                <div className="navigationbuttontop">
                  <div className="navigatelinks" onClick={handleHome}>
                    <div>
                      <img src="./images/mdi_home.webp" alt="hometext" />
                    </div>
                    <div className="navigatenames">Home</div>
                  </div>
                  {/* {userId && (
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
                  )} */}
                  <div className="navigatelinks" onClick={handleForumPage}>
                    <div>
                      <img
                        src="./images/fluent_people-team-16-filled.webp"
                        alt="hometext"
                      />
                    </div>
                    <div className="navigatenames">Forum</div>
                  </div>

                  {/* {!userId ? (
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
                        className="navigatenames"
                        onClick={(e) => {
                          e.preventDefault();
                          // logout();
                          setModal(!modal);
                          if (modal) {
                            document.body.classList.add("active-modal");
                          } else {
                            document.body.classList.remove("active-modal");
                          }
                        }}
                      >
                        Log Out
                      </div>
                    </div>
                  )} */}
                </div>

                {modal && (
                  <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
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
                            setModal(!modal);
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
              <div className="rightpostbox">
                <div>
                  <div className="posterss">
                    <div>
                      <div>
                        <div className="gggedindeatilstext">Log in Details</div>
                        <form
                          action=""
                          className="formwidthpaddings"
                          onSubmit={handleSubmit}
                        >
                          <div className="loginpageuserididv">
                            <input
                              type="email"
                              name="email"
                              value={email}
                              placeholder="Email"
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="loginpagepassworddiv">
                            <input
                              type="password"
                              name="password"
                              value={password}
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <button className="loginbuttonpagediv" type="submit">
                            Log in
                          </button>
                          <div
                            className="loginpagessforgotpasswordtext"
                            onClick={handleForgotPassword}
                          >
                            Forgot Password
                          </div>
                          <div className="donthaveaxxcountpoassword">
                            Dont have an account&nbsp;?
                            <span
                              className="registerhere"
                              onClick={navigateToRegister}
                            >
                              &nbsp;Register here
                            </span>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--------------------- flex post content-------------------------------------> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
