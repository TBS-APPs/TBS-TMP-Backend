import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMobileAppThemePaletteDto } from './dto/create-mobile-app-theme-palette.dto';
import { UpdateMobileAppThemePaletteDto } from './dto/update-mobile-app-theme-palette.dto';
import { MobileAppThemesService } from './mobile-app-themes.service';

@ApiTags('mobile-app-themes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('mobile-app-themes')
export class MobileAppThemesController {
  constructor(private readonly mobileAppThemesService: MobileAppThemesService) {}

  @Post()
  create(@Body() dto: CreateMobileAppThemePaletteDto) {
    return this.mobileAppThemesService.create(dto);
  }

  @Get()
  findAll() {
    return this.mobileAppThemesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mobileAppThemesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMobileAppThemePaletteDto,
  ) {
    return this.mobileAppThemesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mobileAppThemesService.remove(id);
  }
}
