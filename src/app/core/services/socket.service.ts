import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)


  constructor(private socket: Socket) {
    this.socket.fromEvent("connect_error").subscribe(err => {
      console.log("Error on connecting to the socket", err)
    })
  }

  fromEvent<T>(eventName: string): Observable<T>{
    return this.socket.fromEvent(eventName)
  }

  emit(eventName: string, payload: any){
    this.socket.emit(eventName, payload)
  }

  connectToSocket() {
    this.socket.connect()
    this.isConnected.next(true)
    console.log("Socket io connecting")
  }
}
