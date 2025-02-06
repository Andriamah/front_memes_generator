import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { Memes } from '../models/Memes';
import { ActivatedRoute } from '@angular/router';
import { MemesService } from '../services/memes.service';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../services/favorite.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Favorite } from '../models/Favorite';
import { ImageService } from '../services/image.service';


@Component({
  selector: 'app-gallery',
  imports: [MatButtonModule,
    MatCardModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  @Input() type: 'global' | 'favorite' | 'personal' = 'global';
  @Input() favorite?: number;
  @Input() personal?: number;
  likedStatus: { [key: number]: boolean } = {};
  imageList: { [key: number]: string } = {};
  isImageZoomed = false;  // Pour afficher l'image en zoom
  zoomedImageUrl: string = ''; // Pour stocker l'URL de l'image zoomée

  data = {
    typeDonnee: '',
    id: 0
  };
  readonly dialog = inject(MatDialog);
  memes!: Memes[];
  favorite_meme = new Favorite();
  favorite_id_selected !: number;
  token = localStorage.getItem('token');

  constructor(
    private route: ActivatedRoute,
    private memes_service: MemesService,
    private favorite_service: FavoriteService,
    private image_service: ImageService

  ) { }
  ngOnInit(): void {
    // this.loadData(id)
    this.loadData()
  }

  loadData() {
    switch (this.type) {
      case 'favorite':
        this.memes_service.getAllMemesFavoriteByUser().subscribe(
          memes => {
            console.log('Données reçues : ', memes);
            this.memes = memes;
            this.memes.forEach(meme => {
              this.checkLikeStatus(meme.id);
              this.getImage(meme.id);
            });
            console.log('voici les memes : ', JSON.stringify(memes))
          }, error => {
            console.error('Erreur lors de la récupération des memes : ', error);
          }
        );
        break;
      case 'personal':
        this.memes_service.getAllMemesByUser().subscribe(
          memes => {
            console.log('Données reçues : ', memes);
            this.memes = memes;
            this.memes.forEach(meme => {
              this.checkLikeStatus(meme.id);
              this.getImage(meme.id);

            });
            console.log('voici les memes : ', JSON.stringify(memes))
          }, error => {
            console.error('Erreur lors de la récupération des memes : ', error);
          }
        );
        break;
      default:
        this.memes_service.getAllMemes().subscribe(
          memes => {
            this.memes = memes;
            this.memes.forEach(meme => {
              this.checkLikeStatus(meme.id);
              this.getImage(meme.id);

            });
            console.log('voici les memes : ', JSON.stringify(memes))
          }, error => {
            console.error('Erreur lors de la récupération des memes : ', error);
          }
        );
    }
  }

  onfavorite(id: any) {
    if (this.token) {
      this.favorite_meme.memes_id = id;
      this.favorite_service.addFavotite(this.favorite_meme).subscribe(response => {
        console.log('Add favorite')
        window.location.reload();

      }, error => {
        console.error('error add favorite', error);

      });
    } else {
      this.openDialogLogin();
    }

  }

  unfavorite(id: any) {
    if (this.token) {
      this.favorite_service.deleteFavorite(id).subscribe(response => {
        console.log('Delete favorite')
        window.location.reload();

      }, error => {
        console.error('error delete favoritee', error);

      });
    } else {
      this.openDialogLogin();
    }

  }

  openDialogComment(id: any) {
    this.data.id = id;
    this.data.typeDonnee = "comment";
    const dialogRef = this.dialog.open(DialogueComponent, {
      data: this.data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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

  ifMemesLiked(id: any): Observable<boolean> {
    if (this.token) {
      console.log('itoo ' + id)
      return this.favorite_service.ifUserFavorite(id).pipe(
        map(response => {
          this.favorite_id_selected = response.id; // Affectation séparée
          return response.favorite; // Retourne bien un boolean
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération du favori', error);
          return of(false); // Retourne `false` en cas d'erreur
        })
      );
    } else {
      return of(false); // Retourne un Observable<boolean> même sans token
    }
  }

  checkLikeStatus(id: number | undefined) {
    if (id === undefined) return;
    if (this.token) {
      this.favorite_service.ifUserFavorite(id).subscribe({
        next: (response) => {
          this.likedStatus[id] = response.favorite;
        },
        error: () => {
          this.likedStatus[id] = false;
        }
      });
    } else return

  }

  getImage(id: number | undefined) {
    if (id === undefined) return;
    this.image_service.getImageByMemes(id).subscribe({
      next: (response) => {
        this.imageList[id] = response.imageData;
        console.log('oui nisy kaa' + response.memes_id); // Or use response.imageData.slice(0, 20)

      },
      error: () => {
        console.log('erreur recuperation de l image de ' + id)
      }
    });
  }

  downloadImage(memeId: number) {
    const imageData = this.imageList[memeId];
    if (!imageData) return;

    // Convertir base64 en blob
    const byteCharacters = atob(imageData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Créer et déclencher le lien de téléchargement
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `meme-${memeId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  shareToSocial(network: string) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Regardez ce meme !');

    let shareUrl = '';

    switch (network) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
    }

    window.open(shareUrl, '_blank');
  }

  // Fonction pour zoomer l'image au clic
  zoomImage(imageUrl: string) {
    this.zoomedImageUrl = imageUrl;  // Assigner l'image à afficher en zoom
    this.isImageZoomed = true;  // Afficher l'overlay avec l'image zoomée
  }

  // Fonction pour fermer l'overlay du zoom
  closeZoom() {
    this.isImageZoomed = false;  // Masquer l'overlay
    this.zoomedImageUrl = '';  // Réinitialiser l'URL de l'image zoomée
  }

}



