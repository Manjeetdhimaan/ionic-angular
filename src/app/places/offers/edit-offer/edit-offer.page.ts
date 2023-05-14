import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place | any;
  form: FormGroup;
  placedId: string;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      if (!param['placeId']) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placedId = param['placeId']
      this.isLoading = true;
      this.placesService.getPlace(param['placeId']).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          })
        });
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) return;
    this.loadingCtrl.create({
      message: 'Updating offer...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/offers');
      });
    })
  }
}
