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
      const [lessons, materials, quizzes] = await Promise.all([
        supabase
          .from("lessons")
          .select("lesson_id", { count: "exact" })
          .eq("course_id", courseId),
        supabase
          .from("lesson_materials")
          .select("material_id", { count: "exact" })
          .eq("lesson_id", { in: `(SELECT lesson_id FROM lessons WHERE course_id = '${courseId}')` }),
        supabase
          .from("quizzes")
          .select("quiz_id", { count: "exact" })
          .eq("course_id", courseId),
      ]);

      return {
        lessons: lessons.count || 0,
        materials: materials.count || 0,
        quizzes: quizzes.count || 0,
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