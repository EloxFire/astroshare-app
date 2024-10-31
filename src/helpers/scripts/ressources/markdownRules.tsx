import {Image, Text, View} from "react-native";
import {markdownStyles} from "../../../styles/markdown";

export const markdownRules = {
  heading1: (node: any, children: any, parent: any, styles: any) => {
    return <Text key={node.key} style={markdownStyles.heading1}>{children}</Text>
  },
  heading2: (node: any, children: any, parent: any, styles: any) => {
    return <Text key={node.key} style={markdownStyles.heading2}>{children}</Text>
  },
  heading3: (node: any, children: any, parent: any, styles: any) => {
    return <Text key={node.key} style={markdownStyles.heading3}>{children}</Text>
  },
  heading4: (node: any, children: any, parent: any, styles: any) => {
    return <Text key={node.key} style={markdownStyles.heading4}>{children}</Text>
  },
  heading5: (node: any, children: any, parent: any, styles: any) => {
    return <Text key={node.key} style={markdownStyles.heading5}>{children}</Text>
  },
  heading6: (node: any, children: any, parent: any, styles: any) => {
    return <Text key={node.key} style={markdownStyles.heading6}>{children}</Text>
  },
  blockquote: (node: any, children: any, parent: any, styles: any) => {
    return <View key={node.key} style={[markdownStyles.blockquote]}>
      {children}
    </View>
  }
}