import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebchatComponent } from './webchat.component';
import {WebchatRoutingModule} from "./webchat-routing.module";
import { ChatListComponent } from './components/chat-list.component';
import { ChatBodyComponent } from './components/chat-body.component';
import { InputbarComponent } from './components/inputbar.component';
import { NavbarComponent } from './components/navbar.component';
import {StoreModule} from "@ngrx/store";
import {WebchatReducer} from "./store/reducers/index.reducer";
import {EffectsModule} from "@ngrx/effects";
import {WebchatEffect} from "./store/effects/webchat.effect";
import { SearchUsersComponent } from './components/search-users.component';
import { ChatDetailsComponent } from './components/chat-details.component';



@NgModule({
  declarations: [
    WebchatComponent,
    ChatListComponent,
    ChatBodyComponent,
    InputbarComponent,
    NavbarComponent,
    SearchUsersComponent,
    ChatDetailsComponent
  ],
  imports: [
    CommonModule,
    WebchatRoutingModule,
    StoreModule.forFeature('webchat', WebchatReducer),
    EffectsModule.forFeature([WebchatEffect])
  ]
})
export class WebchatModule { }
