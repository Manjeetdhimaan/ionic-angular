import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place | any;
  constructor(private activateRoute: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.activateRoute.params.subscribe((params: Params) => {
      if (!params['placeId']) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlace(params['placeId']);
    });
  }

  onBookPlace() {
    this.modalCtrl.create({ component: CreateBookingComponent, componentProps: { selectedPlace: this.place} }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resulData => {
      console.log(resulData);
    });
  }

}
