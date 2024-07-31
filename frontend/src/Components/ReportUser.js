import { useEffect, useState } from "react";
import "./ReportPagecss.css";
import axios from "axios";
import API_URL from "./global";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function ReportUser() {
  const [reason, setReason] = useState("");
  const { id: reportedUserId } = useParams(); // Get the 'id' parameter from the URL
  const navigate = useNavigate();
  const [userIdentity, setUserIdentity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }
    const decoded = atob(reportedUserId); // Decode the reported user ID
    const data = {
      userIdentity,
      reportedUser: decoded,
      reason,
    };
    console.log(data);
    try {
      const response = await axios.post(`${API_URL}/threads/report/user`, data);
      if (response.data) {
        alert(
          "The user has been successfully reported. We will get back to you with an update."
        );
        navigate("/");
      } else {
        alert("There is an internal error. Please try again later.");
      }
    } catch (error) {
      console.error("Error reporting user:", error);
      alert(
        "An error occurred while reporting the user. Please try again later."
      );
    }
  };

  const getName = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user`, {
        crossDomain: true,
        withCredentials: true,
      });
      if (response.data.userIdentity) {
        setUserIdentity(response.data.userIdentity);
        console.log("user", response.data.userIdentity);
      }
    } catch (error) {
      console.error("Error fetching user identity:", error);
    }
  };

  useEffect(() => {
    getName();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div style={{ background: "#afafaf", paddingBottom: "50px" }}>
      <div className="divfbb34344">
        <div className="maindi4i34iu4i">
          <div className="Closebuttondive33">
            <div></div>
            <div className="reportnamne344">Report</div>
            <Link
              style={{ margin: "0px", padding: "0px", background: "#fff" }}
              to="/"
            >
              <img src="/images/jam_close.png" alt="Close" />
            </Link>
          </div>
          <hr className="hrline23232" />
          <div className="idenetify3434" style={{ textAlign: "left" }}>
            What do you want to report about this user
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="I just don’t like this user"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">I just don’t like this user</div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="Something about this account"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">
                  Something about this account
                </div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="Posting fake information"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">Posting fake information</div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="Something else"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">Something else</div>
              </div>
              <div className="NSKJSJKDJ23424">
                <button className="nbshwdwenene" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
