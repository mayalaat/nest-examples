import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerService {
  supplyPower(watts: number): void {
    console.log(`Supplying ${watts} worth of power.`);
  }
}
