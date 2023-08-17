import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-live-video',
  templateUrl: './live-video.component.html',
  styleUrls: ['./live-video.component.css']
})
export class LiveVideoComponent implements AfterViewInit {
  @ViewChild('liveVideo') liveVideoElement!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    this.startLiveStream();
  }

  startLiveStream(): void {
    const videoElement = this.liveVideoElement.nativeElement as HTMLVideoElement;
  
    // 替换为提供实时流的后端 API 端点的 URL
    const liveStreamUrl = 'https://localhost:5001/api/tools/live';
  
    fetch(liveStreamUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('网络响应异常。');
        }
        const mediaSource = new MediaSource();
        videoElement.src = URL.createObjectURL(mediaSource);
  
        mediaSource.addEventListener('sourceopen', function () {
          const sourceBuffer = mediaSource.addSourceBuffer('video/mp2t');
          if (response.body) {
            readStreamData(response.body, sourceBuffer);
          }
        });
      })
      .catch(error => console.error('获取实时流错误：', error));
  }
}

async function readStreamData(stream: ReadableStream<Uint8Array>, buffer: SourceBuffer): Promise<void> {
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      (buffer as any).endOfStream(); // 类型断言
      break;
    }

    buffer.appendBuffer(value);
  }
}
