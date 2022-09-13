import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { search } from "../apis/searchApi";
import { Profile } from "./Profile";
import "./Search.css";
export function Search() {
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setResult(event.target.value);
  };

  const showResult = new URLSearchParams({ name: result }).toString();

  // const handleProfile=()=>{
  //   return <Profile user_email={da}
  // }

  const { data, isError, error, isLoading } = useQuery(
    ["liked-tweets", showResult],
    search
  );
  console.log(result, result.length);


  const profile = data?.data?.profile;
  const tweets = data?.data?.tweets;
  console.log("hey", tweets);

  return (
    <>
      <div className="space"></div>
      <Input
        className="search-bar"
        onChange={handleChange}
        style={{ borderRadius: "50px", width: "60%" }}
        size="large"
        placeholder="Search Twitter"
        prefix={<SearchOutlined style={{ margin: "5px 10px " }} />}
      />
      {result.length > 0 && (
        <div className="search-results">
          {/* <div>
          {!isLoading &&
            profile.map((data) => {
              return (
                <div key={data.user_name} className="search-block" onClick={()=>{ <Link className='data' to={'/home'}> </Link>}}>
                  <img src={data.image} alt="profile" onClick={()=>{ <Link className='data' to={'/profile'}> <Profile user_email={data.email} /></Link>}} />
                  <span > {data.user_name} </span>
                </div>
              );
            })}
        </div> */}
          <div>
            {!isLoading &&
              profile.map((data) => {
                return (
                  <Link key={data.user_name} to={`../profile/${data.email}`}>
                    <div className="search-block">
                      <img src={data.image} alt="profile" />
                      <span> {data.user_name} </span>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div>
            {!isLoading &&
              tweets.map((data) => {
                return (
                  <Link key={data.id} to={`../${data.user.email}/status/${data.id}`}>
                  <div key={data.id} className="search-block">
                    <img
                      className="search-icon"
                      src="https://icons-for-free.com/iconfiles/png/512/glass+in+look+magnifying+search+zoom+icon-1320196034863750457.png"
                      alt="search-icon"
                    />
                    <b>#</b>
                    {data.message}{" "}
                  </div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
