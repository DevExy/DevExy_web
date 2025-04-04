import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RedirectPage from "./RedirectPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/go" element={<RedirectPage />} />
        <Route path="/go" element={<RedirectPage />} />
        <Route path="/go" element={<RedirectPage />} />
        <Route path="/go" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}
