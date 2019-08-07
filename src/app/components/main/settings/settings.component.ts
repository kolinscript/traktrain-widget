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

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initSettings();
    this.initCheckboxWatchers();
  }

  public settingsReset() {}

  public settingsSave() {
    console.log(this.settings.value);
    this.embedCode
      = '<iframe src="https://traktrain.com/widget/'
      + this.settingsContent.widgetID
      + '" width=“' + this.settings.value.width.toLowerCase()
      + '” height=“' + this.settings.value.height.toLowerCase()
      + '” frameborder="0"></iframe>';
    this.settingsResult.emit(this.settings.value);
  }

  private initSettings() {
    this.settings = this.fb.group({
      width: 'Auto',
      autoWidth: true,
      height: 'Auto',
      autoHeight: true,
      background: null,
      text: null,
      active: null,
      accent: null,
    } as Settings);
    this.embedCode = '<iframe src="https://traktrain.com/widget/' + this.settingsContent.widgetID + '" width=“auto” height=“auto” frameborder="0"></iframe>';
  }

  private initCheckboxWatchers() {
    this.settings.controls['autoWidth'].valueChanges.subscribe(val => {
      if (val) {
        this.settings.controls['width'].setValue('Auto');
      } else  {
        this.settings.controls['width'].setValue('');
      }
    });
    this.settings.controls['autoHeight'].valueChanges.subscribe(val => {
      if (val) {
        this.settings.controls['height'].setValue('Auto');
      } else  {
        this.settings.controls['height'].setValue('');
      }
    });
  }

}
