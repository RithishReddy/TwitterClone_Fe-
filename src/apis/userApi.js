import axios from "axios";

export const getUserDetails = async ({queryKey}) => {
  const result = await axios.get(
    `http://localhost:3001/api/v1/users?${queryKey[1]}`,
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
