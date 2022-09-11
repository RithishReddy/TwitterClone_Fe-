import React from "react";
import { Post } from "./Post";
import "./Home.css";
import { getTweets } from "../apis/tweetApi";
import { useQuery } from "@tanstack/react-query";
import { useDetails } from "../store/user";
import { Navigate } from "react-router";
import { NavLink } from "react-router-dom";

export const Home = () => {
  const [userData, setuserData] = useDetails();
  const  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  const show = new URLSearchParams({ show: "all" }).toString();

  const { data, isError, error, isLoading } = useQuery(
    ["tweets", show],
    getTweets
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  if (isError) {
    return <h2>Error:{error}</h2>;
  }
  const details = data?.data;
  console.log("heyaaa", details);

  return (
    <>
      <div className="space"></div>
      {details.length ? (
        <div className="all-tweets">
          {details.map((data) => {
            return (
              <div className="post-tweet" key={data.id}>
                <Post details={data} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-tweets">
          <div className="empty-tweets-one">
            Welcome <b>{userData.displayName}</b>
          </div>
          <div className="empty-tweets-two">Follow <NavLink to="/search"> users </NavLink> for Tweets</div>
        </div>
      )}
    </>
  );
};
