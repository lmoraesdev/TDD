import {
  DbAddTask,
  MongoManager,
  TaskMongoRepository,
} from "../../../dataSources";
import { Task } from "../../../entities/task";
import { AddTask, AddTaskModel } from "../../../usecases";
import { addTaskValidationCompositeFactory } from "../../factories";
import { HttpRequest, Validation } from "../../interfaces";
import env from "../../presentations/api/config/env";
import { AddTaskController } from "./addTask";

const makeAddTask = (): AddTask => {
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
  return new AddTaskStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error | void {
      return;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  addTaskStub: AddTask;
  validationStub: Validation;
  sut: AddTaskController;
}

const makeSut = (): SutTypes => {
  const addTaskStub = makeAddTask();
  const validationStub = makeValidation();
  const sut = new AddTaskController(addTaskStub, validationStub);
  return {
    addTaskStub,
    validationStub,
    sut,
  };
};

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    },
  };
};

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const { sut, addTaskStub } = makeSut();

    const addSpy = jest.spyOn(addTaskStub, "add");

    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    });
  });
});
