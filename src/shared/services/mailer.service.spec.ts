import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

/* Project */
import { MailerService } from './mailer.service';

describe('MailerService', () => {
  let mailerService: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [MailerService, ConfigService],
    }).compile();

    mailerService = module.get<MailerService>(MailerService);

    await module.init();
  });

  it('should be defined', () => {
    expect(mailerService).toBeDefined();
  });

  it('should "send" works', async () => {
    const payload = {
      content: undefined,
      html: undefined,
      templateId: 'id-123',
      text: undefined,
      to: 'testclient@test.cl',
      from: 'test@test.cl',
      subject: 'Error on publish order',
      attachments: [],
      dynamicTemplateData: {},
    };

    const result = await mailerService.send(payload);

    expect(result).toBeDefined();
  });
});
