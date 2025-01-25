declare module "*.svg" {
    import React from "react";
  import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

  declare module '*.ttf' {
    const content: string;
    export default content;
  }
  declare module '@env' {
    export const ENV: string;
  }
  declare module "*.png" {
    const content: any;
    export default content;
}
declare module "*.jpg" {
  const content: any;
  export default content;
}