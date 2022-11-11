import axios from "axios";
import { getLocal } from "./auth";
import COMM from "./comm";
import { errorException } from "./axios.error"; //http异常处理


// 请求路径
const BaseUrl = "http://" + COMM.SERVER_IP + ":" + COMM.SERVER_PORT; // 主机及端口

//axios默认配置请求的api基础地址
axios.defaults.baseURL = COMM.IS_DEV ? BaseUrl : COMM.SERVER_ADDRESS;

// const TOKEN_NAME = "token"; // token

//头部配置
function Headers() {
  let User = getLocal();
  let access_token = "";
  if (User && User[COMM.TOKEN_USER_ACCES] && User[COMM.TOKEN_USER_ACCES] !== "") {
    access_token = User[COMM.TOKEN_USER_ACCES];
  }

  let cfg: any = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      // 'Content-Type': 'multipart/form-data;'
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 0, // 30e3 超时设置,超时进入错误回调，进行相关操作
  };

  // 添加 token
  cfg.headers[COMM.TOKEN_USER_ACCES_FIELD] = access_token;

  return cfg;
}

// ajax请求统一增加请求头
axios.interceptors.request.use(
  (config) => {
    let cfg = Headers();
    config.headers = {
      ...config.headers,
      ...cfg.headers,
    };

    config.timeout = cfg.timeout;

    // console.log(token);

    let str_data = JSON.stringify(config.data || "{}");
    // 参数中携带cancelHttp，不防止多次请求
    if (str_data.indexOf("cancelHttp") > -1) {
    } else {
    }
    return config;
  },
  (err) => {
    return null;
  }
);

function onValidKey(
  key: string | number | symbol,
  object: any
): key is keyof typeof object {
  return object[key];
}

//返回参数
interface RequestData {
  data: any;
  datas: any[];
  message: string;
  state: boolean;
  reason: string;
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
    that.state = receive.state;
    that.message = receive.status ? receive.status : "操作失败";
    let Exception = onValidKey(receive.code, errorException) as any;
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
    let Exception = onValidKey(error.response.code, errorException) as any;
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
  then: {isPretreatment:boolean, success: (arg0: any) => void },
  response: { data: any }
) {
  console.log("Success>>>>>>\n", response);
  let receive = response ? response.data : response;
  if (then.isPretreatment) {
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
  then: {isPretreatment:boolean, error: (arg0: any) => void },
  error: any
) {
  console.log("Error>>>>>>\n", error);
  if (then.isPretreatment) {
    // 预处理数据
    ErrorPretreatmentData(then, {} as RequestData, error);
  } else {
    then.error(error);
  }
}


/**
 * 配置方法
 */
class configureHttp {

  /**
   * 请求数据是否预处理 
   */
  isPretreatment: boolean;

  /**
   * 打开预处理数据
   */
   openPretreatment: () => any;
  
  /**
   * 关闭预处理数据
   */
  shutPretreatment: () => any;

  constructor() {
    this.isPretreatment = COMM.IS_PRETREATMENT
    this.openPretreatment = () => {
      this.isPretreatment = true;
      return this;
    }
    this.shutPretreatment = () => {
      this.isPretreatment = false;
      return this;
    }
  }

}

/**
 * 返回数据
 */
class then extends configureHttp {

  /**
   * 成功返回
   */
  success: (response: any) => void;

  /**
   * 错误返回
   */
  error: (error: any) => void;

  /**
   * 挂载方法
   */
  then: ( successCall?: ((response: any) => void) | undefined, errorCall?: ((error: any) => void) | undefined ) => then;
  
  constructor(executor: any) {
    super();
    this.success = () => {};
    this.error = () => {};
    this.then = ( successCall?: (response: any) => void, errorCall?: (error: any) => void ) => {
      if (successCall) this.success = successCall;
      if (errorCall) this.error = errorCall;
      return this;
    };
    executor(this)
  }

}

/**
 * 自定义http请求
 */
class $http {
  _httpGet: (usr: string, condition: any) => then;
  _httpPut: (usr: string, condition: any) => then;
  _httpDelete: (usr: string, condition: any) => then;
  _httpPost: (usr: string, condition: any) => then;

  constructor() {
    /**
     * get请求
     */
    this._httpGet = (usr, condition) => {
      return new then((then: any) => {
        axios
          .get(usr + ParseParam(condition))
          .then(
            SuccessPretreatment.bind(this, then),
            ErrorPretreatment.bind(this, then)
          );
      });
    };

    /**
     * post请求
     */
    this._httpPost = (usr, condition) => {
      return new then((then: any) => {
        axios
          .post(usr, condition)
          .then(
            SuccessPretreatment.bind(this, then),
            ErrorPretreatment.bind(this, then)
          );
      });
    };

    /**
     * put请求
     */
    this._httpPut = (usr, condition) => {
      return new then((then: any) => {
        axios
          .post(usr, condition)
          .then(
            SuccessPretreatment.bind(this, then),
            ErrorPretreatment.bind(this, then)
          );
      });
    };

    /**
     * delete请求
     */
    this._httpDelete = (usr, condition) => {
      return new then((then: any) => {
        axios
          .post(usr, condition)
          .then(
            SuccessPretreatment.bind(this, then),
            ErrorPretreatment.bind(this, then)
          );
      });
    };
  }
}

/* 响应拦截器 */
axios.interceptors.response.use(
  (response: any) => {
    // let data : {
    //     data: { 
    //        Message: string; 
    //     }; 
    //     code: string | number | symbol; 
    //     message: string;
    // }
    // const { data } = response;
    // response.data ={
    //   ...response.data,
    //   code: data.code,
    //   data: data.data,
    //   message: data.message,
    //   state: data.state
    // }
  
    // console.log(" ");
    
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
