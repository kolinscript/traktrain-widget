import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initSettings();
  }

  public settingsReset() {}

  public settingsSave() {
    console.log(this.settings.value);
  }

  private initSettings() {
    this.settings = this.fb.group({
      width: null,
      height: null,
      background: null,
      text: null,
      active: null,
      accent: null,
    });
  }

}
