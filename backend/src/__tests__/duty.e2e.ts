import { describe, it, expect, afterAll } from "@jest/globals";
import request from "supertest";
import { app, db, server } from "../server";
import { ErrorMessage, Validation } from "../contants";

const generateSeeds = () => {
  const testDuty = {
    name: "test duty " + Math.random(),
  };
  return testDuty;
};

afterAll(async () => {
  await db.$pool.end();
  server.close();
});

describe("Get Duty", () => {
  it("should return duty", async () => {
    const testDuty = generateSeeds();
    const result = await db.one(
      "INSERT INTO duties VALUES (DEFAULT, $1) RETURNING *",
      testDuty.name
    );

    const resp = await request(app).get(`/duty/${result.id}`).expect(200);

    await expect(resp.body).toMatchObject({
      success: true,
      message: "",
      data: {
        ...testDuty,
        id: result.id,
      },
    });
  });

  it("should return error for invalid id", async () => {
    const invalidID = "123457";
    const resp = await request(app).get(`/duty/${invalidID}`).expect(200);

    await expect(resp.body).toMatchObject({
      message: ErrorMessage.INVALID_ID,
      success: false,
      data: null,
    });
  });

  it("should return error for id not found", async () => {
    const nonexistID = crypto.randomUUID();
    const resp = await request(app).get(`/duty/${nonexistID}`).expect(200);

    await expect(resp.body).toMatchObject({
      message: ErrorMessage.DUTY_NOT_FOUND,
      success: false,
      data: null,
    });
  });
});

describe("Create Duty", () => {
  it("should create duty", async () => {
    const testDuty = generateSeeds();

    const resp = await request(app).post("/duty").send(testDuty).expect(200);

    await expect(resp.body).toMatchObject({
      message: "",
      success: true,
      data: {
        ...testDuty,
        id: resp.body.data.id,
      },
    });

    const result = await db.one(
      "SELECT id from duties where id = $1",
      resp.body.data.id
    );

    await expect(
      db.one("SELECT id from duties where id = $1", resp.body.data.id)
    ).resolves.toStrictEqual({ id: resp.body.data.id });
  });
  it("should return error for invalid input", async () => {
    const testDuty = {
      name: "",
    };

    const resp = await request(app).post("/duty").send(testDuty).expect(200);

    await expect(resp.body).toEqual({
      message: `name: String must contain at least ${Validation.DUTY_NAME_MIN_LEN} character(s)`,
      success: false,
      data: null,
    });
  });
});

describe("Update Duty", () => {
  it("should update duty", async () => {
    const testDuty = generateSeeds();
    const result = await db.one(
      "INSERT INTO duties VALUES (DEFAULT, $1) RETURNING *",
      testDuty.name
    );

    const newName = "new test duty" + Math.random();

    const resp = await request(app)
      .patch(`/duty/${result.id}`)
      .send({
        name: newName,
      })
      .expect(200);

    await expect(resp.body).toEqual({
      message: "",
      success: true,
      data: {
        id: result.id,
        name: newName,
      },
    });
  });
  it("should return error for non exist duty", async () => {
    const resp = await request(app)
      .patch(`/duty/${crypto.randomUUID()}`)
      .send({
        name: "xxxx",
      })
      .expect(200);

    await expect(resp.body).toEqual({
      message: ErrorMessage.DUTY_NOT_FOUND,
      success: false,
      data: null,
    });
  });

  it("should return error for invalid input", async () => {
    const resp = await request(app)
      .patch(`/duty/${crypto.randomUUID()}`)
      .send({})
      .expect(200);

    await expect(resp.body).toEqual({
      message: `name: Required`,
      success: false,
      data: null,
    });
  });
});

describe("Delete Duty", () => {
  it("should delete duty", async () => {
    const testDuty = generateSeeds();
    const result = await db.one(
      "INSERT INTO duties VALUES (DEFAULT, $1) RETURNING *",
      testDuty.name
    );

    await expect(
      db.one("SELECT id from duties where id = $1", result.id)
    ).resolves.toStrictEqual({ id: result.id });

    const resp = await request(app).delete(`/duty/${result.id}`).expect(200);

    expect(resp.body).toMatchObject({
      message: "",
      success: true,
      data: null,
    });

    await expect(
      db.one("SELECT id from duties where id = $1", result.id)
    ).rejects.toThrowError(db.$config.pgp.errors.QueryResultError);
  });
  it("should return error for invalid id", async () => {


    const resp = await request(app).delete(`/duty/123456`).expect(200);

    expect(resp.body).toMatchObject({
      message: ErrorMessage.INVALID_ID,
      success: false,
      data: null,
    });

  });
});
