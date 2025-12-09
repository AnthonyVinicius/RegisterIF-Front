import GenericDAO from "./GenericDAO";
import { ApiRegistry } from "../api/ApiRegistry";

class EnrollementDAO extends GenericDAO {
  constructor() {
    super(ApiRegistry.pontoIF, "/enrollement");
  }
}

export default new EnrollementDAO();
