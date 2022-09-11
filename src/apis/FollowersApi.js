import axios from "axios";


export const checkUserFollowed = async ({queryKey}) => {
    console.log("data",localStorage.getItem)
    const result = await axios.get(
      `http://localhost:3001/api/v1/followers/check?${queryKey[1]}`,
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
  