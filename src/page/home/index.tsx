import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.less";

export default class Home extends Component {
  constructor(props: any) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <div className={styles.Home}>
        Home
        <Link to="/" style={{ color: "red" }}>
          <div>点击跳转到Index</div>
        </Link>
      </div>
    );
  }
}

