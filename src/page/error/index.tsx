import React, { Component } from "react";
import styles from "./index.module.less";

export default class Error extends Component {
  constructor(props: any) {
    super(props);
    this.state = {

    }
  }
  render() {
    return <div className={styles.Error}><h1>Error 404</h1></div>;
  }
}

