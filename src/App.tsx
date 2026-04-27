import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import AMS from "./pages/AMS";
import Ranking from "./pages/Ranking";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import About from "./pages/About";
import CreatePost from "./pages/CreatePost";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/ams" element={<AMS />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit" element={<CreatePost />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/create-project" element={<CreateProject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

