import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CourseLessons } from "@/components/course/CourseLessons";

const CourseLessonsPage = () => {
  const { courseId } = useParams();

  if (!courseId) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <CourseLessons courseId={courseId} />
      </div>
    </Layout>
  );
};

export default CourseLessonsPage;