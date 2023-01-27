import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import PostListPage from "./pages/PostListPage";
import PostPage from "./pages/PostPage";
import RegisterPage from "./pages/RegisterPage";
import WritePage from "./pages/WritePage";
import ProductListPage from "./pages/ProductsListPage";
import { Helmet } from "react-helmet-async";
import { Reset } from "styled-reset";

const App = () => {
  return (
    <>
      <Reset />
      <Helmet>
        <title>REACTERS</title>
      </Helmet>
      <Routes>
        <Route element={<PostListPage />} path={"/posts"} exact />
        <Route element={<PostListPage />} path={"/posts/:userId"} exact />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<WritePage />} path="/write" />
        <Route element={<PostPage />} path="/:userId/:postId" />
        <Route element={<ProductListPage />} path="/auction/:category" />
      </Routes>
    </>
  );
};

export default App;
