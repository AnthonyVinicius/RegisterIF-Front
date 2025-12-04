import GenericDAO from "./GenericDAO";
import { pontoIfApi } from "../api/pontoIfApi";

class SubjectDAO extends GenericDAO {
  constructor() {
    super(pontoIfApi, "/api/subjects");
  }
}

export default new SubjectDAO();
