import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main
        id="main-content"
        style={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "24px",
          scrollMarginTop: "60px",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
