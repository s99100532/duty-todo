import { Validation } from "../contants";
import DutyRepository from "../repositories/dutyRepository";
import z from "zod";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const CreateDutyPayload = z.object({
  name: z.string().min(Validation.DUTY_NAME_MIN_LEN),
});

const ListDutyPaylad = z.object({
  cursor: z.string().uuid().optional(),
  pageSize: z.coerce.number().min(1).max(30),
});

const UpdateDutyPayload = z
  .object({
    name: z.string().optional(),
  })
  .required();

class DutyService {
  dutyRepository: DutyRepository;
  constructor(repository: DutyRepository) {
    this.dutyRepository = repository;
  }
  async listDuties(payload: unknown) {
    const zresult = ListDutyPaylad.safeParse(payload);

    if (!zresult.success) {
      throw new ValidationError(
        zresult.error.issues
          .map(({ path, message }) => `${path}: ${message}`)
          .join(",")
      );
    }

    const duties = await this.dutyRepository.listDuties(zresult.data);

    return {
      items: duties,
      pagination: {
        cursor: duties.length > 0 ? duties[duties.length - 1].id : null,
      },
    };
  }
  createDuty(payload: unknown) {
    const zresult = CreateDutyPayload.safeParse(payload);

    if (!zresult.success) {
      throw new ValidationError(
        zresult.error.issues
          .map(({ path, message }) => `${path}: ${message}`)
          .join(",")
      );
    }
    return this.dutyRepository.createDuty(zresult.data);
  }
  updateDuty(id: string, payload: unknown) {
    const zresult = UpdateDutyPayload.safeParse(payload);
    if (!zresult.success) {
      throw new ValidationError(
        zresult.error.issues
          .map(({ path, message }) => `${path}: ${message}`)
          .join(",")
      );
    }
    return this.dutyRepository.updateDuty(id, zresult.data);
  }
  deleteDuty(id: string) {
    const zresult = z.string().uuid().safeParse(id);

    if (!zresult.success) {
      throw new ValidationError(
        zresult.error.issues
          .map(({ path, message }) => `${path}: ${message}`)
          .join(",")
      );
    }
    return this.dutyRepository.deleteDuty(id);
  }
}

export default DutyService;
