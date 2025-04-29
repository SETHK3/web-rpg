import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Town from "./scenes/Town";
import Wilderness from "./scenes/Wilderness";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/">Town</Link>
        <Link to="/wilderness">Wilderness</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Town />} />
        <Route path="/wilderness" element={<Wilderness />} />
      </Routes>
    </Router>
  );
}

export default App;
