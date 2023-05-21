import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, of, switchMap, take, tap } from 'rxjs';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

// new Place(
//   'p3',
//   'Mohali',
//   'In the heart of Mohali',
//   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU',
//   149.99,
//   new Date('2023-01-01'),
//   new Date('2025-12-31'),
//   'u3'
// )

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get places() {
    return this._places.asObservable();
    // return [...this._places];
  }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-manjeet-default-rtdb.firebaseio.com/offered-places.json').
      pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(new Place(key, resData[key].title, resData[key].description, resData[key].imageUrl, resData[key].price, new Date(resData[key].availableFrom), new Date(resData[key].availableTo), resData[key].userId, resData[key].location));
          }
        }
        return places;
      }), tap(places => {
        this._places.next(places);
      }));
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(
      `https://ionic-angular-manjeet-default-rtdb.firebaseio.com/offered-places/${id}.json`
    ).pipe(
      map(resData => {
        return new Place(
          id,
          resData.title,
          resData.description,
          resData.imageUrl,
          resData.price,
          new Date(resData.availableFrom),
          new Date(resData.availableTo),
          resData.userId,
          resData.location
        );
      })
    );
    // return this.places.pipe(take(1), map(places => {
    //   return { ...places.find(p => p.id === id) };
    // }))
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    let generatedId: string;
    const newPlace = new Place(Math.random().toString(), title, description, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU', price, dateFrom, dateTo, this.authService.userId, location);

    return this.http.post<{ name: string }>('https://ionic-angular-manjeet-default-rtdb.firebaseio.com/offered-places.json', { ...newPlace, id: null }).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    // return this.places.pipe(take(1), delay(1000), tap((places) => {
    //   this._places.next(places.concat(newPlace));
    // }));
    // this._places.push(newPlace);
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      }
      else {
        return of(places);
      }
    }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableFrom,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://ionic-angular-manjeet-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        )
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );

    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
    //   const updatedPlaces = [...places];
    //   const oldPlace = updatedPlaces[updatedPlaceIndex];
    //   updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableFrom, oldPlace.userId);
    //   this._places.next(updatedPlaces);
    // }))
  }
}
