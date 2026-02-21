// Critical inline styles para evitar Cumulative Layout Shift y bloqueo de render
export const criticalStyles = `
  html {
    scrollbar-gutter: stable;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  * {
    box-sizing: border-box;
  }
`;
