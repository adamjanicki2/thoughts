import { Route, Router, Routes } from "@adamjanicki/ui";
import Footer from "src/components/Footer";
import Nav from "src/components/Nav";
import About from "src/pages/About";
import Home from "src/pages/Home";
import NotFound from "src/pages/NotFound";

export default function App() {
  return (
    <Router basename="/react-skeleton">
      <Nav />
      <Routes fallback={<NotFound />}>
        <Route path="/" element={<Home />} />
        <Route path="/about/" element={<About />} />
      </Routes>
      <Footer />
    </Router>
  );
}
