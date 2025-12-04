import GenericDAO from "./GenericDAO";
import { pontoIfApi } from "../api/pontoIfApi";

class CourseSubjectDAO extends GenericDAO {
  constructor() {
    super(pontoIfApi, "/course-subjects");
  }

  async getByCourse(courseId) {
    return this.get(`/course/${courseId}`);
  }
}

export default new CourseSubjectDAO();
