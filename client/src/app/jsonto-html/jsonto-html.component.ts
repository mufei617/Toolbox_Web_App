import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-jsonto-html',
  templateUrl: './jsonto-html.component.html',
  styleUrls: ['./jsonto-html.component.css'],
  encapsulation: ViewEncapsulation.None  // <-- 添加这一行

})
export class JsontoHTMLComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  inputJson: string = '';
  tableHtmlContent: string = '';
  showTableFirst: boolean = true;
  htmlSourceCode: string = '';  // 新增属性，用于存储HTML源码

  @ViewChild('sourceCodeTextarea', { static: false }) sourceCodeTextarea!: ElementRef;

  jsonToHtmlTable(jsonData: any[]): string {
      if (!jsonData || jsonData.length === 0) return '';

      let tableHtml = '<table border="1"><thead><tr>';
      let headers = Object.keys(jsonData[0]);
      for (let header of headers) {
          tableHtml += `<th>${header}</th>`;
      }

      tableHtml += '</tr></thead><tbody>';
      for (let item of jsonData) {
          tableHtml += '<tr>';
          for (let header of headers) {
              tableHtml += `<td>${item[header]}</td>`;
          }
          tableHtml += '</tr>';
      }

      tableHtml += '</tbody></table>';
      return tableHtml;
  }

  convertToTable(): void {
    try {
        let jsonObject = JSON.parse(this.inputJson);
        this.tableHtmlContent = this.jsonToHtmlTable(jsonObject);
        // 存储生成的HTML源码并添加注释
        this.htmlSourceCode = `<!-- Generated HTML Table -->\n${this.tableHtmlContent}`;
    } catch (e) {
        this.tableHtmlContent = 'Error: ' + (e as Error).message;
    }
}

  toggleOrder(): void {
    this.showTableFirst = !this.showTableFirst;
    // Clear existing inputs and outputs when toggling
    this.inputJson = '';
    this.tableHtmlContent = '';
}

convert(): void {
    if (this.showTableFirst) {
        this.convertToTable();
    } else {
        this.convertToJson();
    }
}

convertToJson(): void {
  try {
      let parser = new DOMParser();
      let htmlDoc = parser.parseFromString(this.tableHtmlContent, "text/html");
      const table = htmlDoc.querySelector("table");

      if (!table) {
          this.inputJson = "Error: No table found in provided HTML.";
          return;
      }

      const headers: string[] = [];
      const data: any[] = [];
      
      // Assuming the first row contains the headers
      const headerRow = table.querySelector("thead tr");
      if (headerRow) {
          headerRow.querySelectorAll("th").forEach(cell => {
              headers.push(cell.textContent || "");
          });
      }

      // Getting the data from the table rows
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach(row => {
          const rowData: any = {};
          row.querySelectorAll("td").forEach((cell, index) => {
              rowData[headers[index]] = cell.textContent;
          });
          data.push(rowData);
      });

      this.inputJson = JSON.stringify(data, null, 2);  // pretty print the JSON
  } catch (e) {
      this.inputJson = 'Error: ' + (e as Error).message;
  }
}

copyToClipboard(): void {
  const textArea = this.sourceCodeTextarea.nativeElement;
  textArea.select();
  document.execCommand('copy');
  alert('HTML Source Code copied to clipboard!');
}
}
