import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  usePicker = false;
  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;
  @Input() showPreview = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log("Mobile", this.platform.is('mobile'));
    console.log("Desktop", this.platform.is('desktop'));
    console.log("Hybrid", this.platform.is('hybrid'));
    console.log("iOS", this.platform.is('ios'));
    console.log("Andriod", this.platform.is('android'));
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePicker.nativeElement.click();
      return;
    }
    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.Uri
    }).then(image => {
      if (image.webPath) {
        this.selectedImage = image.webPath;
        this.imagePick.emit(image.webPath);
      }
    }).catch(err => {
      // if(this.usePicker) this.filePicker.nativeElement.click();
      console.log(err);
      return false;
    });
  }

  onFileChoosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files?.[0];
    if(!pickedFile) return;
    const fr = new FileReader();
    fr.onload = () => {
      const dataIUrl = fr.result?.toString();
      if(dataIUrl) this.selectedImage = dataIUrl;
      this.imagePick.emit(pickedFile);
    }
    fr.readAsDataURL(pickedFile);
  }
}
