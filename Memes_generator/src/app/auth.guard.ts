import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for dialog
import { DialogueComponent } from './dialogue/dialogue.component'; // Adjust the import path as needed

export const authGuard: CanActivateFn = (route, state) => {
  // Injection du router et du MatDialog
  const router = inject(Router);
  const dialog = inject(MatDialog);

  // Vérification du token dans le localStorage
  const token = localStorage.getItem('token');

  if (token) {
    console.log("GUARD: Navigation autorisée");
    return true;
  } else {
    console.log("GUARD: Navigation NON autorisée");
    // router.navigate(['/login']);

    // Ouverture du dialogue
    const data = {
      id: 'yourId', // Remplacez 'yourId' par l'ID approprié
      typeDonnee: "login"
    };

    const dialogRef = dialog.open(DialogueComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    return false;
  }
};
