import { DynamicModule, Module, Provider } from '@nestjs/common';
import algoliasearch from 'algoliasearch';
import { ALGOLIA_CLIENT } from 'src/common/constants';

@Module({})
export class AlgoliaModule {
  static forRoot(appId: string, apiKey: string): DynamicModule {
    const algoliaClient = algoliasearch(appId, apiKey);

    const algoliaProvider: Provider = {
      provide: ALGOLIA_CLIENT,
      useValue: algoliaClient,
    };

    return {
      providers: [algoliaProvider],
      module: AlgoliaModule,
      global: true,
      exports: [algoliaProvider],
    };
  }
}
