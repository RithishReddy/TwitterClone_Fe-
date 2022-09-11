import axios from "axios";

export const getTweets = async ({queryKey}) => {
  const result = await axios.get(
    
    `http://localhost:3001/api/v1/tweets?${queryKey[1]}`,
    {
      headers: {
        Authorization: localStorage.getItem("google-auth-token")
          ? "Bearer " + localStorage.getItem("google-auth-token")
          : "",
      },
    }
  );
  return result
};


// `http://localhost:3001/api/v1/tweets?user_id=${123}`
// "http://localhost:3001/api/v1/tweets?show=all",