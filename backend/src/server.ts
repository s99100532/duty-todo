import express from "express";
import { config } from "dotenv";
import { z } from "zod";
import DutyRepository from "./repositories/dutyRepository";
import DutyService, { ValidationError } from "./services/dutyService";
import { ErrorMessage } from "./contants";
import { APIResponse } from "./types";

config({
  path: ".env." + process.env.NODE_ENV,
});

const app = express();

app.use(express.json());

const envSchema = z.object({
  PORT: z.coerce.number().min(0).max(65536),
});

envSchema.parse({
  PORT: process.env.PORT || "-1",
});

const port = process.env.PORT;

const dutyRepository = new DutyRepository();

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

app.get("/duty/:id", async (req, res) => {
  const resp: APIResponse = await (async () => {
    try {
      const data = await dutyService.getDutyById(req.params.id);
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
            ? ErrorMessage.INVALID_ID
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
          error instanceof Error ? error.message : ErrorMessage.UNKNOWN_ERROR,
        success: false,
        data: null,
      };
    }
  })();

  res.json(resp);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
