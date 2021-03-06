import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getTasks(): ITask[] {
    return this.tasks;
  }

  getTaskById(id: string): ITask {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found;
  }

  getFilteredTasks(filterDto: FilterTaskDto): ITask[] {
    const tasks = this.getTasks();
    const { status, search } = filterDto;

    if (status) {
      return tasks.filter((task) => task.status === status);
    }

    if (search) {
      return tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  createTask(taskDto: CreateTaskDto): ITask {
    const { title, description } = taskDto;

    const task: ITask = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTask(id: string, status: TaskStatus): ITask {
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
