import { config } from "dotenv";
import express from "express";
import pg from "pg-promise";
import { z } from "zod";
import { ErrorMessage } from "./contants";
import DutyRepository from "./repositories/dutyRepository";
import DutyService, { ValidationError } from "./services/dutyService";
import { APIResponse } from "../../shared/types";
import initLog from "pino";
import cors from "cors";

config({
  path: ".env." + process.env.NODE_ENV,
});

const app = express();

app.use(express.json());
app.use(cors());

const envSchema = z.object({
  PORT: z.coerce.number().min(0).max(65536),
  DB_URL: z.string().min(1),
});

const values = envSchema.parse({
  PORT: process.env.PORT || "-1",
  DB_URL: process.env.DB_URL,
});

const port = values.PORT;

const pgp = pg();
const db = pgp(values.DB_URL);

const logger = initLog();

const dutyRepository = new DutyRepository(db);

const dutyService = new DutyService(dutyRepository);

app.post("/duty", async (req, res) => {
  const payload = req.body;

  const resp: APIResponse = await (async () => {
    try {
      const duty = await dutyService.createDuty(payload);

      return {
        message: "",
        success: true,
        data: duty,
      };
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : ErrorMessage.UNKNOWN_ERROR,
        success: false,
        data: null,
      };
    }
  })();

  res.json(resp);
});

app.get("/duties", async (req, res) => {
  const resp: APIResponse = await (async () => {
    try {
      const data = await dutyService.listDuties({
        pageSize: req.query.pageSize,
        cursor: req.query.cursor,
      });
      if (!data) {
        return {
          message: ErrorMessage.DUTY_NOT_FOUND,
          success: false,
          data: null,
        };
      } else {
        return {
          message: "",
          success: true,
          data,
        };
      }
    } catch (error) {
      return {
        message:
          error instanceof ValidationError
            ? error.message
            : ErrorMessage.UNKNOWN_ERROR,
        success: false,
        data: null,
      };
    }
  })();

  res.json(resp);
});

app.patch("/duty/:id", async (req, res) => {
  const payload = req.body;
  const updateID = req.params.id;

  const resp: APIResponse = await (async () => {
    try {
      const duty = await dutyService.updateDuty(updateID, payload);

      if (!duty) {
        return {
          message: ErrorMessage.DUTY_NOT_FOUND,
          success: false,
          data: null,
        };
      }

      return {
        message: "",
        success: true,
        data: duty,
      };
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : ErrorMessage.UNKNOWN_ERROR,
        success: false,
        data: null,
      };
    }
  })();

  res.json(resp);
});

app.delete("/duty/:id", async (req, res) => {
  const deleteID = req.params.id;

  const resp: APIResponse = await (async () => {
    try {
      await dutyService.deleteDuty(deleteID);

      return {
        success: true,
        data: null,
        message: "",
      };
    } catch (error) {
      return {
        message:
          error instanceof ValidationError
            ? ErrorMessage.INVALID_ID
            : ErrorMessage.UNKNOWN_ERROR,
        success: false,
        data: null,
      };
    }
  })();

  res.json(resp);
});

const server = app.listen(port, () => {
  logger.info(`listening on ${port}`);
});

export { app, db, server };
