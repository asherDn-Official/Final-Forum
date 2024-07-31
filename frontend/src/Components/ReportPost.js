import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ReportPagecss.css";
import API_URL from "./global";

export default function ReportPage() {
  const [reason, setReason] = useState("");
  const { id: encodedUserId } = useParams(); // Adjusted to get the 'id' parameter from the URL
  const navigate = useNavigate();
  const [userIdentity, setUserIdentity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }
    const decoded = atob(encodedUserId);
    const data = {
      userIdentity,
      reportedUser: decoded,
      reason,
    };
    console.log("data", data);
    try {
      const response = await axios.post(
        `${API_URL}/threads/report/thread`,
        data
      );
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
    }
  };

  const getName = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user`, {
        crossDomain: true,
        withCredentials: true,
      });
      if (response.data) {
        const value = response.data;
        setUserIdentity(value.userIdentity);
      }
    } catch (error) {
      console.error(error);
    }
  }; // Empty array as dependency since we only want this to run once on mount

  useEffect(() => {
    getName();
  }, []);

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
          <hr className="hrline23232"></hr>
          <div className="idenetify3434">
            Identify the nature of your report by selecting the appropriate
            category
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="I just don’t like this post"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">I just don’t like this post</div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="It’s spam"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">It’s spam</div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="Nudity or sexual activity"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">Nudity or sexual activity</div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="False information"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">False information</div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="Bullying or harassment"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">Bullying or harassment</div>
              </div>
              <div className="msnj2323233">
                <div>
                  <input
                    type="radio"
                    value="Violence or dangerous"
                    name="reportReason"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="kjduu34uj3434">Violence or dangerous</div>
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
