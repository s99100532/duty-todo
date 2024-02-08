import { Duty } from "../../../shared/types";
import pg from "pg-promise";

type CreateDutyInput = {
  name: string;
};
type UpdateDutyInput = {
  name: string;
};

type ListDutyParams = {
  cursor?: string;
  pageSize: number;
};

class DutyRepository {
  tableName: string;
  dbClient: pg.IDatabase<{}>;
  constructor(db: pg.IDatabase<{}>) {
    this.tableName = "duties";
    this.dbClient = db;
  }

  async listDuties(params: ListDutyParams) {
    const { cursor, pageSize } = params;

    let stmt = "select * from duties";

    const values: (string | number)[] = [];

    if (cursor) {
      stmt += " where id < $1";
      values.push(cursor);
    }

    stmt += ` order by id desc limit ${cursor ? "$2" : "$1"}`;
    values.push(pageSize);

    const data = await this.dbClient.manyOrNone<Duty>(stmt, values);

    return data;
  }

  async createDuty(data: CreateDutyInput) {
    const { pgp } = this.dbClient.$config;

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
    const { pgp } = this.dbClient.$config;

    try {
      const condition = pgp.as.format(" WHERE id = ${id} RETURNING *", {
        id,
      });

      const stmt = pgp.helpers.update(data, null, "duties") + condition;
      const result = await this.dbClient.one(stmt, pgp.helpers.values(data));

      return result;
    } catch (error) {
      if (error instanceof pgp.errors.QueryResultError && error.received == 0) {
        return null;
      } else if (
        error instanceof pgp.errors.ParameterizedQueryError ||
        error instanceof pgp.errors.PreparedStatementError
      ) {
        throw new Error(error.message);
      } else {
        throw new Error("unknown database error");
      }
    }
  }
  async deleteDuty(id: string) {
    const { pgp } = this.dbClient.$config;

    try {
      return this.dbClient.none("DELETE FROM duties WHERE id = $1", id);
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
