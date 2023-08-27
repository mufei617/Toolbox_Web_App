import { Component, ElementRef, AfterViewInit, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { Renderer2, RendererFactory2 } from '@angular/core';

@Component({
  selector: 'app-generate-qrcode',
  templateUrl: './generate-qrcode.component.html',
  styleUrls: ['./generate-qrcode.component.css']
})
export class GenerateQRcodeComponent implements OnInit, AfterViewInit {
  @ViewChild('qrcodeElement') qrcodeElement!: ElementRef;
  private renderer: Renderer2;

  url: string = '';
  elementType: NgxQrcodeElementTypes = NgxQrcodeElementTypes.IMG;

  constructor(private cdRef: ChangeDetectorRef, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // 此时你可以安全地访问qrcodeElement
  }
  
  downloadQRCode(): void {
    const img = this.renderer.selectRootElement('img', true);
    console.log(img);
  
    if (img && img.src) {
      const link = this.renderer.createElement('a');
      this.renderer.setAttribute(link, 'href', img.src);
      this.renderer.setAttribute(link, 'download', 'qrcode.png');
      this.renderer.setStyle(link, 'display', 'none');
      const parent = this.renderer.selectRootElement('body', true);
      this.renderer.appendChild(parent, link);
      link.click();
      this.renderer.removeChild(parent, link);
    }
  }
}


