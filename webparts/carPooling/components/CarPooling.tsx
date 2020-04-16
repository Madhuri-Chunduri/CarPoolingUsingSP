import * as React from "react";
import styles from "./CarPooling.module.scss";
import { ICarPoolingProps } from "./ICarPoolingProps";
import { escape } from "@microsoft/sp-lodash-subset";

export default class CarPooling extends React.Component<ICarPoolingProps, {}> {
  public render(): React.ReactElement<ICarPoolingProps> {
    return (
      <div className={styles.carPooling}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>
                Customize SharePoint experiences using Web Parts.
              </p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
