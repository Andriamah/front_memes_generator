import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

import { Router } from '@angular/router';


import { DialogueComponent } from '../dialogue/dialogue.component';


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
    private router: Router,) { }
  data = {
    typeDonnee: 'contenu',
    id: 0
  };
  readonly dialog = inject(MatDialog);
  isConnected = true;
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
  checkToken() {
    const token = localStorage.getItem('access_token');
    this.isConnected = !!token; // will be true if token exists, false otherwise

  }

  deconnexion() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // this.snackbarService.open("Déconnexion réussie. À bientôt !",'info');

    this.isConnected = false;
    this.router.navigate(['/accueil']);
  }
}
