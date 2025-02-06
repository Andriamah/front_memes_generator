import { Component, ChangeDetectionStrategy, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/Comment';
import { SnackbarService } from '../services/snackbar.service';

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
    private fb: FormBuilder,
    private user_service: UserService,
    private comment_service: CommentService,
    private snackBar_service: SnackbarService
  ) {
  }

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  commentForm!: FormGroup;
  newUser: User = new User();
  currentUserForm !: FormGroup;
  token = localStorage.getItem('token');


  comments !: Comment[];
  comment: Comment = new Comment();

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
    if (this.data.typeDonnee == "comment") {
      this.commentForm = this.fb.group({
        comment: ['', Validators.required]
      });

      console.log('ici comment ' + this.data.id)
      this.comment_service.getCommentByMeme(this.data.id).subscribe(comments => {
        this.comments = comments;
        console.log('ici les commentaires ', JSON.stringify(this.comments))
      }, error => {
        console.error('Erreur lors de la récupération des données : ', error);
      })
    } if (this.data.typeDonnee == "profil") {
      console.log('ici profil ' + localStorage.getItem('username'));
      this.currentUserForm = this.fb.group({
        username: [localStorage.getItem('username'), Validators.required],
        password: ['', Validators.required],
        newPassword: ['', Validators.required],
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const registerData = this.loginForm.value;
      console.log('Login Data:', registerData.username);  // Utilisez 'username' ici
      console.log('Login Data:', registerData.password);

      this.newUser.username = registerData.username;
      this.newUser.password = registerData.password;

      this.user_service.addNewUser(this.newUser).subscribe(
        response => {
          if (response.auth) {
            const accessToken = response.token;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('username', response.user);

            window.location.reload();
          }
        },
        error => {
          // this.snackbarService.open('Échec de la connexion. Veuillez vérifier vos identifiants. ', 'error')
        }
      );
    }
  }
  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log('Login Data:', loginData.username);  // Utilisez 'username' ici
      console.log('Login Data:', loginData.password);
      const login = {
        username: loginData.username,  // Utilisez 'username' ici
        password: loginData.password
      }
      this.user_service.login(login).subscribe(
        response => {
          if (response.auth) {
            const accessToken = response.token;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('username', response.user);
            this.snackBar_service.open("Bon retour " + response.user, 'default')

            window.location.reload();
          }
        },
        error => {
          // this.snackbarService.open('Échec de la connexion. Veuillez vérifier vos identifiants. ', 'error')
        }
      );
    }
  }
  addComment() {
    if (this.commentForm.valid) {
      const commentData = this.commentForm.value;
      console.log('voici le comment ' + JSON.stringify(commentData));
      this.comment.title = commentData.comment;
      this.comment.memes_id = this.data.id;
      this.comment_service.addComment(this.comment).subscribe(
        response => {
          window.location.reload();
        },
        error => {
          this.snackBar_service.open("Veuillez vous connecter d'abord pour accéder à cette fonctionnalité", 'default')
        }
      );
    }
  }

  onUpdate() {
    if (this.currentUserForm.valid) {
      const userUpdate = this.currentUserForm.value;
      const userUpdated = {
        username: userUpdate.username,
        password: userUpdate.password,
        new_password: userUpdate.newPassword
      }
      this.user_service.updateUser(userUpdated).subscribe(response => {
        if (response.auth) {
          const accessToken = response.token;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('username', response.user);
          console.log('VOICI LA REPOSNE '+JSON.stringify(response))
          this.snackBar_service.open("Bon retour " + response.user, 'default')

          // window.location.reload();
          this.snackBar_service.open("Votre compte a été modifié avec succès", 'default')

        }

      }, errror => {
        this.snackBar_service.open("Veuillez vérifier vos identifiants , puis Réessayez", 'default')

      })
    }
  }
}
