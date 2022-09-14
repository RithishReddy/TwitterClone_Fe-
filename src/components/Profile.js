import React, { useState } from "react";
import "./Profile.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Post } from "./Post";
import axios from "axios";
import { getTweets } from "../apis/tweetApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "antd";
import { getUserDetails } from "../apis/userApi";
import { useParams } from "react-router";
import { useDetails } from "../store/user";
import { checkUserFollowed } from "../apis/FollowersApi";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";

const { TabPane } = Tabs;

export const Profile = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user_email } = useParams();
  const [userData, setuserData] = useDetails();

  const showUser = new URLSearchParams({
    show: "user",
    email: user_email,
  }).toString();
  const userFollows = new URLSearchParams({ email: user_email }).toString();
  const showLikes = new URLSearchParams({
    show: "like",
    email: user_email,
  }).toString();
  const email = new URLSearchParams({
    email: user_email,
  }).toString();

  const {
    data: userTweets,
    isError: userTweetsIsError,
    error: userTweetsError,
    isLoading: userTweetsLoading,
  } = useQuery(["tweets", showUser], getTweets);

  const {
    data: userLikedTweets,
    isError: likedTweetsisError,
    error: likedTweetserror,
    isLoading: likedTweetsisLoading,
  } = useQuery(["liked-tweets", showLikes], getTweets);

  const {
    data: user_data,
    isError: userDataisError,
    error: userDataerror,
    isLoading: userDataisLoading,
  } = useQuery(["user-details", email], getUserDetails);

  const {
    data: checkFollowed,
    isError: checkFollowedisError,
    error: checkFollowederror,
    isLoading: checkFollowedisLoading,
  } = useQuery(["user-Followed", userFollows], checkUserFollowed);

  const followMutation = useMutation((data) => {
    return axios.post("http://localhost:3001/api/v1/followers", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("google-auth-token"),
      },
    });
  });

  const unFollowMutation = useMutation((data) => {
    return axios.delete("http://localhost:3001/api/v1/followers", {
      data: data,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("google-auth-token"),
      },
    });
  });

  if (
    userTweetsLoading ||
    userDataisLoading ||
    checkFollowedisLoading ||
    likedTweetsisLoading
  ) {
    return <h2>Loading...</h2>;
  }
  if (userTweetsIsError) {
    return <h2>Error:{userTweetsError}</h2>;
  }

  const handleFollow = () => {
    followMutation.mutate(
      { email: user_email },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries();
        },
      }
    );
  };

  const handleUnFollow = () => {
    unFollowMutation.mutate(
      { email: user_email },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries();
        },
      }
    );
  };

  const handleLogOut = () => {
    auth.signOut();
    window.location.reload(false);
  };

  const tweets = userTweets?.data;
  const likedTweets = userLikedTweets?.data;
  const user = user_data?.data;

  return (
    <>
      <div className="top-description">
        <div className="top-description-one">
          <ArrowLeftOutlined
            onClick={() => {
              navigate("/Home");
            }}
          />
        </div>
        <div className="top-description-two">
          <span>{user.name}</span>
          <div className="count-tweets">{user._count.tweets} Tweets</div>
        </div>
      </div>
      <div className="top">
        <div className="top-image"></div>
        <div className="second-image">
          <img className="profile-image" src={user.image} alt="User-details" />
        </div>
        <div className="profile-box">
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-id">@{user.user_name}</span>
            <div className="user-bio">{user.bio}</div>
            <div className="user-joined">
              <img
                style={{ width: "16px" }}
                src="https://cdn-icons-png.flaticon.com/512/42/42446.png"
                alt="calender"
              />
              <span className="user__joined--text">
                {" "}
                Joined{" "}
                {months[user.updatedAt.slice(6, 7) - 1] +
                  " " +
                  user.updatedAt.slice(0, 4)}
              </span>
            </div>

            <div className="user-follows">
              <span className="user-following">
                <b style={{ color: "black" }}>{user._count.following}</b>{" "}
                Following
              </span>
              <span className="user-followers">
                <b style={{ color: "black" }}>{user._count.followers}</b>{" "}
                Followers
              </span>
            </div>
          </div>
          <div className="profile-right">
            {user_email === userData.email ? (
              <div>
                <button className="logout-button" onClick={handleLogOut}>
                  Logout
                </button>
              </div>
            ) : !checkFollowed.data ? (
              <button
                className="profile-button follow-button"
                onClick={handleFollow}
              >
                Follow
              </button>
            ) : (
              <button
                className="profile-button unfollow-button"
                onClick={handleUnFollow}
              >
                <span>Following</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tabs-button">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Tweets" key="1">
            <div className="all-tweets user-tweets">
              {tweets.map((data) => {
                return (
                  <div className="post-tweet" key={data.id}>
                    <Post details={data} />
                  </div>
                );
              })}
            </div>
          </TabPane>
          <TabPane tab="Likes" key="2">
            <div className="all-tweets liked-tweets">
              {likedTweets &&
                likedTweets.map((data) => {
                  return (
                    <div className="post-tweet" key={data.id}>
                      <Post details={data} />
                    </div>
                  );
                })}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};
