import { HttpClient,HttpHandler} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-converter',
  templateUrl: './image-converter.component.html',
  styleUrls: ['./image-converter.component.css']
})
export class ImageConverterComponent implements OnInit {
  fileToUpload!: File;
  targetFormat: string = 'png'; // Default
  selectedFileName: string = 'Choose file'; // Default label text

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
        this.fileToUpload = input.files[0];
        this.selectedFileName = this.fileToUpload.name;
    }
}

convertImage() {
    const endpoint = 'https://localhost:5001/api/tools/convertImage';
    const formData: FormData = new FormData();
    formData.append('image', this.fileToUpload, this.fileToUpload.name);
    formData.append('targetFormat', this.targetFormat);

    this.http
        .post(endpoint, formData, { responseType: 'blob', observe: 'response' })
        .subscribe(response => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(response.body!);
            link.download = `converted.${this.targetFormat}`;
            link.click();
        });
}

}
