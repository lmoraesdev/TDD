import {
  DbAddTask,
  MongoManager,
  TaskMongoRepository,
} from "../../../dataSources";
import { Task } from "../../../entities/task";
import { AddTask, AddTaskModel } from "../../../usecases";
import { addTaskValidationCompositeFactory } from "../../factories";
import { Validation } from "../../interfaces";
import env from "../../presentations/api/config/env";
import { AddTaskController } from "./addTask";

class AddTaskStub implements AddTask {
  async add(task: AddTaskModel): Promise<Task> {
    return {
      id: "any_id",
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    };
  }
}

class ValidationStub implements Validation {
  validate(data: any): Error | void {
    return;
  }
}

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const httpRequest = {
      body: {
        title: "any_title",
        description: "any_description",
        date: "30/06/2024",
      },
    };

    const addTaskController = new AddTaskController(
      new AddTaskStub(),
      new ValidationStub()
    );

    const httpResponse = await addTaskController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body.title).toBe("any_title");
    expect(httpResponse.body.description).toBe("any_description");
    expect(httpResponse.body.date).toBe("30/06/2024");
  });
});
