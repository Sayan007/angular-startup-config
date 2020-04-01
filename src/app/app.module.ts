import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IConfigurationService, IConfiguration, configurationFactory} from './core/configuration';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { CommonService } from './core/services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { ChartDirective } from './core/directives/chart.directive'; 

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule ],
  declarations: [ AppComponent, HelloComponent, ChartDirective ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configurationFactory,
      deps: [IConfigurationService],
      multi: true
    },
    {
      provide: IConfiguration,
      useValue: IConfigurationService.settings
    }
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
