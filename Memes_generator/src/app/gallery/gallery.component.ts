import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery',
  imports: [MatButtonModule,
    MatCardModule,
    MatIcon
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
constructor() { }
  data = {
    typeDonnee: '',
    id: ''
  };
  readonly dialog = inject(MatDialog);
  openDialogComment(id:string) {
    this.data.id = id;
      this.data.typeDonnee = "comments";
      const dialogRef = this.dialog.open(DialogueComponent, {
        data: this.data
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
}
