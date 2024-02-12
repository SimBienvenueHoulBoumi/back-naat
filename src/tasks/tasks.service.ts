import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.taskRepository.save(newTask);
  }

  findAll() {
    return this.taskRepository.find();
  }

  findOne(id: string) {
    return this.taskRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.update(id, updateTaskDto);
  }

  remove(id: string) {
    return this.taskRepository.delete(id);
  }
}
