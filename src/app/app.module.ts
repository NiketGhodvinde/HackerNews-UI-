import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StoryListComponent } from './components/story-list/story-list.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, StoryListComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
