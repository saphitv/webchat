import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <div class="h-12 w-full bg-primary">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

}
