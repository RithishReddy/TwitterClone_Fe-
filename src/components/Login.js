import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import { useDetails } from "../store/user";
import { GoogleOutlined } from "@ant-design/icons";
import { validateUser } from "../apis/validationApi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
export default function Login() {
  const [userData, setuserData] = useDetails();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isSuccess } = useQuery(
    ["validateUser", userData?.email],
    validateUser,
    { enabled: false }
  );

  console.log("heyaa", data);

  useEffect(() => {
    if (userData.email) {
      console.log(userData);
      refetch();
      console.log("end 1");
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    console.log("test1", data);

    console.log("hey", data?.data.isPresent);
    if (!isLoading && data?.data) {
      if (data?.data.isPresent) {
        localStorage.getItem("last_url")?navigate(localStorage.getItem("last_url"))
        :
        navigate("/Home");
      } else {
        if (userData.email) {
          navigate("/signup");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, refetch]);

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const tokenResult = await auth.currentUser?.getIdTokenResult(false);
        if (tokenResult) {
          localStorage.setItem("google-auth-token", tokenResult.token);
        }

        console.log(tokenResult);

        // const user = result.user;
        // console.log("hii", user.email);
        // setuserData({ displayName: user.displayName, email: user.email });
        // ...
        // console.log("hello", userData.email);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  return (
    <div className="login">
      <div>
        <h1>Login to Continue</h1>
      </div>
      <button onClick={googleLogin}>
        {" "}
        <GoogleOutlined /> Click Here
      </button>
    </div>
  );
}
