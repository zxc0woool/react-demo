import Index from "../page/index/index";
import Home from "../page/home";
import ErrorPage from "../page/error";
import Login from "../page/login";

/**
 * 路由配置
 * @param {*} path 路由名称
 * @param {*} element 页面内容
 * @param {*} auth 是否授权 授权后可跳过认证
 */
const router = [
  { path: "*", element: <ErrorPage />, auth: true },
  { path: "/", element: <Index /> },
  { path: "login", element: <Login />, auth: true },
  { path: "home", element: <Home /> }
];

export default router;
