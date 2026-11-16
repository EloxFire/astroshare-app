declare module "react-native-mathjax" {
  import { Component } from "react";
  import { WebViewProps } from "react-native-webview";

  export interface MathJaxProps extends Partial<WebViewProps> {
    html: string;
    mathJaxOptions?: Record<string, unknown>;
  }

  export default class MathJax extends Component<MathJaxProps> {}
}
