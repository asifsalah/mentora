import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/CourseCard";

interface RelatedCoursesProps {
  currentCourseId: string;
  categoryIds: string[];
  instructorId: string;
}

export const RelatedCourses = ({
  currentCourseId,
  categoryIds,
  instructorId,
}: RelatedCoursesProps) => {
  const { data: relatedCourses = [] } = useQuery({
    queryKey: ["related-courses", currentCourseId, categoryIds],
    queryFn: async () => {
      if (!categoryIds?.length) return [];

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .neq("course_id", currentCourseId)
        .eq("status", "published")
        .overlaps("category_ids", categoryIds)
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!categoryIds?.length,
  });

  if (!relatedCourses.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedCourses.map((course: any) => (
          <CourseCard
            key={course.course_id}
            courseId={course.course_id}
            title={course.title}
            description={course.short_description || ""}
            category={course.category_ids?.[0] || ""}
            duration="12 weeks"
            lessons={10}
            rating={4.5}
            imageUrl={course.feature_image || ""}
            price={course.regular_price || 0}
            onEnroll={() => {}}
          />
        ))}
      </CardContent>
    </Card>
  );
};