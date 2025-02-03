import { Component } from '@angular/core';
import { GalleryComponent } from '../gallery/gallery.component';


@Component({
  selector: 'app-favorite',
  imports: [GalleryComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {

}
