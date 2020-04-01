import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IConfiguration {
  api: API;
  dashboardCharts: DashboardCharts;
  dashboardRegion: DashboardRegion;
  azureAdvisorRecommendation: AzureAdvisorRecommendation;
  portfolioHeadReport: PortfolioHeadReport;
  azureSecurityCenter: AzureSecurityCenter;
  operationSummary: OperationSummary;

  apiEndpoint(relativePath: string): string {
    return this.api.base + relativePath;
  }
  // apiEndpointWithParam(relativePath: string, params: { [key: string]: string }): string {
  //   return this.api.base + eval(`\`${relativePath}\``);
  // }
}

export interface IEndpoints {
  category: string;
  portfolio: string;
  application: string;
  toolName: string;
  portfolioApplication: string;
  postSave: string;
  postStore: string;
  formatJson: string;
  platform: string;
  component: string;
  subcomponent: string;
  sendSubComponetData: string;
}

export interface IDashboardReport {
  location: string;
  portfolioDashboard: string;
  platformDashboard: string;
  firstLevel: string;
  widget: string;
  postWidgetConfiguration: string;
}

export interface IReports {
  categoryWise: string;
  regionWise: string;
  regions: string;
  impactedServers: string;
  parameterDetails: string;
  resourceParamDetails: string;
  serviceManagement: string;
}

export interface IappMonData {
  appMon: string;
  pageLoadTimeLow: number;
  pageLoadTimeHigh: number;
}
export interface IreportTrendData {
  reportTrend: string;
}
export interface IrefreshTime {
  autoRefreshTime: string;
}
export interface IAuthorization {
  handlerUrl: string;
  tokenUrl: string;
  authorizationUrl: string;
  landingPageRedirectUrl: string;
  redirectDelay: number;
}
export interface IserviceNowLink {
  ALERT_URL: string;
}
export interface IFileNames {
  allTicketRecord: string;
  serviceManagementCardRecords: string;
  ticketCardDetails: string;
}
export interface IColumnTitles {
  ticketLevel: string;
  ticketType: string;
  region: string;
  snowTicketId: string;
  alertDesc: string;
  paramName: string;
  appName: string;
}

export interface API {
  base: string;
  authenticationURL: string;
  reports: IReports;
  appMonData: IappMonData;
  refreshTime: IrefreshTime;
  AuthorizationData: IAuthorization;
  ServicenowLink: IserviceNowLink;
  FileNames: IFileNames;
  ColumnTitles: IColumnTitles;
  reportTrend: IreportTrendData;
  retryCount: number;
  requestTimeout: number;
}

export interface DashboardCharts {
  name: string,
  fontColor: string,
  numberOfDonut: number,
  serviceNowLink: string,
  mailtoLink: string,
  space: number,
  colors: Array<string>,
  colorNames: Array<string>,
  tooltipStyle: TooltipStyle ;
  donutConfig: DonutConfig; 
  donutDetails: DonutDetails[];
  performanceUtilizationRelation: PerformanceUtilizationRelation;
  
}

export interface DashboardRegion{
  name: string,
  colorMap: ColorMap,
  jsonAddress: string,
  regionName: string,
  height: number,
  width: number,
  api: string
}
export interface ColorMap{
  GREEN:string,
  AMBER:string,
  RED:string,
}

export interface TooltipStyle{
  position:string,
  width:string,
  height:string,
  background:string,
  border:string,
  "border-radius":string,
  "box-shadow":string,
  color:string,
  font:string,
  padding:string,
  "text-align":string,
  display:string
}

export interface DonutConfig{
  height:number,
  width:number,
  top:number,
  bottom:number,
  left:number,
  right:number,
  innerRadius:number
}

export interface DonutDetails {
  id: number,
  name: string,
  api: string,
  colors: Array<string>,
  drillthrough: boolean,
  displayValue: Array<string>,
  displayLabel: Array<string>,
  noDataText: string
}

export interface AzureAdvisorRecommendation {
  api: string,
  blockName: string,
  popupName: string,
  isDrillthrough: boolean,
  displayTable: DisplayTable,
  popupTable: PopupTable,
  colors: Array<string>, 
  donutConfig: DonutConfig,
  tooltipStyle: TooltipStyle,
  fontColor: string,
  resourceLabel: Array<string>,
  resourceValue: Array<string>,
  impactLabel: Array<string>,
  impactValue: Array<string>
}

export interface DisplayTable {
  retriev: boolean,
  searching: boolean,
  pageLength: number,
  ordering: boolean,
  paging: boolean,
  info: boolean,
  dom: string
}

export interface PopupTable {
  retriev: boolean,
  searching: boolean,
  pageLength: number,
  ordering: boolean,
  info: boolean,
  language: Language
}

export interface Language {
  search: string,
  searchPlaceholder: string
}

export interface PerformanceUtilizationRelation {
  Performance: ObjectRelationData[],
  Utilization: ObjectRelationData[]
}

export interface ObjectRelationData{
  ObjectName: string,
  ParameterName: Parameter[]
}

export interface Parameter {
  name: string,
  thresholdMin: number,
  thresholdMax: number
}

export interface PortfolioHeadReport {
  name: string
}

export interface AzureSecurityCenter {
  name: string
}

export interface OperationSummary {
  name: string
}