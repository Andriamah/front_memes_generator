import { Component, ChangeDetectionStrategy, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialogue',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule
  ],
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogueComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: any,
    private fb: FormBuilder
  ) {
  }

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  comments = [
    {
      username: "Alice Dupont",
      photo: "https://randomuser.me/api/portraits/women/10.jpg",
      text: "C'est une très bonne fonctionnalité ! J'adore ! 😊",
      date: new Date()
    },
    {
      username: "Jean Martin",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
      text: "Wow, super idée !",
      date: new Date()
    }
    ,
    {
      username: "Jean Martin",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
      text: "Wow, super idée !",
      date: new Date()
    }
    ,
    {
      username: "Jean Martin",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
      text: "Wow, super idée !",
      date: new Date()
    }
  ];




  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (this.data.typeDonnee == "login") {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });

      this.registerForm = this.fb.group({
        nameUser: ['', Validators.required],
        newPassword: ['', Validators.required]
      });
    }
  }

  onRegister() { }
  onLogin() { }
  addComment() {
    // if (this.newCommentText.trim()) {
    //   this.comments.push({
    //     username: "Moi", // Tu peux changer ça en récupérant l'utilisateur connecté
    //     photo: "https://randomuser.me/api/portraits/men/1.jpg", // Une image par défaut ou celle de l'utilisateur
    //     text: this.newCommentText,
    //     date: new Date()
    //   });
    //   this.newCommentText = ''; // Réinitialiser l'input après l'ajout
    // }
}
}
