// src/styles/theme.js
const theme = {
    colors: {
      primary: "#6A85B6", // Main accent color
      accent: "#B6CEE8", // Secondary accent color
      background: "#F2F6FF", // App background color
      text: "#333333", // Text color
      placeholder: "#7A7A7A", // Placeholder color
      buttonText: "#FFFFFF", // Button text color
    },
    typography: {
      header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
      },
      body: {
        fontSize: 16,
        fontWeight: "normal",
        textAlign: "left",
      },
      footer: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 10,
    },
  };
  
  export default theme;
  