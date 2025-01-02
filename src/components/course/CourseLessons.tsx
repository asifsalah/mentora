import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import LessonList from "./LessonList";
import VideoPlayer from "./VideoPlayer";

interface CourseLessonsProps {
  courseId: string;
}

export const CourseLessons = ({ courseId }: CourseLessonsProps) => {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      console.log("Fetching lessons for course:", courseId);
      
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          materials:lesson_materials(count),
          quizzes:quizzes(count),
          child_lessons:lessons!parent_lesson_id(
            *,
            materials:lesson_materials(count),
            quizzes:quizzes(count)
          )
        `)
        .eq("course_id", courseId)
        .is("parent_lesson_id", null)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error);
        throw error;
      }
      
      console.log("Fetched lessons:", data);
      return data || [];
    },
  });

  const { data: lessonDetails = {} } = useQuery({
    queryKey: ["lesson-details", courseId],
    queryFn: async () => {
      console.log("Fetching lesson details for course:", courseId);
      
      const { data: lessonIds } = await supabase
        .from("lessons")
        .select("lesson_id")
        .eq("course_id", courseId);

      if (!lessonIds?.length) return {};

      const { data, error } = await supabase
        .from("lessons")
        .select(`
          lesson_id,
          materials:lesson_materials(*),
          quizzes:quizzes(*)
        `)
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching lesson details:", error);
        throw error;
      }
      
      console.log("Fetched lesson details:", data);
      return data.reduce((acc: any, lesson) => {
        acc[lesson.lesson_id] = {
          materials: lesson.materials,
          quizzes: lesson.quizzes,
        };
        return acc;
      }, {});
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading lessons: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!lessons.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No lessons found for this course.
        </AlertDescription>
      </Alert>
    );
  }

  // If no lesson is selected, select the first one
  if (!selectedLesson && lessons.length > 0) {
    setSelectedLesson(lessons[0]);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="order-2 md:order-1">
        <LessonList
          lessons={lessons}
          lessonDetails={lessonDetails}
          onSelectLesson={setSelectedLesson}
          selectedLessonId={selectedLesson?.lesson_id}
        />
      </div>
      <div className="order-1 md:order-2">
        {selectedLesson && (
          <VideoPlayer
            videoUrl={selectedLesson.video_url}
            title={selectedLesson.title}
          />
        )}
      </div>
    </div>
  );
};