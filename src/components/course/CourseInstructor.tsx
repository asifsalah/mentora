import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/CourseCard";

interface CourseInstructorProps {
  instructor: any;
  courseId: string;
}

export const CourseInstructor = ({ instructor, courseId }: CourseInstructorProps) => {
  const { data: otherCourses = [] } = useQuery({
    queryKey: ["instructor-courses", instructor.id, courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", instructor.id)
        .neq("course_id", courseId)
        .eq("status", "published")
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Instructor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={instructor.profile_picture_url} />
            <AvatarFallback>
              {instructor.first_name?.[0]}
              {instructor.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {instructor.first_name} {instructor.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{instructor.email}</p>
          </div>
        </div>

        {otherCourses.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Other Courses by {instructor.first_name}</h4>
            <div className="space-y-4">
              {otherCourses.map((course: any) => (
                <CourseCard
                  key={course.course_id}
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};