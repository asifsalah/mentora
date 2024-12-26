import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseLessons } from "@/components/course/CourseLessons";
import { CourseStats } from "@/components/course/CourseStats";
import { CourseInstructor } from "@/components/course/CourseInstructor";
import { RelatedCourses } from "@/components/course/RelatedCourses";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CourseDetails = () => {
  const { courseId } = useParams();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      console.log("Fetching course with ID:", courseId);
      
      // First get the course data
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("course_id", courseId)
        .maybeSingle();

      if (courseError) {
        console.error("Error fetching course:", courseError);
        throw courseError;
      }
      
      if (!courseData) {
        console.log("No course found with ID:", courseId);
        return null;
      }

      console.log("Course data fetched:", courseData);
      console.log("Fetching instructor with ID:", courseData.instructor_id);

      // Then get the instructor profile data
      const { data: instructorData, error: instructorError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", courseData.instructor_id)
        .maybeSingle();

      if (instructorError) {
        console.error("Error fetching instructor:", instructorError);
        // Don't throw the error, just log it
        return {
          ...courseData,
          instructor: null
        };
      }

      console.log("Instructor data fetched:", instructorData);

      // Combine the data, handling the case where instructor might be null
      const fullCourseData = {
        ...courseData,
        instructor: instructorData || null
      };

      console.log("Full course data:", fullCourseData);
      return fullCourseData;
    },
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <Skeleton className="h-[400px] w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
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
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="text-muted-foreground">
            The course you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <CourseHeader course={course} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CourseLessons courseId={course.course_id} />
            <CourseStats courseId={course.course_id} />
          </div>
          
          <div className="space-y-8">
            <CourseInstructor 
              instructor={course.instructor} 
              courseId={course.course_id} 
            />
            <RelatedCourses 
              currentCourseId={course.course_id} 
              categoryIds={course.category_ids} 
              instructorId={course.instructor_id}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetails;