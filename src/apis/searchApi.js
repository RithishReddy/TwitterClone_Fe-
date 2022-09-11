import axios from "axios";

export const search = async ({queryKey}) => {
  const result = await axios.get(
    `http://localhost:3001/api/v1/search?${queryKey[1]}`,
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
