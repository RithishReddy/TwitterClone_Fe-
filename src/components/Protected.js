import React from "react";
import { useDetails } from "../store/user";
import { validateUser } from "../apis/validationApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const Protected = ({ children }) => {
  const [userData, setuserData] = useDetails();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isSuccess } = useQuery(
    ["validateUser", userData?.email],
    validateUser
  );
  if(isLoading){
    return <h1>Loading...</h1>
  }
  if(!userData.email){
     return navigate("/")
  }
 
  if(data?.data.isPresent){
    return children
  }
  else{
    return navigate("/signup")
  }

};
