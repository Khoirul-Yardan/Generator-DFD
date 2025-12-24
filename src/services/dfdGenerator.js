/**
 * DFD Generator - Professional Data Flow Diagram Generation
 * Mengikuti standar DFD ilmiah dengan struktur yang jelas dan mudah dipahami
 * Level 0: Context Diagram (1 process, semua entities & data stores)
 * Level 1: Main Processes (decomposisi per tabel)
 * Level 2: Detailed CRUD Operations
 */

class DFDGenerator {
  constructor() {}

  /**
   * LEVEL 0: Context Diagram - Diagram Konteks
   * Menampilkan sistem sebagai satu process dengan semua external entities dan data stores
   */
  generateLevel0(database) {
    const { tables, externalEntities } = database;

    let mermaid = `---
config:
  look: handDrawn
  layout: elk
---
graph TD
    classDef process fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    classDef dataStore fill:#F5A623,stroke:#A0621F,stroke-width:2px,color:#fff,font-size:12px,font-weight:bold
    classDef externalEntity fill:#7ED321,stroke:#468C15,stroke-width:2px,color:#fff,font-size:12px,font-weight:bold

    P0["<b>SISTEM INFORMASI</b><br/>P0"]
    class P0 process

`;

    // External entities dengan icon untuk visualisasi lebih baik
    externalEntities.forEach((entity, idx) => {
      mermaid += `    EE${idx}["👤 ${entity.displayName}"]
    class EE${idx} externalEntity
`;
    });

    mermaid += '\n';

    // Data stores dengan icon
    tables.forEach((table, idx) => {
      mermaid += `    DS${idx}[["💾 ${table.displayName}"]]
    class DS${idx} dataStore
`;
    });

    mermaid += '\n';

    // Data flows: External Entities ke System
    externalEntities.forEach((entity, idx) => {
      mermaid += `    EE${idx} -->|Input/Request| P0
`;
    });

    mermaid += '\n';

    // Data flows: System ke External Entities
    externalEntities.forEach((entity, idx) => {
      mermaid += `    P0 -->|Output/Response| EE${idx}
`;
    });

    mermaid += '\n';

    // Data flows: System ke Data Stores
    tables.forEach((table, idx) => {
      mermaid += `    P0 -->|Query/Save| DS${idx}
`;
    });

    mermaid += '\n';

    // Data flows: Data Stores ke System
    tables.forEach((table, idx) => {
      mermaid += `    DS${idx} -->|Retrieve Data| P0
`;
    });

    return {
      level: 0,
      title: 'Level 0: Diagram Konteks',
      description: 'Menampilkan sistem sebagai satu process dengan semua external entities dan data stores',
      mermaidCode: mermaid
    };
  }

  /**
   * LEVEL 1: Main Process Decomposition
   * Menguraikan sistem menjadi main processes berdasarkan tabel/fungsi
   */
  generateLevel1(database) {
    const { tables, externalEntities } = database;

    let mermaid = `---
config:
  look: handDrawn
  layout: elk
---
graph TD
    classDef process fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff,font-size:12px,font-weight:bold
    classDef dataStore fill:#F5A623,stroke:#A0621F,stroke-width:2px,color:#fff,font-size:11px,font-weight:bold
    classDef externalEntity fill:#7ED321,stroke:#468C15,stroke-width:2px,color:#fff,font-size:12px,font-weight:bold

`;

    // External entities
    externalEntities.forEach((entity, idx) => {
      mermaid += `    EE${idx}["👤 ${entity.displayName}"]
    class EE${idx} externalEntity
`;
    });

    mermaid += '\n';

    // Main processes - satu per tabel dengan nomor yang jelas
    tables.forEach((table, idx) => {
      const processNum = idx + 1;
      mermaid += `    P${processNum}["<b>${processNum}</b><br/>Manage ${table.displayName}"]
    class P${processNum} process
`;
    });

    mermaid += '\n';

    // Data stores
    tables.forEach((table, idx) => {
      mermaid += `    DS${idx}[["💾 ${table.displayName}"]]
    class DS${idx} dataStore
`;
    });

    mermaid += '\n';

    // Flows: External Entities ke Processes
    externalEntities.forEach((entity, eeIdx) => {
      tables.forEach((table, pIdx) => {
        const processNum = pIdx + 1;
        mermaid += `    EE${eeIdx} -->|Request| P${processNum}
`;
      });
    });

    mermaid += '\n';

    // Flows: Processes ke External Entities
    externalEntities.forEach((entity, eeIdx) => {
      tables.forEach((table, pIdx) => {
        const processNum = pIdx + 1;
        mermaid += `    P${processNum} -->|Result| EE${eeIdx}
`;
      });
    });

    mermaid += '\n';

    // Flows: Processes to Data Stores
    tables.forEach((table, idx) => {
      const processNum = idx + 1;
      mermaid += `    P${processNum} <-->|CRUD Data| DS${idx}
`;
    });

    return {
      level: 1,
      title: 'Level 1: Decomposisi Proses Utama',
      description: 'Menguraikan sistem menjadi main processes berdasarkan data stores',
      mermaidCode: mermaid
    };
  }

  /**
   * LEVEL 2: Detailed CRUD Operations
   * Setiap main process didekomposisi menjadi CRUD operations (Create, Read, Update, Delete)
   */
  generateLevel2(database) {
    const { tables, externalEntities } = database;

    let mermaid = `---
config:
  look: handDrawn
  layout: elk
---
graph TD
    classDef process fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff,font-size:11px,font-weight:bold
    classDef dataStore fill:#F5A623,stroke:#A0621F,stroke-width:2px,color:#fff,font-size:10px,font-weight:bold
    classDef externalEntity fill:#7ED321,stroke:#468C15,stroke-width:2px,color:#fff,font-size:11px,font-weight:bold
    classDef crud fill:#50E3C2,stroke:#2A8B7B,stroke-width:2px,color:#fff,font-size:10px,font-weight:bold

`;

    // External entities
    externalEntities.forEach((entity, idx) => {
      mermaid += `    EE${idx}["👤 ${entity.displayName}"]
    class EE${idx} externalEntity
`;
    });

    mermaid += '\n';

    // Data stores
    tables.forEach((table, idx) => {
      mermaid += `    DS${idx}[["💾 ${table.displayName}"]]
    class DS${idx} dataStore
`;
    });

    mermaid += '\n';

    // Main processes dan CRUD sub-processes
    tables.forEach((table, tableIdx) => {
      const mainProcessNum = tableIdx + 1;
      
      // Main process
      mermaid += `    P${mainProcessNum}["<b>${mainProcessNum}</b><br/>Manage ${table.displayName}"]
    class P${mainProcessNum} process
`;

      // CRUD operations
      const crudOps = ['Create', 'Read', 'Update', 'Delete'];
      crudOps.forEach((op, opIdx) => {
        const subProcessNum = `${mainProcessNum}${String.fromCharCode(97 + opIdx)}`; // 1a, 1b, 1c, 1d
        mermaid += `    P${subProcessNum}["${mainProcessNum}.${opIdx + 1}<br/>${op}"]
    class P${subProcessNum} crud
`;
      });
    });

    mermaid += '\n';

    // Flows dari External Entities ke Main Processes
    externalEntities.forEach((entity, eeIdx) => {
      tables.forEach((table, tableIdx) => {
        const mainProcessNum = tableIdx + 1;
        mermaid += `    EE${eeIdx} -->|Input| P${mainProcessNum}
`;
      });
    });

    mermaid += '\n';

    // Flows dari Main Processes ke CRUD Operations
    tables.forEach((table, tableIdx) => {
      const mainProcessNum = tableIdx + 1;
      const crudOps = ['Create', 'Read', 'Update', 'Delete'];
      
      crudOps.forEach((op, opIdx) => {
        const subProcessNum = `${mainProcessNum}${String.fromCharCode(97 + opIdx)}`;
        mermaid += `    P${mainProcessNum} -->|${op}| P${subProcessNum}
`;
      });
    });

    mermaid += '\n';

    // Flows dari CRUD Operations ke Data Stores
    tables.forEach((table, tableIdx) => {
      const mainProcessNum = tableIdx + 1;
      const crudOps = ['Create', 'Read', 'Update', 'Delete'];
      
      crudOps.forEach((op, opIdx) => {
        const subProcessNum = `${mainProcessNum}${String.fromCharCode(97 + opIdx)}`;
        mermaid += `    P${subProcessNum} <-->|${op}| DS${tableIdx}
`;
      });
    });

    mermaid += '\n';

    // Flows dari Main Processes ke External Entities
    externalEntities.forEach((entity, eeIdx) => {
      tables.forEach((table, tableIdx) => {
        const mainProcessNum = tableIdx + 1;
        mermaid += `    P${mainProcessNum} -->|Output| EE${eeIdx}
`;
      });
    });

    return {
      level: 2,
      title: 'Level 2: Operasi Detail CRUD',
      description: 'Setiap main process didekomposisi menjadi CRUD operations',
      mermaidCode: mermaid
    };
  }

  /**
   * Generate semua DFD levels dengan informasi lengkap
   */
  generateAllLevels(database) {
    const level0 = this.generateLevel0(database);
    const level1 = this.generateLevel1(database);
    const level2 = this.generateLevel2(database);

    const externalEntityNames = database.externalEntities.map(e => e.displayName);
    const tableNames = database.tables.map(t => t.displayName);
    
    const level1Processes = database.tables.map((t, i) => `${i + 1}. Manage ${t.displayName}`);
    const level2Processes = database.tables.flatMap((t, i) => [
      `${i + 1}.1 Create ${t.displayName}`,
      `${i + 1}.2 Read ${t.displayName}`,
      `${i + 1}.3 Update ${t.displayName}`,
      `${i + 1}.4 Delete ${t.displayName}`
    ]);

    return {
      summary: {
        totalLevels: 3,
        totalDataStores: database.tables.length,
        totalProcesses: 1 + database.tables.length + (database.tables.length * 4),
        totalExternalEntities: database.externalEntities.length,
        relationships: database.relationships ? database.relationships.length : 0,
        tables: tableNames,
        externalEntities: externalEntityNames,
        level1Processes,
        level2Processes
      },
      level0,
      level1,
      level2
    };
  }
}

module.exports = new DFDGenerator();

