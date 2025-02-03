import { Component } from '@angular/core';
import { HeroImageComponent } from '../hero-image/hero-image.component';
import { GalleryComponent } from '../gallery/gallery.component';


@Component({
  selector: 'app-home',
  imports: [HeroImageComponent,
    GalleryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
