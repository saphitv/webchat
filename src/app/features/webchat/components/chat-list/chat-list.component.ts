import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {WebchatService} from "../../services/webchat.service";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-list',
  template: `
    <div class="w-full h-screen">
        <li class="list-none bg-red-100 w-full h-12 p-4 flex item-center my-2 cursor-pointer"
            *ngFor="let user of (users | async)"
            (click)="navigateChat(user)"
        >{{user.username}} {{user.self ? '(yourself)' : ''}}</li>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent implements OnInit {

  users: Observable<any>

  constructor(private chat: WebchatService, private router: Router) {
    this.users = this.chat.users$
    this.users.subscribe(user => console.log("user obs", user))
  }

  ngOnInit(): void {
  }

  navigateChat(user: any){
    this.router.navigateByUrl('webchat/' + user.username)
  }
}
