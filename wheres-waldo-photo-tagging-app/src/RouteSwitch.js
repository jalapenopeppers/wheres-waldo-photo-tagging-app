import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import About from "./components/About";
import Leaderboards from "./components/Leaderboards";
import Leaderboard from "./components/Leaderboard";
import Level from "./components/Level";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="leaderboards" element={<Leaderboards />}>
            <Route path=":levelID" element={<Leaderboard />} />
          </Route>
        </Route>
        <Route path=":levelID" element={<Level />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;