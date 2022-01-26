import { Component } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { getLocal } from "../request/auth";
/** 
 * 路由请求授权
 * @param {*} children
 * @returns
 */
function RequireAuth({ children }) {
  
  const isLogin = getLocal();
  if (isLogin) {
    // 如果是登陆状态，想要跳转到登陆，重定向到主页
    if (children.type.name === "Login") {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  } else {
    // 非登陆状态下，当用户不合法时且需要权限校验时，跳转到登陆页面，要求登陆
    return <Navigate to="/login" />;
  }
}

/**
 *  页面路由认证
 */
 export default class FrontendAuth extends Component {
  render() {
    const { routerConfig } = this.props;
    const isLogin = getLocal();

    function getRouter(params) {
      return params.map((item, index) => {
        if (item.path === "login") {
          // 用户登录后，登录页面进行验证，过滤登录页面不在跳转到登录页面
          // 去掉当前判断代码，用户登录后还可以继续进入登录页面
          if (isLogin) {
            item.auth = false;
          } else {
            item.auth = true;
          }
        }
        if (item.auth) {
          // 是为了在非登陆状态下，访问不需要权限校验的路由
          if (item.children) {
            return (
              <Route key={index} path={item.path} element={item.element}>
                {getRouter(item.children)}
              </Route>
            );
          } else {
            return (
              <Route key={index} path={item.path} element={item.element} />
            );
          }
        } else {
          // 是为了在登陆状态下，访问需要权限校验的路由
          if (item.children) {
            return (
              <Route
                key={index}
                path={item.path}
                element={<RequireAuth>{item.element}</RequireAuth>}
              >
                {getRouter(item.children)}
              </Route>
            );
          } else {
            return (
              <Route
                key={index}
                path={item.path}
                element={<RequireAuth>{item.element}</RequireAuth>}
              />
            );
          }
        }
      });
    }
    return <Routes>{getRouter(routerConfig)}</Routes>;
  }
}