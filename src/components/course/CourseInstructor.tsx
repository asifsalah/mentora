import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/CourseCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CourseInstructorProps {
  instructor: any;
  courseId: string;
}

export const CourseInstructor = ({ instructor, courseId }: CourseInstructorProps) => {
  // Fetch instructor profile data
  const { data: instructorProfile, isLoading } = useQuery({
    queryKey: ["instructor-profile", instructor?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", instructor?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!instructor?.id,
  });

  const { data: otherCourses = [], isError } = useQuery({
    queryKey: ["instructor-courses", instructor?.id, courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", instructor?.id)
        .neq("course_id", courseId)
        .eq("status", "published")
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!instructor?.id && !!courseId,
  });

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About the Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Return early if no instructor data
  if (!instructorProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About the Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Instructor information not available
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Instructor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={instructorProfile.profile_picture_url} />
            <AvatarFallback>
              {instructorProfile.first_name?.[0]}
              {instructorProfile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {instructorProfile.first_name} {instructorProfile.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{instructorProfile.email}</p>
          </div>
        </div>

        {otherCourses.length > 0 && !isError && (
          <div className="space-y-4">
            <h4 className="font-semibold">Other Courses by {instructorProfile.first_name}</h4>
            <div className="space-y-4">
              {otherCourses.map((course: any) => (
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};