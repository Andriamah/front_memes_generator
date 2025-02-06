import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as fabric from 'fabric';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemesService } from '../services/memes.service';
import { Memes } from '../models/Memes';
import { SnackbarService } from '../services/snackbar.service';


@Component({
  selector: 'app-add-memes',
  imports: [MatSidenavModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './add-memes.component.html',
  styleUrl: './add-memes.component.css'
})
export class AddMemesComponent implements AfterViewInit {
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;
  canvas!: fabric.Canvas;
  selectedColor: string = '#000000';
  fillColor: string = '';
  showCard = '';
  fontSize: number = 20;
  color: string = '#000000';
  fontWeight: string = 'normal';
  backgroundColor = null;
  canvasForm!: FormGroup;
  new_memes = new Memes();


  constructor(
    private fb: FormBuilder,
    private memes_service: MemesService,
    private snackBar_service: SnackbarService

  ) {
    this.canvasForm = this.fb.group({
      name: ['', Validators.required]
    });
  }


  ngAfterViewInit(): void {

    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      width: 600,
      height: 400,
      backgroundColor: '#fff'
    });

  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;

        fabric.Image.fromURL(imgUrl, {
          crossOrigin: 'anonymous'
        }).then((img) => {
          const canvasAspect = this.canvas.getWidth()! / this.canvas.getHeight()!;
          const imgAspect = img.width! / img.height!;
          let scaleFactor = 1;

          if (imgAspect > canvasAspect) {
            scaleFactor = (this.canvas.getWidth()! * 0.8) / img.width!;
          } else {
            scaleFactor = (this.canvas.getHeight()! * 0.8) / img.height!;
          }

          img.scale(scaleFactor);

          img.set({
            left: (this.canvas.getWidth()! - img.width! * scaleFactor) / 2,
            top: (this.canvas.getHeight()! - img.height! * scaleFactor) / 2
          });

          this.canvas.add(img);
          this.canvas.renderAll();
        });
      };

      reader.readAsDataURL(file);
    }
  }

  addTextStyle() {
    this.showCard = "addStyle";
  }

  addText() {
    const text = new fabric.Textbox('Texte ici', {
      left: 100,
      top: 100,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fill: this.color,
      backgroundColor: this.backgroundColor ?? undefined,
      width: 200
    });
    this.canvas.add(text);
    this.canvas.renderAll();
  }

  changeTextStyle(fontSize: number, color: string, fontWeight: string, backgroundColor?: string) {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject instanceof fabric.Textbox) {
      activeObject.set({
        fontSize: fontSize,
        fill: color,
        fontWeight: fontWeight,
        backgroundColor: backgroundColor ?? undefined, // Use nullish coalescing
      });
      this.canvas.renderAll();
    }
  }

  saveCanvas() {
    const memeData = this.canvasForm.value;

    // this.new_memes.title = memeData.name;
    console.log('ICIC ARY OOO ' + memeData.name)
    if (this.canvasForm.valid) {
      // const dataURL = this.canvas.toDataURL({
      //   format: 'png',
      //   multiplier: 1,

      // });

      // const link = document.createElement('a');
      // link.href = dataURL;
      // link.download = 'image_edited.png';
      // link.click();


      const dataURL = this.canvas.toDataURL({
        format: 'jpeg',
        quality: 0.7,
        multiplier: 0.5
      });
      const memeData = this.canvasForm.value;

      this.new_memes.title = memeData.name;

      // Création de l'objet à envoyer au serveur
      const fabricData = {
        memes: this.new_memes,
        fabricData: dataURL // L'image est déjà en base64
      };

      this.memes_service.addMemes(fabricData).subscribe(response => {
        console.log('Meme enregistré avec succès !', response);
        this.snackBar_service.open("Meme enregistré avec succès !", "default")
      }, error => {
        this.snackBar_service.open("Erreur lors de la sauvegarde du memes", "default")

        console.error('', error)
      });
    } else {
      this.snackBar_service.open("Veuillez nommer votre fichier.", "default")

    }

  }

  applyFilter(filterType: string) {
    const activeObject = this.canvas.getActiveObject();

    if (activeObject && activeObject instanceof fabric.Image) {
      if (filterType === 'original') {
        // Supprimer tous les filtres et restaurer l'image d'origine
        activeObject.filters = [];
      } else {
        let filter;

        switch (filterType) {
          case 'grayscale':
            filter = new fabric.filters.Grayscale();
            break;
          case 'sepia':
            filter = new fabric.filters.Sepia();
            break;
          case 'invert':
            filter = new fabric.filters.Invert();
            break;
          case 'brightness':
            filter = new fabric.filters.Brightness({ brightness: 0.2 });
            break;
          case 'contrast':
            filter = new fabric.filters.Contrast({ contrast: 0.5 });
            break;
          default:
            console.error('Filtre inconnu');
            return;
        }

        activeObject.filters = [filter];
      }

      activeObject.applyFilters();
      this.canvas.requestRenderAll();
    } else {
      console.error("Aucune image sélectionnée !");
    }
  }

  addForm() {
    this.showCard = "addForm"
  }

  addRectangle() {
    const rectangle = new fabric.Rect({
      left: 50,
      top: 50,
      fill: this.fillColor,
      stroke: this.selectedColor,
      width: 100,
      height: 50,
      angle: 0,
    });
    this.canvas.add(rectangle);
  }

  addCircle() {
    console.log('this is the color ' + this.fillColor)
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      fill: this.fillColor,
      stroke: this.selectedColor,
      radius: 50,
    });
    this.canvas.add(circle);
  }

  addTriangle() {
    const triangle = new fabric.Polygon(
      [
        { x: 50, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ],
      {
        left: 200,
        top: 200,
        fill: this.fillColor,
        stroke: this.selectedColor,
        angle: 0,
      }
    );
    this.canvas.add(triangle);
  }

  deleteSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
      this.canvas.renderAll();
    }
  }

  clearCanvas() {
    this.canvas.clear();
    this.canvas.backgroundColor = '#fff';
    this.canvas.renderAll();
  }

  deleteOnlyText() {
    this.canvas.getObjects().forEach((obj) => {
      if (obj instanceof fabric.Textbox || obj instanceof fabric.Text) {
        this.canvas.remove(obj);
      }
    });
    this.canvas.renderAll();
  }

  closeCard(){
    this.showCard='';
  }


}
