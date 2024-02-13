import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const tasks = await service.findAll();
      expect(tasks).toBeInstanceOf(Task);
    });
  });
});
