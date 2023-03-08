import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-webchat',
  template: `
    <div class="flex overflow-hidden">
    <div class="w-[240px] bg-green-100">
      <app-chat-list></app-chat-list>
    </div>
   <div style="width: calc(100% - 240px)">
     <app-chat-body></app-chat-body>
   </div>
    </div>
  `,
  styles: [
  ]
})
export class WebchatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
