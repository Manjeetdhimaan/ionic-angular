import { Injectable } from '@angular/core';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU',
      149.99
    ),
    new Place(
      'p2',
      'Patiala',
      'In the heart of Punjab',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU',
      149.99
    ),
    new Place(
      'p3',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiQWFazJlUneMkorAGoX4LJZFsirc2gRTBEQ&usqp=CAU',
      149.99
    )
  ];

  constructor() { }

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
