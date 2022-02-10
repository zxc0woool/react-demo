
const isDev = process.env.NODE_ENV === 'development';

export default {
    
    SERVER_IP: '192.168.0.196',                 // 测试服务器端地址
    // SERVER_PORT: process.env.PORT || 8001,
    SERVER_PORT: 8099,                          // 测试服务器端口号

    IS_DEV: isDev,                              // 是否开发模式
    
    SERVER_ADDRESS: 'http://192.168.0.196:8099' // 正式服务器地址
    
};