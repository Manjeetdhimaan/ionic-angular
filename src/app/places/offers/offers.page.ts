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
  isLoading = false;

  constructor( private placesService: PlacesService, private router: Router ) { }

  ngOnInit() {
    this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', offerId]);
  }

  onDeleteOffer(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.offers = this.offers.filter(offer => offer.id !== offerId);
  }

}
