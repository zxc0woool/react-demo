# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## 目录结构说明

config:                       项目配置
build:                        打包目录
doc:                          存放文档的目录
node_modules:                 node_modules覆盖目录
src:                          开发目录  所有源代码存放的路径
    components:               组件（全局组件，全局方法）
        Home                  例如，则在components/中就有一个名为Home的子文件夹的组件
            index.js          例如：一个列表组件
            index.module.less 列表组件对应的样式
    page:                     页面组件
        login
            index.js          例如，登录页面的入口就是page/login
            index.module.less 页面对应的样式
            api.js            相对应的API接口方法
    static:                   第三方文件存放地 如：图片等
    app.less:                 总样式入口
    app.tsx:                  js入口
    router:                   路由配置
        FrontendAuth:         路由逻辑实现
        router:               路由配置文件

## 前端组件列表
## Ant Design of React
[Antd](https://ant.design/docs/react/introduce-cn)
[Antd组件总览](https://ant.design/components/overview-cn/)

