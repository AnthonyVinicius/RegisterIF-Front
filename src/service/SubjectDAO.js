import GenericDAO from "./GenericDAO";
import { pontoIfApi } from "../api/pontoIfApi";

class SubjectDAO extends GenericDAO {
  constructor() {
    super(pontoIfApi, "/api/subjects");
  }

  async getByCourse(courseId) {
    return this.api
      .get(`/api/subjects/course/${courseId}/`)
      .then((res) => res.data);
  }
}

export default new SubjectDAO();
