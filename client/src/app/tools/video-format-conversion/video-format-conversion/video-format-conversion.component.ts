import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-video-format-conversion',
  templateUrl: './video-format-conversion.component.html',
  styleUrls: ['./video-format-conversion.component.css']
})
export class VideoFormatConversionComponent implements OnInit {
  
  videoForm: FormGroup;
  selectedFile: File | null = null;
  downloadPath: string | null = null;
  progress = 0;
  showDownloadLink = false;
  videoUrl: string | null = null;
  error: string | null = null;

  @ViewChild('downloadInput', { static: false })
  downloadInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.videoForm = this.fb.group({
      videoFile: [null],
      downloadPath: [null]
    });
  }

  ngOnInit(): void {
  }
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      console.log('已选择的视频文件:', this.selectedFile);
    }
  }

  onDownloadPathSelected(input: HTMLInputElement) {
    if (input.files && input.files.length > 0) {
      this.downloadPath = input.files[0].webkitRelativePath;
      console.log('已选择的下载路径:', this.downloadPath + 'video.avi');
    }
  }

  chooseDownloadPath() {
    this.downloadInput.nativeElement.click();
  }
  
  async convertVideo() {
    if (!this.selectedFile) {
      // 如果没有选择文件，提前返回并不继续转换
      return;
    }
  
    this.progress = 0;
    this.showDownloadLink = false;
    this.error = null;
  
    const formData = new FormData();
    formData.append('InputFilePath', this.selectedFile, this.selectedFile.name); // 添加文件数据
    formData.append('OutputFilePath', 'result.avi'); // 设置输出文件名，这里可以根据需求进行调整
  
    try {
      const headers = new HttpHeaders(); // 不需要设置Content-Type，FormData会自动设置
      const response = await this.http.post<any>('https://localhost:5001/api/tools/convertvideo', formData, { headers }).toPromise();
      // 响应应包含转换后的视频的 URL
      this.videoUrl = response.processedVideoUrl;
      this.showDownloadLink = true;
    } catch (error) {
      console.error('视频转换过程中发生错误：', error);
      this.error = '视频转换失败，请重试或检查文件格式';
    }
  }
  
  
  downloadConvertedVideo() {
    if (this.videoUrl) {
      window.open(this.videoUrl, '_blank');
    }
  }
}
