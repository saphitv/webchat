import {Component, Input, OnInit} from '@angular/core';
import {WebchatService} from "../../services/webchat.service";
import {UserInterface} from "../../interfaces/user.interface";

@Component({
  selector: 'app-inputbar',
  template: `
    <div class="w-full h-16 pr-4 p-2 flex justify-between">
      <input #textInputMessage (keyup.enter)="sendMessage(textInputMessage)" type="text" placeholder="Type here" class="input input-bordered min-w-48 w-[95%] h-full" />
      <div class="flex items-center">
        <svg (click)="sendMessage(textInputMessage)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </div>


    </div>
  `,
  styles: [
  ]
})
export class InputbarComponent implements OnInit {
  @Input() chatWithUser!: UserInterface

  constructor(private webchat: WebchatService) { }

  ngOnInit(): void {
  }

  sendMessage(inputValue: HTMLInputElement){
    this.webchat.sendMessageTo('message', inputValue.value, this.chatWithUser.username)
    inputValue.value = ''
  }

}
