import axios from "axios";
import { getLocal } from "./auth";
import { errorException } from "./axios.error"; //http异常处理

const IS_PRETREATMENT = true; // 请求数据是否预处理

// 请求路径
const BaseUrl = "http://192.168.0.196:8099"; // 主机及端口http://localhost:3000

//axios默认配置请求的api基础地址
axios.defaults.baseURL = BaseUrl;


const TOKEN_NAME = "token"; // token
const TOKEN_USER_ACCES = "access_token"; // 用户 对象保存的token 字段


//头部配置
function Headers() {
  let User = getLocal();
  let access_token = "";
  if (User && User[TOKEN_USER_ACCES] && User[TOKEN_USER_ACCES] !== "") {
    access_token = User[TOKEN_USER_ACCES];
  }
  let cfg = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      // 'Content-Type': 'multipart/form-data;'
      // 'Content-Type': 'application/x-www-form-urlencoded'
      "x-token": access_token,
    },
    timeout: 0 // 30e3 超时设置,超时进入错误回调，进行相关操作
  };
  return cfg;
}

// ajax请求统一增加请求头
axios.interceptors.request.use(config => {

  let cfg = Headers();
  config.headers = {
    ...config.headers,
    ...cfg.headers
  }

  config.timeout = cfg.timeout;

   // console.log(token);
  
  let str_data = JSON.stringify(config.data || '{}');
  // 参数中携带cancelHttp，不防止多次请求
  if (str_data.indexOf("cancelHttp") > -1) {
   
  }else {
    
  }
  return config
},
err => {
  return null
})

function onValidKey(key: string | number | symbol , object: any): key is keyof typeof object {
  return object[key];
}

//返回参数
interface RequestData {
  data: any
  datas: any[]
  message: string
  state: boolean,
  reason: string
}

/**
 * 预处理请求数据库返回的数据
 * @param {*} then
 * @param {*} that
 * @param {*} receive
 */
function PretreatmentData(
  then: { success: any; error?: any },
  that: RequestData,
  receive: any
) {
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
    let Exception = onValidKey(receive.code, errorException) as any ;
    if (typeof Exception === "function") Exception();
    then.error(that);
  }
}

/**
 * 请求错误数据预处理
 * @param {*} then
 * @param {*} that
 * @param {*} error
 */
function ErrorPretreatmentData(
  then: { error: any },
  that: RequestData,
  error: any
) {
  that.datas = [];
  that.data = {};
  that.state = false;
  that.message = error.message;
  // that.code = error.response.data.err_code;
  try {
    that.reason = error.response.data.Message;
    let Exception = onValidKey(error.response.code, errorException) as any ;
    if (typeof Exception === "function") Exception();
    then.error(that);
  } catch (err) {}
}

/**
 * 对象转&拼接
 * @param {*} param
 * @returns
 */
function ParseParam(param: any) {
  let paramStr = "";
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
function SuccessPretreatment(
  this: any,
  then: { success: (arg0: any) => void },
  response: { data: any }
) {
  console.log("Success>>>>>>\n",response);
  let receive = response ? response.data : response;
  if (IS_PRETREATMENT) {
    // 预处理数据
    PretreatmentData(then, {} as RequestData, receive);
  } else {
    then.success(receive);
  }
}

/**
 * 请求失败
 * @param {*} then
 * @param {*} error
 */
function ErrorPretreatment(
  this: any,
  then: { error: (arg0: any) => void },
  error: any
) {
  console.log("Error>>>>>>\n",error);
  if (IS_PRETREATMENT) {
    // 预处理数据
    ErrorPretreatmentData(then, {} as RequestData, error);
  } else {
    then.error(error);
  }
}

/**
 * 自定义http请求
 */
class $http {
  then!: (
    successCall?: (response: any) => void,
    errorCall?: (error: any) => void
  ) => void;
  _httpGet: (usr: any, condition: any) => this;
  _httpPost: (usr: any, condition: any) => this;
  _httpPut: (usr: any, condition: any) => this;
  _httpDelete: (usr: any, condition: any) => this;

  constructor() {
    class then {
      error: (error: any) => void;
      success: (response: any) => void;
      init: (
        successCall?: ((response: any) => void) | undefined,
        errorCall?: ((error: any) => void) | undefined
      ) => void;
      constructor() {
        this.success = () => {};
        this.error = () => {};
        this.init = (
          successCall?: (response: any) => void,
          errorCall?: (error: any) => void
        ) => {
          if (successCall) this.success = successCall;
          if (errorCall) this.error = errorCall;
        };
      }
    }

    /**
     * get请求
     */
    this._httpGet = (usr, condition,) => {
      //执行回调
      let _then = new then();
      this.then = _then.init;
      axios
        .get(usr + ParseParam(condition))
        .then(
          SuccessPretreatment.bind(this, _then),
          ErrorPretreatment.bind(this, _then)
        );
      return this;
    };

    /**
     * post请求
     */
    this._httpPost = (usr, condition) => {
      //执行回调
      let _then = new then();
      this.then = _then.init;
      axios
        .post(usr, condition)
        .then(
          SuccessPretreatment.bind(this, _then),
          ErrorPretreatment.bind(this, _then)
        );
      return this;
    };

    /**
     * put请求
     */
    this._httpPut = (usr, condition) => {
      //执行回调
      let _then = new then();
      this.then = _then.init;
      axios
        .put(usr, condition)
        .then(
          SuccessPretreatment.bind(this, _then),
          ErrorPretreatment.bind(this, _then)
        );
      return this;
    };

    /**
     * delete请求
     */
    this._httpDelete = (usr, condition) => {
      //执行回调
      let _then = new then();
      this.then = _then.init;
      axios
        .delete(usr, condition)
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
    // 请求成功后拦截预处理
    return response;
  },
  function (error: { response: { status: number }; message: string }) {
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
