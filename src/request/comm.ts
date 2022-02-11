const isDev = process.env.NODE_ENV === "development";

const module = {

  SERVER_IP: "192.168.0.196",                   // 测试服务器端地址

  SERVER_PORT: 8099,                            // 测试服务器端口号

  IS_DEV: isDev,                                // 是否开发模式

  SERVER_ADDRESS: "http://192.168.0.196:8099",  // 正式服务器地址

  IS_PRETREATMENT: true,                        // 请求数据是否预处理 

  TOKEN_USER_ACCES_FIELD: "x-token",            // 服务器接收token 字段

  TOKEN_USER_ACCES: "access_token",             // 用户保存的token 字段
  
};

export default module;