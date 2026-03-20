import { Controller, Get, Param, Query } from "@nestjs/common";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
  constructor(private readonly service: PlansService) {}

  @Get()
  findAll(
    @Query("operator") operator?: string,
    @Query("tier") tier?: string,
    @Query("coverage") coverage?: string,
    @Query("room") room?: string,
  ) {
    return this.service.findAll({ operator, tier, coverage, room });
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }
}
