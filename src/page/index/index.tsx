import { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.less";
import { Button, DatePicker, version } from "antd";
import { removeLocal } from "../../request/auth";

export default class Index extends Component {
  constructor(props: any) {
    super(props);
    this.state = {

    }
  }
  onLogOut(){

    // 清理缓存
    removeLocal();
    removeLocal("token");
    
    // 跳转到登录页面
    window.location.href = '/login';
  }
  render() {
    return (
      <div className={styles.Index}>
        Index
        <Link to="home" style={{color:'red'}}>
          <div>点击跳转到Home</div>
        </Link>
        <div onClick={this.onLogOut}>退出登录</div>
        <h1>antd version: {version}</h1>
        <DatePicker />
        <Button type="primary" style={{ marginLeft: 8 }}>
          按钮
        </Button>
        
      </div>
    );
  }
}

