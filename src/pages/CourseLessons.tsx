import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CourseLessons as CourseLessonsList } from "@/components/course/CourseLessons";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CourseLessonsPage = () => {
  const { courseId } = useParams();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("course_id", courseId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  if (!courseId) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Course ID is required</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading course: {error.message}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground mt-2">{course.description}</p>
          )}
        </div>
        <CourseLessonsList courseId={courseId} />
      </div>
    </Layout>
  );
};

export default CourseLessonsPage;