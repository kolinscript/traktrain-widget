export interface SettingsContent {
  widgetID: number;
  backgroundColor: any;
  textColor: any;
  activeColor: any;
}

export interface Settings {
  width: string;
  autoWidth: boolean;
  height: string;
  autoHeight: boolean;
  background: string;
  text: string;
  active: string;
  accent?: string;
}
