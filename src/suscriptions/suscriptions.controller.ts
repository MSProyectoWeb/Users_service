import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SubscriptionsService } from './suscriptions.service';
import { CreateSubscriptionDto } from '../dto/create-suscription.dto';
import { TipoSuscripcion } from '@prisma/client';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @MessagePattern({ cmd: 'create_subscription' })
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      return await this.subscriptionsService.create(createSubscriptionDto);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'find_all_subscriptions' })
  async findAll() {
    try {
      return await this.subscriptionsService.findAll();
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'find_one_subscription' })
  async findOne(data: { id: number }) {
    try {
      return await this.subscriptionsService.findOne(data.id);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'find_subscription_by_user_id' })
  async findByUserId(data: { userId: number }) {
    try {
      return await this.subscriptionsService.findByUserId(data.userId);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'delete_subscription' })
  async remove(data: { id: number }) {
    try {
      return await this.subscriptionsService.remove(data.id);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'renovar_subscription' })
  async renovar(data: { id: number; tipoSuscripcion: TipoSuscripcion }) {
    try {
      return await this.subscriptionsService.renovar(data.tipoSuscripcion, data.id);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}