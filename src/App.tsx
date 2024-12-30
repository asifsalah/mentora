import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CourseDetails from "@/pages/CourseDetails";
import CourseLessons from "@/pages/CourseLessons";

// Initialize the query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/course/:courseId/lessons" element={<CourseLessons />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
