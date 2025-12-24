const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class MermaidRenderer {
  /**
   * Generate Mermaid syntax dari DFD data
   * Menggunakan Mermaid flowchart dengan DFD notasi ilmiah
   */
  generateMermaidSyntax(dfdData) {
    let mermaidCode = `graph TD\n`;
    mermaidCode += `  classDef process fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff\n`;
    mermaidCode += `  classDef dataStore fill:#E8B366,stroke:#A0651F,stroke-width:2px,color:#000\n`;
    mermaidCode += `  classDef externalEntity fill:#7ED321,stroke:#468C15,stroke-width:2px,color:#fff\n`;
    mermaidCode += `  classDef subgraph_class fill:#F5F5F5,stroke:#999,stroke-width:1px\n\n`;

    // Define elements dengan styling
    dfdData.elements.forEach(element => {
      const nodeContent = `"${element.displayName || element.name || element.label}"`;
      
      switch(element.type) {
        case 'process':
          mermaidCode += `  ${element.id}[${nodeContent}]\n`;
          mermaidCode += `  class ${element.id} process\n`;
          break;
        case 'dataStore':
          // Data stores digambar dengan double brackets (database notation)
          mermaidCode += `  ${element.id}[(${nodeContent})]\n`;
          mermaidCode += `  class ${element.id} dataStore\n`;
          break;
        case 'externalEntity':
          // External entities digambar dengan square brackets
          mermaidCode += `  ${element.id}[\\[${nodeContent}\\]]\n`;
          mermaidCode += `  class ${element.id} externalEntity\n`;
          break;
      }
    });

    mermaidCode += '\n';

    // Define flows dengan labels
    dfdData.flows.forEach(flow => {
      const label = flow.label || 'Data';
      const flowLabel = flow.dataElements ? 
        `${label}<br/>(${flow.dataElements.slice(0, 2).join(', ')})` : label;
      
      mermaidCode += `  ${flow.from} -->|${flowLabel}| ${flow.to}\n`;
    });

    return mermaidCode;
  }

  /**
   * Generate Mermaid untuk Level 0 (Context Diagram)
   */
  generateLevel0Mermaid(level0Data) {
    let code = `---\nconfig:\n  layout: elk\n---\ngraph TD\n`;
    code += `  classDef process fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff,font-size:14px\n`;
    code += `  classDef dataStore fill:#E8B366,stroke:#A0651F,stroke-width:2px,color:#000\n`;
    code += `  classDef externalEntity fill:#7ED321,stroke:#468C15,stroke-width:2px,color:#fff\n\n`;

    // Central process
    code += `  P0["SYSTEM<br/>Complete System"]\n`;
    code += `  class P0 process\n\n`;

    // External entities
    level0Data.elements
      .filter(e => e.type === 'externalEntity')
      .forEach(entity => {
        code += `  ${entity.id}["${entity.displayName}"]\n`;
        code += `  class ${entity.id} externalEntity\n`;
      });

    // Data stores
    code += '\n';
    level0Data.elements
      .filter(e => e.type === 'dataStore')
      .forEach(ds => {
        code += `  ${ds.id}[("${ds.displayName}")]\n`;
        code += `  class ${ds.id} dataStore\n`;
      });

    // Flows
    code += '\n';
    level0Data.flows.forEach(flow => {
      code += `  ${flow.from} -->|${flow.label}| ${flow.to}\n`;
    });

    return code;
  }

  /**
   * Generate Mermaid untuk Level 1
   */
  generateLevel1Mermaid(level1Data) {
    let code = `---\nconfig:\n  layout: elk\n---\ngraph TD\n`;
    code += `  classDef process fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff\n`;
    code += `  classDef dataStore fill:#E8B366,stroke:#A0651F,stroke-width:2px,color:#000\n`;
    code += `  classDef externalEntity fill:#7ED321,stroke:#468C15,stroke-width:2px,color:#fff\n\n`;

    // Processes (grouped by function)
    level1Data.elements
      .filter(e => e.type === 'process')
      .forEach(process => {
        code += `  ${process.id}["${process.displayName}"]\n`;
        code += `  class ${process.id} process\n`;
      });

    code += '\n';

    // External entities
    level1Data.elements
      .filter(e => e.type === 'externalEntity')
      .forEach(entity => {
        code += `  ${entity.id}["${entity.displayName}"]\n`;
        code += `  class ${entity.id} externalEntity\n`;
      });

    code += '\n';

    // Data stores
    level1Data.elements
      .filter(e => e.type === 'dataStore')
      .forEach(ds => {
        code += `  ${ds.id}[("${ds.displayName}")]\n`;
        code += `  class ${ds.id} dataStore\n`;
      });

    code += '\n';

    // Flows
    level1Data.flows.forEach(flow => {
      code += `  ${flow.from} -->|${flow.label}| ${flow.to}\n`;
    });

    return code;
  }

  /**
   * Generate Mermaid untuk Level 2
   */
  generateLevel2Mermaid(level2Data) {
    let code = `---\nconfig:\n  layout: elk\n---\ngraph TD\n`;
    code += `  classDef process fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff\n`;
    code += `  classDef dataStore fill:#E8B366,stroke:#A0651F,stroke-width:2px,color:#000\n`;
    code += `  classDef externalEntity fill:#7ED321,stroke:#468C15,stroke-width:2px,color:#fff\n\n`;

    // CRUD Processes
    level2Data.elements
      .filter(e => e.type === 'process')
      .forEach(process => {
        code += `  ${process.id}["${process.displayName}"]\n`;
        code += `  class ${process.id} process\n`;
      });

    code += '\n';

    // External entities
    level2Data.elements
      .filter(e => e.type === 'externalEntity')
      .forEach(entity => {
        code += `  ${entity.id}["${entity.displayName}"]\n`;
        code += `  class ${entity.id} externalEntity\n`;
      });

    code += '\n';

    // Data stores
    level2Data.elements
      .filter(e => e.type === 'dataStore')
      .forEach(ds => {
        code += `  ${ds.id}[("${ds.displayName}")]\n`;
        code += `  class ${ds.id} dataStore\n`;
      });

    code += '\n';

    // Flows
    level2Data.flows.forEach(flow => {
      code += `  ${flow.from} -->|${flow.label}| ${flow.to}\n`;
    });

    return code;
  }

  /**
   * Render Mermaid code ke PNG/SVG menggunakan Puppeteer
   * Fallback ke file HTML jika Chrome tidak tersedia
   */
  async renderToImage(mermaidCode, outputPath, format = 'png') {
    let browser;
    try {
      // Check if Chrome/Puppeteer is available
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      const html = this.generateHtmlWrapper(mermaidCode);
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Wait untuk mermaid render
      await page.waitForFunction(() => {
        return document.querySelectorAll('.mermaid svg').length > 0;
      }, { timeout: 5000 });

      if (format.toLowerCase() === 'svg') {
        const svg = await page.evaluate(() => {
          return document.querySelector('.mermaid svg').outerHTML;
        });
        await fs.promises.writeFile(outputPath, svg);
      } else {
        await page.screenshot({
          path: outputPath,
          type: 'png',
          omitBackground: false
        });
      }

      return outputPath;
    } catch (error) {
      // If Chrome is not available, generate HTML instead
      if (error.message.includes('Could not find Chrome') || 
          error.message.includes('No such file') ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('Failed to launch')) {
        
        const htmlPath = outputPath.replace(/\.(png|svg)$/, '.html');
        const html = this.generateHtmlWrapper(mermaidCode);
        await fs.promises.writeFile(htmlPath, html);
        return htmlPath;
      }
      
      throw new Error(`Failed to render diagram: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  }

  /**
   * Generate HTML wrapper untuk Mermaid
   */
  generateHtmlWrapper(mermaidCode) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DFD Diagram</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {
      margin: 20px;
      padding: 0;
      background: white;
      font-family: Arial, sans-serif;
    }
    .mermaid {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      max-width: 100%;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="mermaid">
${mermaidCode}
    </div>
  </div>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'linear'
      }
    });
    mermaid.contentLoaded();
  </script>
</body>
</html>`;
  }

  /**
   * Export ke JSON untuk reference
   */
  exportToJSON(dfdData, outputPath) {
    const data = {
      level: dfdData.level,
      title: dfdData.title,
      description: dfdData.description,
      elements: dfdData.elements,
      flows: dfdData.flows,
      relationships: dfdData.relationships || [],
      generatedAt: new Date().toISOString()
    };

    return fs.promises.writeFile(outputPath, JSON.stringify(data, null, 2));
  }
}

module.exports = new MermaidRenderer();