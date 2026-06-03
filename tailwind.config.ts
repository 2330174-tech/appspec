import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211c",
        field: "#f7f4ed",
        line: "#d8d2c4",
        moss: "#556b45",
        brick: "#a14c39",
        lake: "#336b87"
      }
    }
  },
  plugins: []
};

export default config;
