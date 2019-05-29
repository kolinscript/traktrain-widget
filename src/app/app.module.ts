import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { WidgetComponent } from './components/main/widget/widget.component';
import { SettingsComponent } from './components/main/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WidgetComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
