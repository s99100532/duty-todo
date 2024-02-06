import DutyRepository from "../repositories/dutyRepository";
import z from "zod";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "ValidationError"; // (2)
  }
}

const CreateDutyPayload = z.object({
  name: z.string().min(3),
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
  getDutyById(id: string) {
    const zresult = z.string().uuid().safeParse(id);

    if (!zresult.success) {
      console.log(zresult.error.issues);

      throw new ValidationError(
        zresult.error.issues
          .map(({ path, message }) => `${path}: ${message}`)
          .join(",")
      );
    }
    return this.dutyRepository.getDutyById(id);
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
