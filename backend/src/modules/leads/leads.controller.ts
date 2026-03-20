import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { CreateLeadDto, UpdateLeadDto, LeadFilterDto } from "./leads.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("leads")
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filters: LeadFilterDto) {
    return this.service.findAll(filters);
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.service.getStats();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findById(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() dto: UpdateLeadDto) {
    return this.service.update(id, dto);
  }
}
