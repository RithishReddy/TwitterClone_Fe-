import { Avatar } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  UserOutlined,
  HeartOutlined,
  MessageTwoTone,
  HeartTwoTone,
} from "@ant-design/icons";
import React, { useState } from "react";
import "./Post.css";
import { getTweets } from "../apis/tweetApi";

export const Post = () => {
  const [searchParams] = useSearchParams();
  const show = searchParams.get("show");
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike((current) => !current);
  };

  const { data, isError, error, isLoading } = useQuery(
    ["tweets", show],
    getTweets
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error:{error.message}</h2>;
  }

  const details = data?.data;

  return (
    <>
      <div className="all-tweets">
        {details.map((data) => {
          return (
            <div key={data.id} className="post-tweet">
              <div className="section-top">
                <Avatar
                  style={{ width: "60px", height: "60px" }}
                  icon={
                    <UserOutlined
                      style={{
                        textAlign: "center",
                        fontSize: "30px",
                        marginTop: "10px",
                      }}
                    />
                  }
                />
                <div className="tweet-user">
                  {data.user.name} - {data.user.user_name}{" "}
                  <span>
                    {" "}
                    {data.updatedAt.slice(0, 10) +
                      "  " +
                      data.updatedAt.slice(11, 16)}
                  </span>
                </div>
              </div>
              <div className="section-content">
                <div className="message-content">{data.message}</div>
              </div>
              <div className="section-bottom">
                {like === true ? (
                  <HeartTwoTone
                    onClick={handleLike}
                    style={{ fontSize: "20px", margin: "20px" }}
                  />
                ) : (
                  <HeartOutlined
                    onClick={handleLike}
                    style={{ fontSize: "20px", margin: "20px" }}
                  />
                )}
                <MessageTwoTone style={{ fontSize: "20px" }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
