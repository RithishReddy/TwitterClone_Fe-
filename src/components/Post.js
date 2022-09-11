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

export const Post = ({ details }) => {
  const queryClient = useQueryClient();
  const show = new URLSearchParams({ id: details.id }).toString();
  const userLiked = new URLSearchParams({ tweet_id: details.id }).toString();



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

  if (isLoading || checkLikedisLoading ) {
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
            <div className="post-header">
              <div className="post-headerText">
                <h3 className="post-header-data">
                  {details.user.name}{" "}
                  <span className="post-headerSpecial">
                    @{details.user.user_name}
                  </span>
                  <span className="date">
                    {" "}
                    {details.updatedAt.slice(0, 10) +
                      "  " +
                      details.updatedAt.slice(11, 16)}
                  </span>
                </h3>
              </div>
              <div className="post-headerDescription">
                <p>{details.message}</p>
              </div>
            </div>
            <div className="post-footer">
              {checkLiked.data
               ? (
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
              <MessageOutlined className="comment-component" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
