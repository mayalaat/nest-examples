import { Controller, Get } from '@nestjs/common';
import { CpuService } from 'src/cpu/cpu.service';
import { DiskService } from 'src/disk/disk.service';

@Controller('computer')
export class ComputerController {
  constructor(
    private cpuSevice: CpuService,
    private diskService: DiskService,
  ) {}

  @Get()
  run(): (string | number)[] {
    return [this.cpuSevice.compute(1, 2), this.diskService.getDate()];
  }
}
