import "@mantine/core/styles.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";
import { createTheme, MantineProvider } from "@mantine/core";
import layoutStyles from "./layout/layout.module.css";
import "mantine-datatable/styles.layer.css";

const theme = createTheme({
  components: {
    AppShell: {
      classNames: layoutStyles,
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <BrowserRouter>{routes}</BrowserRouter>
    </MantineProvider>
  );
}

export default App;
