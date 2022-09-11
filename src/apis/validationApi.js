import axios from "axios";



export const validateUser = async () => {
  const result = await axios.get(
    `http://localhost:3001/api/v1/verify`,
    // {
    //   headers: {
    //     Authorization: localStorage.getItem("google-auth-token")
    //       ? "Bearer " + localStorage.getItem("google-auth-token")
    //       : "",
    //   },
    // }
  );
  console.log(result)
  return result
};
