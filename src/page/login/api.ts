import $http from "../../request/index";

interface UserInfo {
  username: string, 
  password: string
}

export const addUser = (data:UserInfo) => $http._httpPost( "/addUser", {...data })

export const getUser = (data:UserInfo) => $http._httpGet( "/getUser",{...data })
