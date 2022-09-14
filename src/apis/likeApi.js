import axios from "axios";

export const getLikes = async ({queryKey}) => {
  const result = await axios.get(
    `http://localhost:3001/api/v1/like?${queryKey[1]}`,
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

export const checkUserLiked = async ({queryKey}) => {
  const result = await axios.get(
    `http://localhost:3001/api/v1/like/check?${queryKey[1]}`,
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


