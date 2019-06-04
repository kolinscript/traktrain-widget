import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { WidgetComponent } from './components/main/widget/widget.component';
import { SettingsComponent } from './components/main/settings/settings.component';

import { WidgetService } from './services/widget.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WidgetComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    WidgetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
