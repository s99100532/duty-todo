import pg from "pg-promise";
import { Duty } from "../types";

type CreateDutyInput = {
  name: string;
};
type UpdateDutyInput = {
  name: string;
};

const pgp = pg();
const db = pgp("postgres://postgres:example@localhost:5432/postgres");

class DutyRepository {
  tableName: string;
  dbClient: typeof db;
  constructor() {
    this.tableName = "duties";
    this.dbClient = db;
  }

  async getDutyById(id: string) {
    const data = await db.oneOrNone<Duty>(
      "select * from duties where id = $1",
      id
    );

    return data;
  }

  async createDuty(data: CreateDutyInput) {
    try {
      const stmt =
        pgp.helpers.insert(data, null, this.tableName) + " RETURNING *";

      const values = pgp.helpers.values(data);

      const result = await this.dbClient.one<Duty>(stmt, values);

      return result;
    } catch (error) {
      if (
        error instanceof pgp.errors.ParameterizedQueryError ||
        error instanceof pgp.errors.PreparedStatementError ||
        error instanceof pgp.errors.QueryResultError
      ) {
        throw new Error(error.message);
      } else {
        throw new Error("unknown database error");
      }
    }
  }

  async updateDuty(id: string, data: UpdateDutyInput) {
    try {
      const condition = pgp.as.format(" WHERE id = ${id} RETURNING *", {
        id,
      });

      const stmt = pgp.helpers.update(data, null, "duties") + condition;
      const result = await db.one(stmt, pgp.helpers.values(data));

      return result;
    } catch (error) {
      if (
        error instanceof pgp.errors.ParameterizedQueryError ||
        error instanceof pgp.errors.PreparedStatementError ||
        error instanceof pgp.errors.QueryResultError
      ) {
        throw new Error(error.message);
      } else {
        throw new Error("unknown database error");
      }
    }
  }
  async deleteDuty(id: string) {
    try {
      const result = (await db.one(
        "WITH deleted AS (DELETE FROM duties WHERE id = $1 RETURNING *) SELECT count(*) FROM deleted",
        id
      )) as { count: string };

      return result;
    } catch (error) {
      if (
        error instanceof pgp.errors.ParameterizedQueryError ||
        error instanceof pgp.errors.PreparedStatementError ||
        error instanceof pgp.errors.QueryResultError
      ) {
        throw new Error(error.message);
      } else {
        throw new Error("unknown database error");
      }
    }
  }
}

export default DutyRepository;
