import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, switchMap, take, tap } from "rxjs";

import { Booking } from "./booking.model";
import { AuthService } from "../auth/auth.service";

interface BookingData {
  bookFrom: string;
  bookTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;

}

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get bookings() {
    return this._bookings.asObservable();
    // return [...this._bookings];
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(
      `https://ionic-angular-manjeet-default-rtdb.firebaseio.com/bookings/${bookingId}.json`
    ).pipe(switchMap(() => {
      return this.bookings;
    }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      }));
    // return this.bookings.pipe(
    //   take(1),
    //   tap(bookings => {
    //     this._bookings.next(bookings.filter(b => b.id !== bookingId));
    //   })
    // );
  }

  addBooking(placeId: string, placeTitle: string, placeImg: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newBooking = new Booking(Math.random().toString(), placeId, this.authService.userId, placeTitle, placeImg, firstName, lastName, guestNumber, dateFrom, dateTo
    );
    return this.http.post<{ name: string }>(
      'https://ionic-angular-manjeet-default-rtdb.firebaseio.com/bookings.json',
      { ...newBooking, id: null }
    )
      .pipe(switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }), take(1), tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      }));
    // return this.bookings.pipe(take(1), delay(1000), tap((bookings) => {
    //   this._bookings.next(bookings.concat(newBooking));
    // }))
  }

  fetchBookings() {
    return this.http.get<{ [key: string]: BookingData }>(
      `https://ionic-angular-manjeet-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
    ).pipe(map(bookingData => {
      const bookings = [];
      for (const key in bookingData) {
        if (bookingData.hasOwnProperty(key)) {
          bookings.push(
            new Booking(
              key,
              bookingData[key].placeId,
              bookingData[key].userId,
              bookingData[key].placeTitle,
              bookingData[key].placeImage,
              bookingData[key].firstName,
              bookingData[key].lastName,
              +bookingData[key].guestNumber,
              new Date(bookingData[key].bookFrom),
              new Date(bookingData[key].bookTo),
            )
          );
        }
      }
      return bookings;
    }), tap(bookings => {
      this._bookings.next(bookings);
    })
    );
  }

}
