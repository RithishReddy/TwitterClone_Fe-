import { atom } from "recoil";
import { useRecoilState } from "recoil";



export const userDetails=atom({
    key:"userInfo",
    default:{displayName:"",email:"",image:""},
});


export const useDetails=()=>{
    const [userData, setuserData] = useRecoilState(userDetails);
    return [userData,setuserData]
}