import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { ServersComponent } from './servers/servers.component';
import { UserComponent } from './users/user/user.component';
import { EditServerComponent } from './servers/edit-server/edit-server.component';
import { ServerComponent } from './servers/server/server.component';
import { ServerService } from './home/home.service';
import {ServersService} from './servers/servers.service';
import { ListComponent } from './list/list.component';
import {DataService} from './data.service';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'servers', component: ServersComponent},
  {path: 'users', component: UsersComponent},
  {path: 'list', component: ListComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsersComponent,
    ServersComponent,
    UserComponent,
    EditServerComponent,
    ServerComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [ServerService, ServersService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
