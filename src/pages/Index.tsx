import { useState } from "react";
import { Layout } from "@/components/Layout";
import { CourseCard } from "@/components/CourseCard";
import { CategoryFilter } from "@/components/CategoryFilter";

// Mock data
const categories = ["Programming", "Design", "Business", "Marketing", "Personal Development"];

const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Learn web development from scratch with HTML, CSS, JavaScript, React, and Node.js",
    category: "Programming",
    duration: "12 weeks",
    lessons: 120,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    price: 99.99,
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of user interface and user experience design",
    category: "Design",
    duration: "8 weeks",
    lessons: 84,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698",
    price: 89.99,
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    description: "Learn modern digital marketing strategies and tools",
    category: "Marketing",
    duration: "6 weeks",
    lessons: 60,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a",
    price: 79.99,
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = selectedCategory === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const handleEnroll = (courseId: number) => {
    console.log("Enrolling in course:", courseId);
    // Add enrollment logic here
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Expand Your Knowledge
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our wide range of courses and start learning today
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              onEnroll={() => handleEnroll(course.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;