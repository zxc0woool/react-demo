import React, { Component } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { addUser, getUser } from "./api";
import styles from "./index.module.less";
import { setLocal } from "../../request/auth";

export default class Login extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      rediectToReferrer: false, // 是否重定向之前的界面
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSumit = this.handleSumit.bind(this);
  }
  // 处理用户名、密码的变化
  handleChange(e: any) {
    if (e.target.name === "username") {
      this.setState({
        username: e.target.value,
      });
    } else if (e.target.name === "password") {
      this.setState({
        password: e.target.value,
      });
    }
  }
  // 提交登录表单
  async handleSumit(values: any) {
    const username = values.username;
    const password = values.password;
    // 记住密码
    if (!values.remember) {

    }
    // 保存信息到Local
    setLocal(username);
    // localStorage.setItem("username", username);
    // 登录成功后，设置redirectToReferrer为true;
    this.setState({
      rediectToReferrer: true,
    });
    // let RedirectUrl = "/";
    // let navigate = useNavigate();
    // // 登陆成功之后的跳转
    // navigate(RedirectUrl);
    // window.location.href = "/";

    addUser({ username, password }).then(
      (data) => {

        console.log(data);
      },(e)=>{

      }
    );


    getUser({ username, password }).then(
      (data) => {
        console.log("response", data);
        // window.location.href = "/";
      },(error)=>{
        console.log(error);
        
      }
    );


    console.log("测试测试测试测试测试");


  }
  onFinish(values: any) {
    console.log("Success:", values);
  }

  onFinishFailed(errorInfo: any) {
    console.log("Failed:", errorInfo);
  }
  render() {
    return (
      <div className={styles.Login}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={this.handleSumit}
          onFinishFailed={this.onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "用户名不得为空!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "密码不得为空!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
