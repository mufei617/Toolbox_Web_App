import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jsonto-xml',
  templateUrl: './jsonto-xml.component.html',
  styleUrls: ['./jsonto-xml.component.css']
})
export class JsontoXMLComponent implements OnInit {
    showXmlFirst: boolean = true;

    inputJson: string = '';
    outputXml: string = '';

    inputXml: string = '';
    outputJson: string = '';

    ngOnInit(): void {}
    convert(): void {
      if (this.showXmlFirst) {
          this.convertToJSON();
      } else {
          this.convertToXML();  // 更改为XML转换函数
      }
  }
  

    convertToXML(): void {
        try {
            let jsonObject = JSON.parse(this.inputJson);
            this.outputXml = this.json2xml(jsonObject);
          } catch (e) {
            this.outputJson = 'Error: ' + (e as Error).message;
        }
    }

    json2xml(json: any, parentTag?: string): string {
      let xml = '';
    
      // Check if the json object is an array
      if (Array.isArray(json)) {
        for (let i = 0; i < json.length; i++) {
          const itemTag = parentTag || 'item'; // default tag name for items inside an array
          xml += `<${itemTag}>` + this.json2xml(json[i], parentTag) + `</${itemTag}>`;
        }
        return xml;
      }
    
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          let value = json[key];
          if (Array.isArray(value) && typeof value[0] !== 'object') {
            // Handle arrays of primitives (like strings)
            xml += value.map(item => `<${key}>${item}</${key}>`).join('');
          } else if (Array.isArray(value)) {
            // Handle arrays with recursion
            xml += this.json2xml(value, key);
          } else if (typeof value === 'object') {
            xml += `<${key}>` + this.json2xml(value) + `</${key}>`;
          } else {
            xml += `<${key}>${value}</${key}>`;
          }
        }
      }
    
      return xml;
    }
    convertToJSON(): void {
      try {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(this.inputXml, "text/xml");
          if (xmlDoc.documentElement) {
            this.outputJson = JSON.stringify(this.xmlToJson(xmlDoc.documentElement));
          } else {
              this.outputJson = 'Error: Could not parse XML document.';
          }
      } catch (e) {
          this.outputJson = 'Error: ' + (e as Error).message;
      }
  }

  xmlToJson(xml: Element | ChildNode): any {
    let obj: any = {};

    if (xml.nodeType === 1) { 
        if ((<Element>xml).attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < (<Element>xml).attributes.length; j++) {
                let attribute = (<Element>xml).attributes.item(j);
                if (attribute) {
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        }
    } else if (xml.nodeType === 3) { 
        obj = xml.nodeValue;
    }

    if ((<Element>xml).hasChildNodes()) {
        for(let i = 0; i < (<Element>xml).childNodes.length; i++) {
            let item = (<Element>xml).childNodes.item(i);
            let nodeName = item.nodeName;
            if (typeof(obj[nodeName]) === "undefined") {
                obj[nodeName] = this.xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) === "undefined") {
                    let old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(this.xmlToJson(item));
            }
        }
    }
    return obj;
}

    toggleOrder(): void {
        this.showXmlFirst = !this.showXmlFirst;
        // Clear existing inputs and outputs when toggling
        this.inputJson = '';
        this.outputXml = '';
        this.inputXml = '';
        this.outputJson = '';
    }
    copyToClipboard(textArea: HTMLTextAreaElement): void {
      textArea.select();  // 选择textarea的内容
      document.execCommand('copy');  // 复制选中的内容
  
      // 可选的，给用户反馈表示内容已被复制
      alert('已复制到剪贴板！');
  }
  
}
