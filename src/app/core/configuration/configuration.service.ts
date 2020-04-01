import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Router
} from '@angular/router';
import {
  IConfiguration
} from './configuration.model';
import {
  environment
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IConfigurationService {
  public static settings = new IConfiguration();
  constructor(private http: HttpClient) {}
  load() {
    const configFile = `config/config.${environment.name}.json`;
    return new Promise < void > ((resolve, reject) => {
      this.http
        .get < IConfiguration > (configFile)
        .toPromise()
        .then(response => {
          IConfigurationService.settings = Object.assign(IConfigurationService.settings, response);
          resolve();
        })
        .catch((response: any) => {
          reject(
            `Could not load file '${configFile}': ${JSON.stringify(response)}`
          );
        });
    });
  }
}

export function configurationFactory(appConfig: IConfigurationService) {
  return () => appConfig.load();
}