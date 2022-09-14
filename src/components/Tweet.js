import { Button, Modal } from "antd";
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tweet.css";
import { Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
const { TextArea } = Input;

export const Tweet = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [tweet, setTweet] = useState("");

  const mutation = useMutation((data) => {
    return axios.post(`http://localhost:3001/api/v1/tweets`, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("google-auth-token"),
      },
    });
  });

  useEffect(() => {
  
    if (mutation.isSuccess) {
      navigate("/Home");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isSuccess])
  
  if (mutation.isError) {
    return <h2>Error:{mutation.error.message}</h2>;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (event) => {
    if (tweet) {
      mutation.mutate({ message: tweet },{onSuccess:()=>{
        setTweet("");
        setIsModalVisible(false);
      }});
    }
   
  };

  const handleTweet = (event) => {
    setTweet(event.target.value);
  };
  const handleCancel = (event) => {
    setTweet("");
    setIsModalVisible(false);
  };

  return (
    <>
      <div style={{marginTop:"100px"}} className="space"></div>
      <Button type="primary" className="tweet-button" onClick={showModal}>
        Create Tweet
      </Button>

      <Modal
        
        style={{margin:"auto"}}
        title="What's happening?"
        visible={isModalVisible}
        className="tweet-modal"
        okText="Tweet"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea value={tweet} onChange={handleTweet} rows={4} />
      </Modal>
    </>
  );
};
