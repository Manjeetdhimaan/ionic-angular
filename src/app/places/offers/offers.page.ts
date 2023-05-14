import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: Place[];

  constructor( private placesService: PlacesService, private router: Router ) { }

  ngOnInit() {
    this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  // ionViewDidEnter() {
  //   this.offers = this.placesService.places;
  // }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', offerId]);
  }

  onDeleteOffer(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.offers = this.offers.filter(offer => offer.id !== offerId);
  }

}
