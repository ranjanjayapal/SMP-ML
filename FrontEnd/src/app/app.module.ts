import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import {ServerService} from './home/home.service';
import {RouterModule, Routes} from '@angular/router';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { PredictionComponent } from './prediction/prediction.component';
import { LoadingModule } from 'ngx-loading';
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'list', component: ListComponent},
  {path: 'prediction', component: PredictionComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    PredictionComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    LoadingModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
