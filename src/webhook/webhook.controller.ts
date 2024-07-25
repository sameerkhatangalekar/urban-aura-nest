import { Body, Controller, Headers, HttpCode, HttpStatus, Post, RawBodyRequest, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('webhook')
@ApiTags('Stripe webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Public()
  async handleWebhookNotification(@Req() request: RawBodyRequest<Request>) {
    this.webhookService.handleWebhookNotification(request.headers['stripe-signature'], request.rawBody.toString());
    return;
  }
}
