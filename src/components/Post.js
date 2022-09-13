import React, { useState, useEffect } from "react";
import { useDetails } from "../store/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTweets } from "../apis/tweetApi";
import axios from "axios";
import {
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";

import "./Post.css";
import { getLikes, checkUserLiked } from "../apis/likeApi";
import { Link } from "react-router-dom";
import { getCommentsCount } from "../apis/commentApi";

export const Post = ({ details }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const queryClient = useQueryClient();
  const show = new URLSearchParams({ id: details.id }).toString();
  const userLiked = new URLSearchParams({ tweet_id: details.id }).toString();
  const commentParam = new URLSearchParams({ tweet_id: details.id }).toString();
  console.log(commentParam);

  const { data, isError, error, isLoading, isFetched } = useQuery(
    ["likes", show],
    getLikes
  );

  const {
    data: checkLiked,
    isError: checkLikedisError,
    error: checkLikederror,
    isLoading: checkLikedisLoading,
  } = useQuery(["user-liked", userLiked], checkUserLiked);

  const {
    data: commentsCount,
    isError: commentsCountisError,
    error: commentsCounterror,
    isLoading: commentsCountisLoading,
  } = useQuery(["user-comments", commentParam], getCommentsCount);

  const likeMutation = useMutation((data) => {
    return axios.post("http://localhost:3001/api/v1/like", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("google-auth-token"),
      },
    });
  });

  const dislikeMutation = useMutation((data) => {
    return axios.delete("http://localhost:3001/api/v1/like", {
      data: data,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("google-auth-token"),
      },
    });
  });

  if (isLoading || checkLikedisLoading) {
    return <h2>Loading...</h2>;
  }
  if (isError || checkLikedisError) {
    return <h2>Error:{error}</h2>;
  }

  const handleUnLike = () => {
    dislikeMutation.mutate(
      { tweet_id: details.id },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries();
        },
      }
    );
  };

  const handleLike = () => {
    likeMutation.mutate(
      { tweet_id: details.id },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries();
        },
      }
    );
  };

  return (
    <>
      <div className="tweet-component">
        <div className="post">
          <div className="post-image">
            <img src={details.user.image} alt="profile-pic" />
          </div>
          <div className="post-body">
            <Link
              key={details.id}
              to={`../${details.user.email}/status/${details.id}`}
            >
              <div className="post-header">
                <div className="post-headerText">
                  <h3 className="post-header-data">
                    <span className="post-header-name">
                      {details.user.name}
                    </span>{" "}
                    <span className="post-headerSpecial">
                      @{details.user.user_name}
                    </span>
                    <span className="date">
                      {" ~ "}
                      {
                        months[details.updatedAt.slice(6, 7) - 1] +
                          " " +
                          details.updatedAt.slice(8, 10)

                        // details.updatedAt.slice(11, 16)
                      }
                    </span>
                  </h3>
                </div>
                <div className="post-headerDescription">
                  <p>{details.message}</p>
                </div>
              </div>
            </Link>
            <div className="post-footer">
              {checkLiked.data ? (
                <HeartTwoTone
                  className="like-component"
                  onClick={handleUnLike}
                />
              ) : (
                <HeartOutlined
                  className="like-component"
                  onClick={handleLike}
                />
              )}
              <span className="count-likes"> {data.data.count}</span>
              <Link
                key={details.id}
                to={`../${details.user.email}/status/${details.id}`}
              >
                <MessageOutlined className="comment-component" />
                <span className="count-likes">
                  {" "}
                  {commentsCount?.data?.count}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
