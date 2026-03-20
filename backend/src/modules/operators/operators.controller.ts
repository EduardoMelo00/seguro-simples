import { Controller, Get } from "@nestjs/common";
import { OperatorsService } from "./operators.service";

@Controller("operators")
export class OperatorsController {
  constructor(private readonly service: OperatorsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
