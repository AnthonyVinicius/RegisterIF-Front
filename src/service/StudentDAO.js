import GenericDAO from "./GenericDAO";
import { ApiRegistry } from "../api/ApiRegistry";

class StudentDAO extends GenericDAO {
  constructor() {
    super(ApiRegistry.pontoIF, "/user/students");
  }

  async getById(id) {
    const response = await this.api.get(`/user/student/${id}`);
    return response.data;
  }
}

export default new StudentDAO();
