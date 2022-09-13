import { useMutation, useQuery } from "@tanstack/react-query";
import { getComments } from "../apis/commentApi";
import { useParams } from "react-router";
import { getTweetById, getTweets } from "../apis/tweetApi";
import { Post } from "./Post";
import { Avatar, Button, Comment, Form, Input, List } from "antd";
import moment from "moment";
import React, { useState } from "react";
import axios from "axios";
const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    // header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="vertical"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

export const UserTweet = () => {
  const { user_email, tweet_id } = useParams();
  const userComments = new URLSearchParams({ id: 3 }).toString();
  const userTweet = new URLSearchParams({ tweet_id: tweet_id }).toString();
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  

  const {
    data: tweets,
    isError: tweetsIsError,
    error: tweetsError,
    isLoading: tweetsLoading,
  } = useQuery(["tweets", userTweet], getTweetById);

  const {
    data: commentData,
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
  const handleSubmit = () => {
    if (!value) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue("");
      setComments([
        ...comments,
        {
          author: "Han Solo",
          avatar: "https://joeschmoe.io/api/v1/random",
          content: <p>{value}</p>,
          datetime: moment("2016-11-22").fromNow(),
        },
      ]);
    }, 1000);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  console.log("getTweets", tweets?.data);

  console.log(commentData?.data[0]?.comment);

  console.log(commentData?.data);
  return (
    <>
      <Post details={tweets?.data} />
     
      <Comment
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
          
        }
      />
       {comments.length > 0 && <CommentList comments={comments} />}
      {/* <div className='comment-section'>
    {commentData?.data.map((data)=>{
      return (
      <div className='comment'>
        {data.comment}

      </div>
      )
    })}
  </div> */}
    </>
  );
};
