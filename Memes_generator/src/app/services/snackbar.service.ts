import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  open(
    message: string,
    type: 'default',
    duration: number = 3000
  ) {
    const panelClass = {
      default: 'white-snackbar',
    }[type];

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: panelClass, 
    });
  }

}
