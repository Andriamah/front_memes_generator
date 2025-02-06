import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { AddMemesComponent } from './add-memes/add-memes.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'favorite', component: FavoriteComponent ,canActivate: [authGuard]},
  { path: 'my-projects', component: MyProjectsComponent ,canActivate: [authGuard]},
  { path: 'add-memes', component: AddMemesComponent ,canActivate: [authGuard] }
];
