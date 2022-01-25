import utils from "../../request/index";



export function addUser(username: string, password: string) {
  return utils._httpPost(
    "/addUser",
    { username: username, password: password },
    {}
  );
}

export function getUser(username: string, password: string) {
  return utils._httpGet("/getUser", { username: username, password: password });
}
