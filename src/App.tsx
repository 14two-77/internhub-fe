import { BrowserRouter, Route, Routes } from "react-router";
import Browse from "./browse/pages/Browse";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/browse" element={<Browse />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
