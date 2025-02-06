import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

import { Router } from '@angular/router';


import { DialogueComponent } from '../dialogue/dialogue.component';
import { SnackbarService } from '../services/snackbar.service';


@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar_service: SnackbarService) { }
  data = {
    typeDonnee: 'contenu',
    id: 0
  };
  readonly dialog = inject(MatDialog);
  isConnected = true;
  token = localStorage.getItem('token');



  ngOnInit(): void {
    this.checkToken()
  }

  openDialogLogin() {
    this.data.typeDonnee = "login";
    const dialogRef = this.dialog.open(DialogueComponent, {
      data: this.data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogProfil() {
    if (this.token) {
      this.data.typeDonnee = "profil";
      console.log('appel profil dialogue');
      const dialogRef = this.dialog.open(DialogueComponent, {
        data: this.data
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }else{
      this.openDialogLogin()
    }

  }
  checkToken() {
    this.isConnected = !!this.token; // will be true if token exists, false otherwise

  }

  deconnexion() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.snackBar_service.open("Déconnexion réussie. À bientôt !", 'default');
    this.isConnected = false;
    window.location.reload();

  }
}
