import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU',
      149.99,
      new Date('2023-01-01'),
      new Date('2025-12-31'),
      'u1'
    ),
    new Place(
      'p2',
      'Patiala',
      'In the heart of Punjab',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU',
      149.99,
      new Date('2023-01-01'),
      new Date('2025-12-31'),
      'u2'
    ),
    new Place(
      'p3',
      'Mohali',
      'In the heart of Mohali',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU',
      149.99,
      new Date('2023-01-01'),
      new Date('2025-12-31'),
      'u3'
    )
  ]);

  constructor(private authService: AuthService) { }

  get places() {
    return this._places.asObservable();
    // return [...this._places];
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(p => p.id === id) };
    }))
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(Math.random().toString(), title, description, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU', price, dateFrom, dateTo, this.authService.userId);
    return this.places.pipe(take(1), delay(1000), tap((places) => {
      this._places.next(places.concat(newPlace));
    }));
    // this._places.push(newPlace);
  }

  updatePlace( placeId: string, title: string, description: string ) {
    return this.places.pipe(take(1), delay(1000), tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableFrom, oldPlace.userId);
      this._places.next(updatedPlaces);
    }))
  }
}
