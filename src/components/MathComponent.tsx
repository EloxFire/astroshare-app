import React from 'react';
// @ts-ignore
import MathJax from 'react-native-mathjax';

interface MathComponentProps {
  expression?: string
}

function MathComponent({expression}: MathComponentProps) {

  if(!expression) return null;

  const formattedExpression = '$\\small{\\color{white}{' + expression + '}}$'

  return (
    <MathJax
      // HTML content with MathJax support
      html={formattedExpression}
      // MathJax config option
      mathJaxOptions={{
        messageStyle: 'none',
        extensions: [ 'tex2jax.js' ],
        jax: [ 'input/TeX', 'output/HTML-CSS' ],
        tex2jax: {
          inlineMath: [ ['$','$'], ['\\(','\\)'] ],
          displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
          processEscapes: true,
        },
        TeX: {
          extensions: ['AMSmath.js','AMSsymbols.js','noErrors.js','noUndefined.js']
        }
      }}
      style={{backgroundColor: 'transparent', color: "#FFF"}}
    />
  );
}

export default MathComponent;