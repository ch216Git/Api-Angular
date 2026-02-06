import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-component.html',
  styleUrls: ['./upload-component.scss'],
})
export class UploadComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.imagePreview = URL.createObjectURL(file);
  this.fileSelected.emit(file);
}

}
