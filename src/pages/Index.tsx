import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CourseCard } from "@/components/CourseCard";
import { CourseFilters } from "@/components/filters/CourseFilters";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Mock data for initial development
const mockCategories = [
  {
    id: "1",
    name: "Programming",
    children: [
      {
        id: "2",
        name: "Web Development",
        children: [
          { id: "3", name: "Frontend" },
          { id: "4", name: "Backend" },
        ],
      },
      { id: "5", name: "Mobile Development" },
    ],
  },
  {
    id: "6",
    name: "Design",
    children: [
      { id: "7", name: "UI/UX" },
      { id: "8", name: "Graphic Design" },
    ],
  },
];

const mockInstructors = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
];

const mockTags = [
  { id: "1", name: "Beginner" },
  { id: "2", name: "Advanced" },
  { id: "3", name: "JavaScript" },
  { id: "4", name: "React" },
];

const Index = () => {
  const [filters, setFilters] = useState({
    categories: [],
    instructors: [],
    tags: [],
    priceRange: { min: 0, max: 1000 },
  });

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", filters],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select("*")
        .eq("status", "published");

      if (filters.categories.length > 0) {
        query = query.contains("category_ids", filters.categories);
      }

      if (filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
      }

      if (filters.instructors.length > 0) {
        query = query.in("instructor_id", filters.instructors);
      }

      query = query
        .gte("regular_price", filters.priceRange.min)
        .lte("regular_price", filters.priceRange.max);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching courses:", error);
        return [];
      }

      return data;
    },
  });

  const handleEnroll = (courseId: string) => {
    console.log("Enrolling in course:", courseId);
    // Add enrollment logic here
  };

  return (
    <Layout>
      <div className="flex gap-6">
        <aside className="w-80 flex-shrink-0">
          <CourseFilters
            categories={mockCategories}
            instructors={mockInstructors}
            tags={mockTags}
            onFiltersChange={setFilters}
          />
        </aside>
        
        <div className="flex-1">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Expand Your Knowledge
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of courses and start learning today
            </p>
          </div>

          {isLoading ? (
            <div>Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  courseId={course.course_id}
                  title={course.title}
                  description={course.description || ""}
                  category={course.category_ids?.[0] || "Uncategorized"}
                  duration="12 weeks"
                  lessons={10}
                  rating={4.5}
                  imageUrl={course.feature_image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"}
                  price={course.regular_price || 0}
                  onEnroll={() => handleEnroll(course.course_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;