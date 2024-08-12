import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FIREBASE_CLIENT } from 'src/common/constants';

@Module({})
export class FirebaseModule {
  static forRoot(): DynamicModule {
    const firebasApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(new ConfigService().get('firebaseKey'))),
    });
    const firebaseProvider: Provider = {
      provide: FIREBASE_CLIENT,
      useValue: firebasApp,
    };
    return {
      providers: [firebaseProvider],
      module: FirebaseModule,
      global: true,
      exports: [firebaseProvider],
    };
  }
}
