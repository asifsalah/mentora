import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, FileText, GraduationCap } from "lucide-react";

interface CourseStatsProps {
  courseId: string;
}

export const CourseStats = ({ courseId }: CourseStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ["course-stats", courseId],
    queryFn: async () => {
      // First get lesson IDs
      const { data: lessons } = await supabase
        .from("lessons")
        .select("lesson_id")
        .eq("course_id", courseId);

      const lessonIds = lessons?.map(lesson => lesson.lesson_id) || [];

      // Then get the counts
      const [lessonCount, materialsCount, quizzesCount] = await Promise.all([
        supabase
          .from("lessons")
          .select("*", { count: "exact", head: true })
          .eq("course_id", courseId),
        lessonIds.length > 0 
          ? supabase
              .from("lesson_materials")
              .select("*", { count: "exact", head: true })
              .in("lesson_id", lessonIds)
          : Promise.resolve({ count: 0 }),
        supabase
          .from("quizzes")
          .select("*", { count: "exact", head: true })
          .eq("course_id", courseId),
      ]);

      return {
        lessons: lessonCount.count || 0,
        materials: materialsCount.count || 0,
        quizzes: quizzesCount.count || 0,
      };
    },
  });

  const items = [
    {
      title: "Total Lessons",
      value: stats?.lessons || 0,
      icon: Book,
    },
    {
      title: "Course Materials",
      value: stats?.materials || 0,
      icon: FileText,
    },
    {
      title: "Quizzes",
      value: stats?.quizzes || 0,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};