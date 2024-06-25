import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// import { AnalyticsService } from './app/shared/analytics.service';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
// bootstrapApplication(e

// browsermodule is declared in bootstrapApplication
// if i want to define services at app root instead of using interctable ({root})
// i can pass it in the bootstrapApplication - providers.

bootstrapApplication(AppComponent, {
  providers: [
    // AnalyticsService
  ]
});
