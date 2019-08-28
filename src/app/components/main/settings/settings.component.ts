import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Settings, SettingsContent } from '../../../models/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() settingsContent: SettingsContent;
  @Output() settingsResult: EventEmitter<any> = new EventEmitter<any>();
  settings: FormGroup;
  embedCode: string;

  backgroundColor: any;
  textColor: any;
  activeColor: any;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initSettings();
    this.initCheckboxWatchers();
  }

  public settingsReset(): void {}

  public settingsSave(): void {
    console.log(this.settings.value);
    this.embedCode
      = '<iframe src="https://traktrain.com/widget/'
      + this.settingsContent.widgetID
      + '" width=“' + this.settings.value.width.toLowerCase()
      + '” height=“' + this.settings.value.height.toLowerCase()
      + '” frameborder="0"></iframe>';
    this.settingsResult.emit(this.settings.value);
  }

  public widthChanged(): void {
    this.embedCode
      = '<iframe src="https://traktrain.com/widget/'
      + this.settingsContent.widgetID
      + '" width=“' + this.settings.value.width.toLowerCase()
      + '” height=“' + this.settings.value.height.toLowerCase()
      + '” frameborder="0"></iframe>';
  }

  public heightChanged(): void {
    this.embedCode
      = '<iframe src="https://traktrain.com/widget/'
      + this.settingsContent.widgetID
      + '" width=“' + this.settings.value.width.toLowerCase()
      + '” height=“' + this.settings.value.height.toLowerCase()
      + '” frameborder="0"></iframe>';
  }

  public backgroundColorChanged(backgroundColor: string): void {
    this.settings.controls['background'].setValue(backgroundColor);
    this.settingsResult.emit(this.settings.value);
  }

  public textColorChanged(textColor: string): void {
    this.settings.controls['text'].setValue(textColor);
    this.settingsResult.emit(this.settings.value);
  }

  public activeColorChanged(activeColor: string): void {
    this.settings.controls['active'].setValue(activeColor);
    this.settingsResult.emit(this.settings.value);
  }

  private initSettings(): void {
    this.settings = this.fb.group({
      width: 'Auto',
      autoWidth: true,
      height: 'Auto',
      autoHeight: true,
      background: null,
      text: null,
      active: null,
    } as Settings);
    this.backgroundColor = this.settingsContent.backgroundColor;
    this.textColor = this.settingsContent.textColor;
    this.activeColor = this.settingsContent.activeColor;
    this.settings.controls['background'].setValue(this.backgroundColor);
    this.settings.controls['text'].setValue(this.textColor);
    this.settings.controls['active'].setValue(this.activeColor);
    this.embedCode
      = '<iframe src="https://traktrain.com/widget/'
      + this.settingsContent.widgetID
      + '" width=“auto” height=“auto” frameborder="0"></iframe>';
  }

  private initCheckboxWatchers() {
    this.settings.controls['autoWidth'].valueChanges.subscribe(val => {
      if (val) {
        this.settings.controls['width'].setValue('Auto');
        this.embedCode
          = '<iframe src="https://traktrain.com/widget/'
          + this.settingsContent.widgetID
          + '" width=“' + this.settings.value.width.toLowerCase()
          + '” height=“' + this.settings.value.height.toLowerCase()
          + '” frameborder="0"></iframe>';
      } else  {
        this.settings.controls['width'].setValue('');
        this.embedCode
          = '<iframe src="https://traktrain.com/widget/'
          + this.settingsContent.widgetID
          + '" width=“” height=“' + this.settings.value.height.toLowerCase()
          + '” frameborder="0"></iframe>';
      }
    });
    this.settings.controls['autoHeight'].valueChanges.subscribe(val => {
      if (val) {
        this.settings.controls['height'].setValue('Auto');
        this.embedCode
          = '<iframe src="https://traktrain.com/widget/'
          + this.settingsContent.widgetID
          + '" width=“' + this.settings.value.width.toLowerCase()
          + '” height=“' + this.settings.value.height.toLowerCase()
          + '” frameborder="0"></iframe>';
      } else  {
        this.settings.controls['height'].setValue('');
        this.embedCode
          = '<iframe src="https://traktrain.com/widget/'
          + this.settingsContent.widgetID
          + '" width=“' + this.settings.value.width.toLowerCase()
          + '” height=“” frameborder="0"></iframe>';
      }
    });
  }

}
