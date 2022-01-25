import axios from "axios";
import { getItem } from "./auth";
import { errorException } from "./axios.error"; //http异常处理

const IS_PRETREATMENT = false; // 请求数据是否预处理

// 请求路径
const BaseUrl = "http://192.168.0.195:80"; // 主机及端口

//axios默认配置请求的api基础地址
axios.defaults.baseURL = BaseUrl;

//头部配置
function Headers() {
  var User = getItem();
  var access_token : string;
  access_token = "";
  if (User && User.access_token && User.access_token !== "") {
    access_token = User.access_token;
  }
  // Vue.$http.default.headers.common['token'] = token;
  var cfg = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      // 'Content-Type': 'multipart/form-data;'
      "x-token": access_token,
    },
    // timeout: 30e3 // 超时设置,超时进入错误回调，进行相关操作
    // 'Content-Type': 'application/x-www-form-urlencoded'
  };
  return cfg;
}

/**
 * 预处理请求数据库返回的数据
 * @param {*} then
 * @param {*} that
 * @param {*} receive
 */
function PretreatmentData(then: { success: any; error?: any; }, that: { datas: any[]; data: {}; state: boolean; message: any; }, receive: { state: any; data: any; status: any; code: string | number; }) {
  if (receive && receive.state) {
    if (Array.isArray(receive.data)) {
      //  true：数组  false：对象
      that.datas = receive.data;
      that.data = {};
    } else {
      that.datas = [];
      that.data = receive.data;
    }
    that.state = true;
    that.message = receive.status ? receive.status : "操作成功";
    then.success(that);
  } else {
    that.data = {};
    that.datas = [];
    that.state = false;
    that.state = receive.state;
    that.message = receive.status ? receive.status : "操作失败";
    // var Exception = errorException[receive.code];
    // if (typeof Exception === "function") Exception();
    then.error(that);
  }
}

/**
 * 请求错误数据预处理
 * @param {*} then
 * @param {*} that
 * @param {*} error
 */
function ErrorPretreatmentData(then: { error: any; }, that: { datas: never[]; data: {}; state: boolean; message: any; reason: any; }, error: { message: any; response: { data: { Message: any; code: string | number; }; }; }) {
  that.datas = [];
  that.data = {};
  that.state = false;
  that.message = error.message;
  // that.code = error.response.data.err_code;
  try {
    that.reason = error.response.data.Message;
    // var Exception = errorException()[error.response.data.code];
    // if (typeof Exception === "function") Exception();
    then.error(that);
  } catch (err) {}
}

/**
 * 对象转&拼接
 * @param {*} param
 * @returns
 */
function ParseParam(param: { [x: string]: string; }) {
  var paramStr = "";
  for (const i in param) {
    if (paramStr === "") {
      paramStr += "?" + i + "=" + param[i];
    } else {
      paramStr += "&" + i + "=" + param[i];
    }
  }
  return paramStr;
}

/**
 * 请求成功
 * @param {*} then
 * @param {*} response
 */
function SuccessPretreatment(this: any, then: { success: (arg0: any) => void; }, response: { data: any; }) {
  console.log(response);
  var receive = response ? response.data : response;
  if (IS_PRETREATMENT) {
    // 预处理数据
    PretreatmentData(then, this, receive);
  } else {
    then.success(receive);
  }
}

/**
 * 请求失败
 * @param {*} then
 * @param {*} error
 */
function ErrorPretreatment(this: any, then: { error: (arg0: any) => void; }, error: any) {
  if (IS_PRETREATMENT) {
    // 预处理数据
    ErrorPretreatmentData(then, this, error);
  } else {
    then.error(error);
  }
}

/**
 * 自定义http请求
 */
class $http {
  then!: (successCall?: () => void, errorCall?: () => void) => void;
  private _httpDelete: (usr: any, condition?: any, config?: any) => Promise<never>;
  private _httpPut: (usr: any, condition?: any, config?: any) => Promise<never>;
  private _httpPost: (usr: any, condition?: any, config?: any) => Promise<never>;
  private _httpGet: (usr: any, condition?: any, config?: any) => Promise<never>;
  constructor() {
    class then {
      error: () => void;
      success: () => void;
      constructor() {
        this.success = () => {};
        this.error = () => {};
      }
    }

    // get请求
    this._httpGet = async (usr, condition, config) => {
      var cfg = config || Headers();
      var _then = new then();
      //执行回调
      this.then = (successCall = () => {}, errorCall = () => {}) => {
        _then.success = successCall;
        _then.error = errorCall;
      };
      await axios
        .get(usr + ParseParam(condition), cfg)
        .then(
          SuccessPretreatment.bind(this, _then),
          ErrorPretreatment.bind(this, _then)
        );
      return this;
    };
    // post请求
    this._httpPost = async (usr, condition, config) => {
      var cfg = config || Headers();
      var _then = new then();
      //执行回调
      this.then = (successCall = () => {}, errorCall = () => {}) => {
        _then.success = successCall;
        _then.error = errorCall;
      };
      await axios
        .post(usr, condition, cfg)
        .then(
          SuccessPretreatment.bind(this, _then),
          ErrorPretreatment.bind(this, _then)
        );
      return this;
    };
    // put请求
    this._httpPut = async (usr, condition, config) => {
      var cfg = config || Headers();
      var _then = new then();
      //执行回调
      this.then = (successCall = () => {}, errorCall = () => {}) => {
        _then.success = successCall;
        _then.error = errorCall;
      };
      await axios
        .put(usr, condition, cfg)
        .then(
          SuccessPretreatment.bind(this, _then),
          ErrorPretreatment.bind(this, _then)
        );
      return this;
    };
    // delete请求
    this._httpDelete = async (usr, config) => {
      var cfg = config || Headers();
      var _then = new then();
      // 执行回调
      this.then = (successCall = () => {}, errorCall = () => {}) => {
        _then.success = successCall;
        _then.error = errorCall;
      };
      await axios
        .delete(usr, cfg)
        .then(
          SuccessPretreatment.bind(this, _then),
          ErrorPretreatment.bind(this, _then)
        );
      return this;
    };
  }
}

/* 响应拦截器 */
axios.interceptors.response.use(
  (response: any) => {
    // let token = localStorage.getItem("x-auth-token");

    // if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    //     response.headers.token = `${token}`;
    // }else{
    //     response.headers.token = response.data.Token
    // }

    return response;
  },
  function (error: { response: { status: number; }; message: string; }) {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误(400)";
          break;

        case 401:
          error.message = "未授权，请重新登录(401)";
          break;

        case 403:
          error.message = "拒绝访问(403)";
          break;

        case 404:
          error.message = "请求出错(404)";
          break;

        case 406:
          error.message = "请求的格式不可得(406)";
          break;

        case 408:
          error.message = "请求超时(408)";
          break;

        case 410:
          error.message = "请求的资源被永久删除，且不会再得到的(410)";
          break;

        case 422:
          error.message = "当创建一个对象时，发生一个验证错误(422)";
          break;

        case 500:
          error.message = "服务器错误(500)";
          break;

        case 501:
          error.message = "服务未实现(501)";
          break;

        case 502:
          error.message = "网络错误(502)";
          break;

        case 503:
          error.message = "服务不可用(503)";
          break;

        case 504:
          error.message = "网络超时(504)";
          break;

        case 505:
          error.message = "HTTP版本不受支持(505)";
          break;

        default:
          error.message = `连接出错(${error.response.status})!`;
      }
    } else {
      error.message = "服务器连接失败!";
    }
    if (error.response.status < 500) {
      // Vue.prototype.$message.warning(error.message);
    } else {
      // Vue.prototype.$message.error(error.message);
    }
    if (401 === error.response.status) {
      window.location.href = "/";
      return false;
    }
    return Promise.reject(error);
  }
);
export default new $http();
