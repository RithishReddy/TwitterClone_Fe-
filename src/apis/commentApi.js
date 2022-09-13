import axios from "axios";

export const getComments = async ({queryKey}) => {
  const result = await axios.get(
    `http://localhost:3001/api/v1/comment?${queryKey[1]}`,
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


export const getCommentsCount = async ({queryKey}) => {
    const result = await axios.get(
      `http://localhost:3001/api/v1/comment/count?${queryKey[1]}`,
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