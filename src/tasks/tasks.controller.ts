import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITask, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() filterDto: FilterTaskDto): ITask[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getFilteredTasks(filterDto);
    }
    return this.tasksService.getTasks();
  }

  @Get('/:id')
  getTask(@Param('id') id: string): ITask {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() taskDto: CreateTaskDto): ITask {
    return this.tasksService.createTask(taskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusTaskDto: UpdateTaskDto,
  ): ITask {
    const { status } = updateStatusTaskDto;
    return this.tasksService.updateTask(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    return this.tasksService.deleteTask(id);
  }
}
