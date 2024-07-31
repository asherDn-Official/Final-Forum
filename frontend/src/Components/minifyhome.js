import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import "../App.css";
import AuthContext from "./context/authcontext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import moment from "moment";
import API_URL from "./global";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
} from "react-share";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Home() {
  const [scrollId, setScrollId] = useState(null);
  const { heading } = useParams();
  const [searchParams] = useSearchParams();
  const { getLoggedIn } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const { reporteduser } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentThreadId, setCurrentThreadId] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [selectedHeading, setSelectedHeading] = useState(heading || "All");
  const [sortOption, setSortOption] = useState("newest");
  const [notification, setNotification] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const [likedThreads, setLikedThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [commenterNames, setCommenterNames] = useState([]);
  const [unreadUserNotifications, setUnreadUserNotifications] = useState();
  const Navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [commentSearch, setCommentSearch] = useState("");
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  function showHideDiv(ele) {
    var srcElement = document.getElementById(ele);
    if (srcElement != null) {
      if (srcElement.style.display === "block") {
        srcElement.style.display = "none";
      } else {
        srcElement.style.display = "block";
      }
    }
  }
  async function logout() {
    await axios.get(`${API_URL}/auth/logout`, {
      crossDomain: true,
      withCredentials: true,
    });
    await getLoggedIn();
    Navigate("/LoginPage");
  }
  const fetchThreads = useCallback(async () => {
    try {
      const creatorKey = searchParams.get("creator");
      const response = await axios.get(`${API_URL}/threads`, {
        params: {
          sort: sortOption,
          search: reporteduser || "",
          heading: selectedHeading,
          userThread: creatorKey ? "verified" : "",
        },
        withCredentials: true,
      });
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  }, [searchParams, reporteduser, selectedHeading, sortOption]);

  const getName = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user`, {
        withCredentials: true,
      });
      const userData = response.data;
      if (userData.userName) {
        setUserName(userData.userName);
        setUserId(userData.userId);
        setUserProfilePic(userData.profilePic);
        setIsAdmin(userData.isAdmin);
        setUserIdentity(userData.userIdentity);
        setUnreadUserNotifications(userData.unreadNotifications);
      } else {
        setUserName("Guest");
        setUserProfilePic(
          "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);
  const [headings, setHeadings] = useState();

  useEffect(() => {
    fetchHeadings();
  }, []);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get(`${API_URL}/heading`, {
        crossDomain: true,
        withCredentials: true,
      });
      const data = await response.data;

      if (data) {
        setHeadings(data);
      } else {
        console.error("Failed to fetch headings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching headings:", error.message);
    }
  };
  useEffect(() => {
    if (heading) {
      console.log("heading", heading);
      setSelectedHeading(heading);
      fetchThreads();
    } else {
      setSelectedHeading("All");
    }
  }, [heading]);
  useEffect(() => {
    async function fetchData() {
      try {
        await fetchThreads();
        await getName();
      } catch (error) {
        console.error("Error fetching headings:", error);
      }
    }
    fetchData();
  }, [fetchThreads, getName]);
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
  const fetchCommenterNames = async (threadId, commentSearch) => {
    try {
      const response = await axios.get(
        `${API_URL}/threads/${threadId}/commenters`,
        { crossDomain: true, withCredentials: true }
      );
      const commenters = response.data;
      const searchcode = extractWordsStartingWithAt(commentSearch);
      console.log(searchcode);
      const commenterInfo = commenters.map((commenter) => ({
        userIdentity: commenter.userIdentity,
        userPic: commenter.userPic,
      }));
      console.log("commenterInfo", commenterInfo);
      console.log("searchcode", searchcode);
      const filteredCommenterInfo = commenterInfo.filter((commenter) => {
        return searchcode.some((trm) => commenter.userIdentity.includes(trm));
      });
      console.log("filteredCommenterInfo", filteredCommenterInfo);
      setCommenterNames(filteredCommenterInfo);
    } catch (error) {
      console.error("Error fetching commenter names:", error);
    }
  };
  const handleCommentInput = async (e, thread) => {
    await setCommentSearch(e.target.value);
    console.log("commentSearch", commentSearch);
    console.log("value", e.target.value);
    if (e.target.value.includes("@")) {
      setCurrentThreadId(thread._id);
      fetchCommenterNames(thread._id, commentSearch);
    } else {
      setCurrentThreadId("");
      setCommenterNames("");
    }
  };
  const handleHeadingChange = async (e) => {
    const selectedHeading = await e.target.value;
    setSelectedHeading(selectedHeading);
  };
  const resetThreads = async () => {
    try {
      // If the current filter is "My Threads," reset to all threads
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&heading=${selectedHeading}`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUserThreads = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&userThread=${userIdentity}`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching user threads:", error);
    }
  };
  const handleRevnitro = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&userThread=admin`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching user threads:", error);
    }
  };
  const handleCreatorSection = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&userThread=verified`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching user threads:", error);
    }
  };
  const handleSearch = (e) => {
    const searchTermValue = e.target.value;
    setSearchTerm(searchTermValue);
    axios
      .get(`${API_URL}/threads?sort=${sortOption}&search=${searchTermValue}`, {
        crossDomain: true,
        withCredentials: true,
      })
      .then((response) => {
        setThreads(response.data);
        setCurrentSearchTerm(searchTermValue);
      })
      .catch((error) => console.error(error));
  };
  const closeShareModal = () => {
    setSelectedThread(null);
    setShareModalVisible(false);
  };
  const handleSortChange = (option) => {
    setSortOption(option);
    fetchThreads();
  };
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const handleLike = async (threadId) => {
    try {
      if (!userId) {
        Navigate("/LoginPage");
        return;
      }
      setThreads(
        threads.map((thread) =>
          thread._id === threadId
            ? {
                ...thread,
                likes: thread.likedBy.includes(userId)
                  ? thread.likes - 1
                  : thread.likes + 1,
                likedBy: userId,
              }
            : thread
        )
      );
      const response = await axios.post(
        `${API_URL}/threads/${threadId}/like`,
        {
          userId: userId,
        },
        { crossDomain: true, withCredentials: true }
      );
      setThreads(
        threads.map((thread) =>
          thread._id === threadId
            ? {
                ...thread,
                likes: response.data.likes,
                likedBy: response.data.likedBy,
              }
            : thread
        )
      );
      if (likedThreads.includes(threadId)) {
        setLikedThreads(likedThreads.filter((id) => id !== threadId));
      } else {
        setLikedThreads([...likedThreads, threadId]);
      }
    } catch (error) {
      console.error("Error handling like:", error.response.data);
    }
  };
  const handleShare = (thread) => {
    if (selectedThread && selectedThread._id === thread._id) {
      closeShareModal();
    } else {
      setSelectedThread(thread);
      setShareModalVisible(true);
    }
  };
  const shareOther = (thread) => {
    navigator.share({
      title: thread.title,
      text: "Checkout This Thread : " + thread.title,
      url: `"\nclick this link : " +${window.location.origin}/${thread._id}`,
    });
    closeShareModal();
  };
  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }
  const handleNameSelection = (selectedName) => {
    const currentThreadId = Object.keys(newComments)[0];
    const currentCommentText = newComments[currentThreadId]?.text || "";
    const atIndex = currentCommentText.indexOf("@");
    const updatedCommentText =
      currentCommentText.substring(0, atIndex) +
      "#" +
      selectedName +
      currentCommentText.substring(atIndex + selectedName.length + 1);
    setNewComments((prevComments) => ({
      ...prevComments,
      [currentThreadId]: { text: updatedCommentText },
    }));
    setCommenterNames([]);
  };
  const handleComment = async (threadId) => {
    if (!userId) {
      showNotification("Login to comment");
      Navigate("/LoginPage");
      return;
    }
    const commentText = newComments[threadId]?.text.trim();
    if (!commentText) {
      toast("Comment text cannot be empty.", {
        position: "bottom-center",
        type: "error",
        className: "toast-custom-style",
      });
      return;
    }
    if (commentText.includes("#")) {
      const commenterName = commentText.split("#")[1].split(" ")[0];
      setCommenterNames([commenterName]);
    }
    const commentData = {
      text: newComments[threadId]?.text.trim(),
      userId,
      mentionedUserIdentities: getMentionedUserIdentities(
        newComments[threadId]?.text
      ),
    };
    await axios
      .post(`${API_URL}/threads/${threadId}/comments`, commentData, {
        crossDomain: true,
        withCredentials: true,
      })
      .then((response) => {
        if (response) {
          Navigate(`/${threadId}#bottom`);
        }
      })
      .catch((error) => console.error(error));
  };
  const getMentionedUserIdentities = (text) => {
    const mentions = text.match(/#([a-zA-Z0-9_]+)/g) || [];
    return mentions.map((mention) => mention.slice(1));
  };
  const handleDeleteComment = async (threadId, commentId) => {
    try {
      await axios.delete(
        `${API_URL}/threads/${threadId}/comments/${commentId}`,
        { isAdmin: isAdmin },
        { crossDomain: true, withCredentials: true }
      );
      setThreads(
        threads.map((thread) => {
          if (thread._id === threadId) {
            return {
              ...thread,
              comments: thread.comments.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }
          return thread;
        })
      );

      showNotification("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showNotification("Failed to delete comment. Please try again.");
    }
  };
  const handleProfileUpdate = async () => {
    Navigate("/Myprofile");
  };
  const handleLogin = async () => {
    Navigate("/LoginPage");
  };
  const handleCreatePost = async () => {
    Navigate("/CreatePost");
  };
  const handleForumPage = async () => {
    Navigate("/forumlist");
  };
  const NavigateToNotification = async () => {
    Navigate("/Notification");
  };
  const NavigateToPost = async (threadId) => {
    Navigate(`/${threadId}`);
  };
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleModal2 = (e) => {
    e.preventDefault();
    setModal2(!modal2);
  };
  if (modal2) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  if (modal2) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Element with id '${elementId}' not found.`);
    }
  }
  function extractWordsStartingWithAt(text) {
    const regex = /@\w+/;
    const match = commentSearch.match(regex);
    if (match) {
      return match[0].slice(1);
    } else {
      return "";
    }
  }
  const navigateReportUser = (reportedUser) => {
    const encodedUser = btoa(reportedUser);
    Navigate(`/ReportUser/${encodedUser}`);
  };
  const navigateReportPost = (threadId) => {
    const encodedThread = btoa(threadId);
    Navigate(`/ReportThread/${encodedThread}`);
  };
  return (
    <div>
      <ToastContainer />
      <div className="welcometorevnitro">
        <h1>Welcome to Revnitro Forum</h1>
      </div>
      <div className="indexpagemediaqueryflex">
        <div className="mediaqueryindex">
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
          <div>
            <div className="formsandfilters">
              <div className="inputformpage">
                <form action="" className="formflexx">
                  <input
                    type="text"
                    placeholder="Search Threads"
                    value={searchTerm}
                    onChange={(e) => {
                      handleSearch(e);
                    }}
                  />
                  <button className="searchbuttons">
                    <img src="./images/Vector50.webp" alt="" />
                  </button>
                </form>
              </div>
              <div className="createpostdivwithnavigationflex">
                <div className="mobileelastestbuttonflexoption">
                  <div className="indexpagemobilehide">
                    <div
                      id="nav-container"
                      className={isActive ? "is-active" : ""}
                    >
                      <div
                        id="nav-toggle"
                        onClick={(e) => {
                          e.preventDefault();
                          setScrollId(null);
                          toggleNav();
                        }}
                      ></div>
                      <nav className="nav-items">
                        <div className="leftnavbarboxmobile">
                          {userId ? (
                            <div className="notificationinmobileversionzx">
                              <div
                                className="belliiconofmobile"
                                onClick={(e) => {
                                  e.preventDefault();
                                  NavigateToNotification();
                                }}
                              >
                                <img
                                  src="./images/notificationimagesforum.png"
                                  alt=""
                                />
                              </div>
                              {unreadUserNotifications > 0 && (
                                <div className="notificationnumberofmessage">
                                  {unreadUserNotifications}
                                </div>
                              )}
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
                                    userProfilePic ||
                                    "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                                  }
                                  alt="imagetext"
                                />
                              </div>
                              {userId && (
                                <div
                                  className="editiconinmobileversionbox"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleProfileUpdate();
                                  }}
                                >
                                  <img
                                    src="./images/profileUpdate.png"
                                    alt=""
                                  />
                                </div>
                              )}
                            </div>
                            <div className="usernamenavbar">
                              <h3 className="mobilevrersionnamesize">
                                {userName}
                              </h3>
                              {userId && (
                                <div className="idnamenamemobile">
                                  @{userIdentity}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="navigationbuttontopmobile">
                            <div
                              className="navigatelinksmobile"
                              onClick={(e) => {
                                e.preventDefault();
                                resetThreads();
                                toggleNav();
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
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCreatePost();
                                  }}
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
                                <div
                                  className="navigatelinksmobile"
                                  onClick={() => {
                                    fetchUserThreads();
                                    toggleNav();
                                  }}
                                >
                                  <div>
                                    <img
                                      src="./images/iconamoon_news-fill.webp"
                                      alt="hometext"
                                    />
                                  </div>
                                  <div className="navigatenamesmobile">
                                    My Post
                                  </div>
                                </div>
                              </div>
                            )}
                            <div
                              className="navigatelinksmobile"
                              onClick={(e) => {
                                e.preventDefault();
                                handleForumPage();
                              }}
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
                              onClick={(e) => {
                                e.preventDefault();
                                handleRevnitro();
                                toggleNav();
                              }}
                            >
                              <div>
                                <img
                                  src="./images/Frame9.webp"
                                  alt="hometext"
                                />
                              </div>
                              <div className="navigatenamesmobile">
                                Revnitro Team
                              </div>
                            </div>
                            <div
                              className="navigatelinksmobile"
                              onClick={() => {
                                Navigate(`/?creator=true`);
                                toggleNav();
                              }}
                            >
                              <div>
                                <img
                                  src="/images/CreatorsIcon.png"
                                  alt="hometext"
                                />
                              </div>
                              <div className="navigatenamesmobile">
                                Creators
                              </div>
                            </div>

                            {!userId ? (
                              <div
                                className="navigatelinksmobile"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLogin();
                                }}
                              >
                                <div>
                                  <img
                                    src="./images/ooui_log-in-ltr.webp"
                                    alt="hometext"
                                  />
                                </div>
                                <div className="navigatenamesmobile">
                                  Log in
                                </div>
                              </div>
                            ) : (
                              <div className="navigatelinksmobile">
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
                                      document.body.classList.add(
                                        "active-modal"
                                      );
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
                        {modal && (
                          <div className="modal">
                            <div
                              onClick={toggleModal}
                              className="overlay"
                            ></div>
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
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="favcity">
                      <select
                        id="favcity"
                        name="select"
                        value={selectedHeading}
                        onChange={(e) => {
                          e.preventDefault();
                          Navigate("/");
                          handleHeadingChange(e);
                        }}
                      >
                        <option value="All">All</option>
                        {headings &&
                          headings.map((heading) => (
                            <option
                              key={heading._id}
                              value={heading.headingName}
                            >
                              {heading.headingName}
                            </option>
                          ))}
                        <option value="RevNitro">RevNitro</option>
                      </select>
                    </label>
                  </div>
                  <div className="sortbuttondesktophide">
                    <div className="sec-center">
                      <input
                        className="dropdown"
                        type="checkbox"
                        id="dropdown"
                        name="dropdown"
                      />
                      <label className="for-dropdown" htmlFor="dropdown">
                        Sort
                      </label>
                      <div className="section-dropdown">
                        <a href="iii">Dropdown Link</a>
                        <input
                          className="dropdown-sub"
                          type="checkbox"
                          id="dropdown-sub"
                          name="dropdown-sub"
                        />
                      </div>
                      <div className="section-dropdown">
                        <a
                          href="iii"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("newest");
                            if (sortOption === "newest" ? "active" : "") {
                            }
                          }}
                        >
                          Latest
                        </a>
                        <a
                          href="iii"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("oldest");
                            if (sortOption === "oldest" ? "active" : "") {
                            }
                          }}
                        >
                          Older
                        </a>
                        <a
                          href="iii"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("mostViews");
                            if (sortOption === "mostViewed" ? "active" : "") {
                            }
                          }}
                        >
                          Most Viewed
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="latestfilterbutton"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSortChange("newest");
                    if (sortOption === "newest" ? "active" : "") {
                    }
                  }}
                >
                  Latest
                </button>
              </div>
              <div>
                <button
                  className="latestfilterbutton"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSortChange("oldest");

                    if (sortOption === "oldest" ? "active" : "") {
                    }
                  }}
                >
                  Older
                </button>
              </div>
              <div>
                <button
                  className="latestfilterbutton1"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSortChange("mostViews");
                    if (sortOption === "mostViewed" ? "active" : "") {
                    }
                  }}
                >
                  Most Viewed
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="postmapfunctionarea">
              <div className="leftnavbarbox">
                {userId ? (
                  <div
                    className="notificationareapostion"
                    onClick={(e) => {
                      e.preventDefault();
                      NavigateToNotification();
                    }}
                  >
                    <div>
                      <img src="./images/notificationimagesforum.png" alt="" />
                    </div>
                    {unreadUserNotifications > 0 && (
                      <div className="notificationnumberofmessage">
                        {unreadUserNotifications}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="imageflexleftnavbarmobile"
                    style={{ paddingTop: "30px" }}
                  />
                )}
                <div className="imageflexleftnavbar">
                  <div className="profilephotosssupate">
                    <img
                      src={
                        userProfilePic ||
                        "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                      }
                      alt="imagetext"
                    />
                  </div>
                  {userId && (
                    <div
                      className="editimageprofilepicsabsolute"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProfileUpdate();
                      }}
                    >
                      <img src="./images/profileUpdate.png" alt="" />
                    </div>
                  )}
                  <div className="usernamenavbar">
                    <h3>{userName}</h3>
                    {userId && (
                      <div className="idnamename">@{userIdentity}</div>
                    )}
                  </div>
                </div>
                <div className="navigationbuttontop">
                  <div
                    className="navigatelinks"
                    onClick={(e) => {
                      e.preventDefault();
                      resetThreads();
                    }}
                  >
                    <div>
                      <img src="./images/mdi_home.webp" alt="hometext" />
                    </div>
                    <div className="navigatenames">Home</div>
                  </div>
                  {userId && (
                    <div>
                      <div
                        className="navigatelinks"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCreatePost();
                        }}
                      >
                        <div>
                          <img
                            src="./images/gridicons_create.webp"
                            alt="hometext"
                          />
                        </div>
                        <div className="navigatenames">Create Post</div>
                      </div>
                      <div
                        className="navigatelinks"
                        onClick={(e) => {
                          e.preventDefault();
                          fetchUserThreads();
                          toggleNav();
                        }}
                      >
                        <div>
                          <img
                            src="./images/iconamoon_news-fill.webp"
                            alt="hometext"
                          />
                        </div>
                        <div className="navigatenames">My Post</div>
                      </div>
                    </div>
                  )}
                  <div
                    className="navigatelinks"
                    onClick={(e) => {
                      e.preventDefault();
                      handleForumPage();
                    }}
                  >
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
                    onClick={(e) => {
                      e.preventDefault();
                      handleRevnitro();
                    }}
                  >
                    <div>
                      <img src="./images/Frame9.webp" alt="hometext" />
                    </div>
                    <div className="navigatenames">Revnitro Team</div>
                  </div>

                  <div
                    className="navigatelinks"
                    onClick={() => {
                      Navigate(`/?creator=true`);
                      toggleNav();
                    }}
                  >
                    <div>
                      <img src="/images/CreatorsIcon.png" alt="hometext" />
                    </div>
                    <div className="navigatenames">Creators</div>
                  </div>

                  {!userId ? (
                    <div
                      className="navigatelinks"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogin();
                      }}
                    >
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
                      onClick={(e) => {
                        e.preventDefault();
                        setModal(!modal);
                        if (modal) {
                          document.body.classList.add("active-modal");
                        } else {
                          document.body.classList.remove("active-modal");
                        }
                      }}
                    >
                      <div>
                        <img
                          src="./images/ooui_log-in-ltr.webp"
                          alt="hometext"
                        />
                      </div>
                      <div className="navigatenames">Log Out</div>
                    </div>
                  )}
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="rightpostbox">
                <div className="newScrollVisibleee">
                  {threads.map((thread, index) => (
                    <div key={thread._id} className="thread">
                      <div className="mainPosterssdivvs">
                        {" "}
                        <div className="posterss">
                          <div className="personposted">
                            <div className="uploadname">
                              <div className="Uplaodnamelenhdtgjhfhjbfdn">
                                <img
                                  src={thread.authorProfilePic}
                                  alt="authorProfilePic"
                                />
                              </div>
                              <div>
                                <div className="uploadpersonname">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>{thread.author}</div>
                                    <div className="mainiofsdbfhufdibdshgdff">
                                      {(thread.authorIsAdmin ||
                                        thread.authorIsVerified) && (
                                        <img
                                          src="./images/RevnitroTick.png"
                                          className="NameoftheTickeruserssasd"
                                          alt="Revnitro Tick"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="uernamepost">
                                  @{thread.authorIdentity} |&nbsp;
                                  <span
                                    style={{
                                      color: "#FF0000",
                                      fontWeight: "600px",
                                    }}
                                    onClick={() =>
                                      navigateReportUser(thread.authorIdentity)
                                    }
                                  >
                                    Report
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="postedtime">
                              👁️‍🗨️ {formatNumber(thread.views)}{" "}
                              <strong> | </strong>
                              {moment(thread.createdAt).fromNow()}
                            </div>
                          </div>
                          <div>
                            <div
                              className="postpagaediv"
                              onClick={(e) => {
                                e.preventDefault();
                                NavigateToPost(thread._id);
                              }}
                            >
                              <p>{thread.title}</p>
                            </div>
                            <div
                              className="postimage"
                              onClick={(e) => {
                                e.preventDefault();
                                NavigateToPost(thread._id);
                              }}
                            >
                              {thread.thumbnail && (
                                <img src={thread.thumbnail} alt="" />
                              )}
                            </div>
                            <div className="postcontent">
                              {thread.highlightedContent}{" "}
                              {thread && thread.content && (
                                <span>show more</span>
                              )}
                            </div>

                            <div
                              className="Rewpoiee89349"
                              onClick={() => {
                                Navigate(`/home/${thread.heading}`);
                              }}
                            >
                              <div
                                style={{ cursor: "pointer" }}
                                className="hastagtext"
                              >
                                #{thread.heading} Forum
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                className="Reportdivimageidsji3"
                              >
                                <div className="imdgwg34344234">
                                  <img
                                    src="/images/ri_share-line.png"
                                    alt="share"
                                  />
                                </div>
                                <div
                                  className="r5r3f63fg3"
                                  onClick={() => navigateReportPost(thread._id)}
                                >
                                  Report
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="reactionbutNeww">
                            <div
                              className="likeflex"
                              onClick={(e) => {
                                e.preventDefault();
                                handleLike(thread._id);
                              }}
                            >
                              <div>
                                <i
                                  className="fa fa-heart"
                                  style={{
                                    cursor: "pointer",
                                    color: thread.likedBy.includes(userId)
                                      ? "#F44336"
                                      : "#cdcdcd",
                                  }}
                                ></i>
                              </div>

                              <div
                                className="sharefonts"
                                style={{ cursor: "pointer" }}
                              >
                                {thread.likes}
                              </div>
                              <div className="sharefonts">Likes</div>
                            </div>

                            <div
                              className="commentsflex"
                              value="Show/Hide"
                              onClick={(e) => {
                                e.preventDefault();
                                showHideDiv(thread._id);
                                closeShareModal();
                                scrollToElement(`scroll-${thread._id}`);
                              }}
                            >
                              <div>
                                <img
                                  src="./images/icon-park-outline_comments.webp"
                                  alt=""
                                />
                              </div>
                              <div className="sharefonts">
                                {thread.comments.length}
                              </div>

                              <div
                                className="sharefonts"
                                style={{ cursor: "pointer" }}
                              >
                                Comments
                              </div>
                            </div>
                            <div
                              className="shareflex"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShare(thread);
                                showHideDiv(thread._id);
                              }}
                            >
                              <div>
                                <img src="./images/ri_share-line.webp" alt="" />
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                className="sharefonts"
                              >
                                Share
                              </div>
                            </div>
                          </div>

                          <div className="linebottom"></div>

                          <div className="cinputflex">
                            <div className="lastcommentpicc">
                              <img src={userProfilePic} alt="" />
                            </div>
                            <div>
                              <form
                                action=""
                                className="commentbox"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleComment(thread._id);
                                }}
                              >
                                <div>
                                  <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={newComments[thread._id]?.text || ""}
                                    onChange={(e) => {
                                      setNewComments((prevComments) => ({
                                        ...prevComments,
                                        [thread._id]: { text: e.target.value },
                                      }));
                                      handleCommentInput(e, thread);
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleComment(thread._id);
                                  }}
                                >
                                  <img
                                    className="commentsendbutton"
                                    src="./images/iconamoon_send-bold.png"
                                    alt=""
                                  />
                                </button>
                              </form>
                            </div>
                          </div>
                          {thread._id === currentThreadId &&
                            commenterNames.length > 0 && (
                              <div
                                className="MentioningCommentsdiv"
                                id={thread._id}
                              >
                                {commenterNames.map((commenter) => (
                                  <div
                                    className="mentioncommentsflexdicvs"
                                    key={commenter.userIdentity} // Assuming userIdentity is unique
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleNameSelection(
                                        commenter.userIdentity
                                      );
                                    }}
                                  >
                                    <img
                                      className="imageofthyementionedpersion"
                                      src={commenter.userPic}
                                      alt=""
                                      style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                      }}
                                    />
                                    <span className="mentionedcommentionpersonname">
                                      {commenter.userIdentity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                        {selectedThread &&
                          selectedThread._id === thread._id && (
                            <div className="commentshowsection">
                              <div className="maincommentformainsharedivs">
                                <div
                                  className={`share-modal ${
                                    shareModalVisible ? "visible" : ""
                                  }`}
                                >
                                  <div className="shareoptionsflexdicvv">
                                    <div>
                                      <h3 className="Hareiohu324783247874y3">
                                        Share '{selectedThread.title}'
                                      </h3>
                                    </div>
                                    <div onClick={closeShareModal}>
                                      <img
                                        src="./images/shareCloseButtonImage.png"
                                        alt=""
                                        style={{
                                          backgroundColor: "white",
                                          width: "29px",
                                          height: "29px",
                                          objectFit: "cover",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <FacebookShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${
                                        window.location.origin
                                      }/${encodeURIComponent(thread._id)}`
                                    }
                                  >
                                    <FacebookIcon size={32} round />
                                  </FacebookShareButton>
                                  <TwitterShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <XIcon size={32} round />
                                  </TwitterShareButton>

                                  <WhatsappShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <WhatsappIcon size={32} round />
                                  </WhatsappShareButton>

                                  <RedditShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <RedditIcon size={32} round />
                                  </RedditShareButton>

                                  <TelegramShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <TelegramIcon size={32} round />
                                  </TelegramShareButton>

                                  <EmailShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    subject={
                                      "Checkout This Thread : " + thread.title
                                    }
                                    body={`Check out this thread:\n${thread._id}`}
                                  >
                                    <img
                                      src="./images/MailShareIcons.png"
                                      style={{ width: "32px" }}
                                      alt="Mail"
                                    />
                                  </EmailShareButton>
                                  <span onClick={() => shareOther(thread)}>
                                    <img
                                      src="./images/shareForMOBILESfILES.png"
                                      alt="others"
                                      style={{
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        width: "32px",
                                        height: "32px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        {thread.comments.length > 0 ? (
                          <div
                            className="commentshowsection"
                            id={thread._id}
                            style={{ display: "none" }}
                          >
                            {scrollId === thread._id && (
                              <script key={thread._id}>
                                {document
                                  .getElementById(`scroll-${thread._id}`)
                                  .scrollIntoView({
                                    behavior: "smooth",
                                  })}
                              </script>
                            )}
                            <div id={`scroll-${thread._id}`}>
                              <div className="noofcomments">
                                {thread.comments.length} Comments
                              </div>
                              {thread.comments.slice(0, 3).map((comment) => (
                                <div key={comment._id}>
                                  <div
                                    className="commentingarea"
                                    key={comment._id}
                                  >
                                    <div className="maincomment">
                                      <div>
                                        <div className="imageuserforum">
                                          <div>
                                            <img
                                              src={comment.commenterProfilePic}
                                              alt=""
                                            />
                                          </div>
                                          <div>
                                            <div className="forumcommentuser">
                                              {comment.commenterName}
                                            </div>
                                            <div className="forumusernameres">
                                              @{comment.commenterIdentity}
                                              {(comment.commenterIsAdmin ||
                                                comment.commenterIsVerified) && (
                                                <>
                                                  <img
                                                    className="comment34344434"
                                                    src="./images/CommentTick.png"
                                                  />
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="commentingtime">
                                        {moment(comment.createdAt).fromNow()}
                                      </div>
                                    </div>
                                    <div className="usercomment">
                                      {comment.text}
                                    </div>
                                    {(userIdentity ===
                                      comment.commenterIdentity ||
                                      isAdmin) && (
                                      <div>
                                        <div className="DeleteCommentImage">
                                          <img
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setModal2(!modal2);
                                              if (modal2) {
                                                document.body.classList.add(
                                                  "active-modal"
                                                );
                                              } else {
                                                document.body.classList.remove(
                                                  "active-modal"
                                                );
                                              }
                                            }}
                                            src="./images/commentDeleteImage.png"
                                            alt="Delete Comment"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    {modal2 && (
                                      <div className="modal">
                                        <div
                                          onClick={toggleModal2}
                                          className="overlay"
                                        ></div>
                                        <div className="modal-content">
                                          <h2>
                                            Are you sure want to Delete Comment
                                            ?
                                          </h2>
                                          <p className="PtAGFLEXFORTHEFOREJHIODHJID">
                                            <button
                                              className="lOGOUTbUTTONmOBILEVFRUHIDNFGIJG"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteComment(
                                                  thread._id,
                                                  comment._id
                                                );
                                                setModal2(!modal2);
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
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}

                              <div
                                className="commentsshowmoree"
                                onClick={(e) => {
                                  e.preventDefault();
                                  NavigateToPost(thread._id);
                                }}
                              >
                                <button>Show more</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="commentshowsection"
                            id={thread._id}
                            style={{
                              display: "none",
                              textAlign: "center",
                              paddingTop: "20px",
                              fontSize: "15px",
                            }}
                          >
                            No Comments
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`notification-container ${notification ? "show" : ""}`}>
        {notification}
      </div>
    </div>
  );
}
export default Home;
