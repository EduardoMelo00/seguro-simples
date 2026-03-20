import { Controller, Get, Query } from "@nestjs/common";
import { HospitalsService } from "./hospitals.service";

@Controller("hospitals")
export class HospitalsController {
  constructor(private readonly service: HospitalsService) {}

  @Get()
  findAll(
    @Query("city") city?: string,
    @Query("operator") operator?: string,
  ) {
    return this.service.findAll({ city, operator });
  }

  @Get("cities")
  getCities() {
    return this.service.getCities();
  }
}
