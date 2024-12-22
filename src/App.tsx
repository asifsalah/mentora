import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import CourseDetails from "@/pages/CourseDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;