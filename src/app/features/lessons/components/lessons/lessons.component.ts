import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";

@Component({
  selector: 'app-lessons',
  template: `
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>

        </tr>
        </thead>
        <tbody>

        <tr *ngFor="let lesson of lessons$ | async">
          <th>{{lesson.id}}</th>
          <th>{{lesson.name}}</th>
        </tr>

        </tbody>
      </table>
    </div>
  `,
  styles: [
  ]
})
export class LessonsComponent implements OnInit {

  constructor(private http: HttpClient) { }

  lessons$: Observable<{id: number, name: string}[]> = this.getLessons()

  ngOnInit(): void {

  }

  getLessons(): Observable<any> {
    return this.http.get<any>('api/lessons')
      .pipe(
        map(res => res.lessons),
        catchError(_ => {
          console.log("Permessi insufficenti")
          return of(null)
        })
      )
  }

}
