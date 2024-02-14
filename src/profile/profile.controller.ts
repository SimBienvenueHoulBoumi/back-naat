import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'get user information' })
  findOne(@Request() req) {
    return this.profileService.findOne(req.user.username);
  }

  @Patch()
  @ApiOperation({ summary: 'update user information' })
  update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(req.username, updateProfileDto);
  }
}
