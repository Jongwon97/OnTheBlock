import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/Landing.jsx";
import Main from "./pages/main/Main.jsx";
import CompositionRecord from "./pages/record/CompositionRecord.jsx";
import SessionRecord from "./pages/record/SessionRecord.jsx";
import Player from "@/components/remotion/Player.jsx";
import MyPage from "./pages/mypage/MyPage.jsx";
import Profile from "./pages/profile/Profile.jsx";
import ProfileError from "./pages/profile/ProfileError.jsx";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import Bridge from "./pages/Bridge.jsx";
import MemberInit from "./pages/memberInit/MemberInit.jsx";
import VideoModal from "@/components/video/VideoModal.jsx";
import MyPageGridContent from "@/components/mypage/MyPageGridContent.jsx";
import MyPageInfoInput from "@/components/mypage/MyPageInfoInput.jsx";

import "@/assets/fonts/fonts.css";
import "bootstrap/dist/css/bootstrap.min.css";

// primereact css
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/record/session" element={<SessionRecord />}></Route>
        <Route
          path="/record/composition"
          element={<CompositionRecord />}
        ></Route>
        <Route path="/player" element={<Player />}></Route>
        <Route path="/bridge" element={<Bridge />}></Route>
        <Route path="/memberInit" element={<MemberInit />}></Route>
        <Route path="/main" element={<Main />}></Route>
        <Route path="/mypage" element={<MyPage />}>
            <Route path=":option" element={<MyPageGridContent/>}></Route>
            {/*<Route path="work" element={<MyPageInfoInput/>}></Route>*/}
            <Route path="information" element={<MyPageInfoInput/>}></Route>
        </Route>
        <Route path="/profile/:memberId" element={<Profile />}></Route>
        <Route path="/profile/error" element={<ProfileError />} />
      </Routes>
      <VideoModal />
      <Footer />
    </Router>
  </>
);

