import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from '../../place.model';
import { ActivatedRoute, Params } from '@angular/router';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {

  place: Place | any;
  private $subs: Subscription;

  constructor(private activateRoute: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe((params: Params) => {
      if (!params['placeId']) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.$subs = this.placesService.getPlace(params['placeId']).subscribe(place => {
        this.place = place;
      });
    });
  }

  ngOnDestroy(): void {
      this.$subs?.unsubscribe();
  }

}
