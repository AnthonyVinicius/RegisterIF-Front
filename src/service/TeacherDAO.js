import GenericDAO from "./GenericDAO";
import { ApiRegistry } from "../api/ApiRegistry"; 

class TeacherDAO extends GenericDAO {
  constructor() {
    super(ApiRegistry.pontoIF, "/user/teacher");
  }
}

export default new TeacherDAO();
