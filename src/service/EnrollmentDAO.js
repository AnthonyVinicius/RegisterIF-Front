import GenericDAO from "./GenericDAO";
import { ApiRegistry } from "../api/ApiRegistry";

class EnrollmentDAO extends GenericDAO {
  constructor() {
    super(ApiRegistry.pontoIF, "/enrollement");
  }

  async getByStudent(studentId) {
    return this.api.get(`/enrollement/student/${studentId}`).then(r => r.data);
  }
}

export default new EnrollmentDAO();
