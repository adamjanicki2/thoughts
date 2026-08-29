import { Route, Router, Routes } from "@adamjanicki/ui";
import Footer from "src/components/Footer";
import Nav from "src/components/Nav";
import Home from "src/pages/Home";
import NotFound from "src/pages/NotFound";
import Thought from "src/pages/Thought";
import thoughts from "src/thoughts";
import { idify } from "src/util";

export default function App() {
  return (
    <Router basename="/thoughts">
      <Nav />
      <Routes fallback={<NotFound />}>
        <Route path="/" element={<Home />} />
        {thoughts.map((thought, index) => (
          <Route
            key={index}
            path={`/${idify(thought.title, undefined)}`}
            element={
              <Thought
                thought={thought}
                previous={index > 0 ? thoughts[index - 1].title : undefined}
                next={thoughts[index + 1]?.title}
              />
            }
          />
        ))}
      </Routes>
      <Footer />
    </Router>
  );
}
