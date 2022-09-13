import "./App.css";
import React, { useState, useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { auth } from "./Firebase/firebase";
import { Home } from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Search from "./components/Search";
import { Navbar } from "./components/Navbar";
import { useDetails } from "./store/user";
import Login from "./components/Login";
import axios from "axios";
const queryClient = new QueryClient();

axios.interceptors.request.use(async (config) => {
  try {
    const tokenResult = await auth.currentUser?.getIdTokenResult(false);
    if (tokenResult) {
      config.headers["Authorization"] = `Bearer ${tokenResult.token}`;
    }
    return config;
  } catch (err) {
    console.log(err);
  }
});

function App() {
  const [userData, setuserData] = useDetails();
  window.onbeforeunload = () =>
    localStorage.setItem("last_url", window.location.pathname);
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(user);
        console.log("inside app use effect");
        localStorage.setItem("google-auth-token", user.accessToken);
        setuserData({
          displayName: user.displayName,
          email: user.email,
          image: user.photoURL,
        });
      }
    });
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Navbar />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
