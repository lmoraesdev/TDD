import { ObjectId } from "mongodb";
import { Task } from "../../../entities/task";
import {
  AddTaskModel,
  DeleteTaskModel,
  AddTaskRepository,
  DeleteTaskRepository,
} from "../../../usecases";
import { MongoManager } from "../../config/mongoManager";
import {
  InvalidParamError,
  NotFoundError,
} from "../../../adapters/presentations/api/errors";
import { ListTasksRepository } from "../../../usecases/repository/listTasksRepository";

export class TaskMongoRepository
  implements AddTaskRepository, DeleteTaskRepository, ListTasksRepository
{
  async add(taskData: AddTaskModel): Promise<Task> {
    const taskCollection = MongoManager.getInstance().getCollection("tasks");
    const { insertedId } = await taskCollection.insertOne(taskData);
    const taskById = await taskCollection.findOne({ _id: insertedId });
    if (!taskById) throw new Error("Task not found");

    const task: Task = {
      id: taskById._id.toHexString(),
      title: taskById.title,
      description: taskById.description,
      date: taskById.date,
    };
    return task;
  }

  async delete(taskData: DeleteTaskModel): Promise<void | Error> {
    const taskCollection = MongoManager.getInstance().getCollection("tasks");

    if (!ObjectId.isValid(taskData.id)) {
      return new InvalidParamError(taskData.id);
    }
    const { deletedCount } = await taskCollection.deleteOne({
      _id: new ObjectId(taskData.id),
    });
    if (!deletedCount) return new NotFoundError("task");
  }

  async list(): Promise<Task[]> {
    const taskCollection = MongoManager.getInstance().getCollection("tasks");
    const tasks = await taskCollection.find().toArray();
    const tasksFormatted = tasks.map((task) => {
      return {
        id: task._id.toHexString(),
        title: task.title,
        description: task.description,
        date: task.date,
      };
    });
    return tasksFormatted;
  }
}
