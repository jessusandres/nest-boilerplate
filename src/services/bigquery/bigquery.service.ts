import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* Extra */
import { BigQuery, type Job, type JobResponse } from '@google-cloud/bigquery';

@Injectable()
export class BigqueryService {
  private readonly logger: Logger = new Logger(BigqueryService.name);
  private readonly bigQuery: BigQuery;
  private readonly projectId: string;
  private readonly dataset: string;
  private readonly table: string;

  constructor(private readonly configService: ConfigService) {
    this.bigQuery = new BigQuery({
      location: this.configService.get('BQ_LOCATION'),
      projectId: this.configService.get('BQ_PROJECT'),
    });

    this.table = this.configService.get('BQ_TABLE');
    this.projectId = this.configService.get('BQ_PROJECT');
    this.dataset = this.configService.get('BQ_DATASET');
  }

  private async createQueryJob(query: string) {
    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/Job
    const options = {
      configuration: {
        query: {
          query,
          useLegacySql: false,
        },
      },
    };

    // Make API request.
    const response: JobResponse = await this.bigQuery.createJob(options);

    // Job data
    const job: Job = response[0];

    const [rows] = await job.getQueryResults(job);

    return rows;
  }

  async performJob() {
    this.logger.debug(
      'Perform query to: ',
      JSON.stringify({
        projectId: this.bigQuery.projectId,
        location: this.bigQuery.location,
        projectName: this.projectId,
        dataset: this.dataset,
        table: this.table,
      }),
    );

    const query = `SELECT *
       FROM \`${this.projectId}.${this.dataset}.${this.table}\`
       WHERE upload_date = "2023-10-23" LIMIT 10`;

    return this.createQueryJob(query);
  }

  async performDemoJob() {
    const exampleQuery = `SELECT country_name 
                FROM \`demo-project.demo_dataset.demo_table\` 
                LIMIT 5`;

    return this.createQueryJob(exampleQuery);
  }
}
