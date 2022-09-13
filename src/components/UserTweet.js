import { Avatar, Button, Comment, Form, Input, List } from "antd";
import moment from "moment";
import React, { useState } from "react";
import axios from "axios";
import "./UserTweet.css";
import { useDetails } from "../store/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments } from "../apis/commentApi";
import { useParams } from "react-router";
import { getTweetById, getTweets } from "../apis/tweetApi";
import { Post } from "./Post";
const { TextArea } = Input;
export const UserTweet = () => {
  const { user_email, tweet_id } = useParams();
  const [userData, setuserData] = useDetails();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
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
  const userComments = new URLSearchParams({ id: tweet_id }).toString();
  const userTweet = new URLSearchParams({ tweet_id: tweet_id }).toString();
  const [value, setValue] = useState([]);
  // const [submitting, setSubmitting] = useState(false);
  // const [value, setValue] = useState("");

  const {
    data: tweets,
    isError: tweetsIsError,
    error: tweetsError,
    isLoading: tweetsLoading,
  } = useQuery(["tweets", userTweet], getTweetById);

  const {
    data: comments,
    isError: commentsisError,
    error: commentserror,
    isLoading: commentsisLoading,
  } = useQuery(["user-liked", userComments], getComments);

  const mutation = useMutation((data) => {
    return axios.post(`http://localhost:3001/api/v1/comment`, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("google-auth-token"),
      },
    });
  });

  if (commentsisLoading || tweetsLoading) {
    return <h2>Loading...</h2>;
  }
  if (commentsisError) {
    return <h2>Error:{commentserror}</h2>;
  }

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = () => {
    if (value) {
      mutation.mutate(
        { tweet_id: tweet_id, comment: value },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries();
            setValue("");
          },
        }
      );
    }
  };

  console.log("getTweets", tweets?.data);

  console.log(comments?.data[0]?.comment);

  console.log("comments", comments?.data);
  return (
    <>
      <div className="main-section">
        <div className="post-data">
          <Post details={tweets?.data} />
        </div>
        <div className="post-comment">
          <div className="user-image">
            <img src={userData.image} alt="user" />
          </div>
          <div className="comment-input">
            <Form.Item className="comment-text">
              <TextArea rows={2} onChange={onChange} value={value} />
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Button htmlType="submit" onClick={onSubmit} type="primary">
            Add Comment
          </Button>
        </Form.Item>

        <div className="comment-section">
          {comments?.data.map((data) => {
            return (
              <div className="comment">
                <Comment
                  // actions={item.actions}
                  author={data.user.name + "   @" + data.user.user_name}
                  avatar={data.user.image}
                  content={data.comment}
                  datetime={
                    " ~ " +
                    months[data.updatedAt.slice(6, 7) - 1] +
                    " " +
                    data.updatedAt.slice(8, 10)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
