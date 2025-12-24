const fs = require('fs');
const path = require('path');

class SQLParser {
  /**
   * Parse SQL file dan extract struktur database
   * @param {string} filePath - Path ke SQL file
   * @returns {Object} - Database structure dengan tables, relationships, dan flow
   */
  async parseSQLFile(filePath) {
    try {
      const sqlContent = await fs.promises.readFile(filePath, 'utf8');
      
      const database = {
        tables: this.extractTables(sqlContent),
        relationships: [],
        externalEntities: this.identifyExternalEntities(),
        processes: []
      };

      // Extract relationships (foreign keys)
      database.relationships = this.extractRelationships(sqlContent, database.tables);
      
      // Auto-generate processes dari tables (CRUD operations)
      database.processes = this.generateCRUDProcesses(database.tables);

      return database;
    } catch (error) {
      throw new Error(`Failed to parse SQL file: ${error.message}`);
    }
  }

  /**
   * Extract semua tables dari SQL
   */
  extractTables(sqlContent) {
    const tables = [];
    // Match CREATE TABLE statements
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s*\(([\s\S]*?)\)(?:;|$)/gi;
    
    let match;
    while ((match = tableRegex.exec(sqlContent)) !== null) {
      const tableName = match[1];
      const columnText = match[2];
      
      tables.push({
        id: `DS_${tableName.toUpperCase()}`,
        name: tableName,
        displayName: this.formatName(tableName),
        columns: this.extractColumns(columnText, tableName),
        type: 'dataStore',
        description: `Data Store: ${tableName}`
      });
    }

    return tables;
  }

  /**
   * Extract columns dari table definition
   */
  extractColumns(columnText, tableName) {
    const columns = [];
    const lines = columnText.split(/[,;\n]/);

    lines.forEach(line => {
      line = line.trim();
      
      // Skip foreign key, primary key, constraint lines
      if (!line || line.toUpperCase().includes('CONSTRAINT') || 
          line.toUpperCase().includes('FOREIGN') ||
          line.toUpperCase().includes('PRIMARY KEY') ||
          line.toUpperCase().includes('UNIQUE') ||
          line.toUpperCase().includes('CHECK')) {
        return;
      }

      const colMatch = line.match(/^[`"]?(\w+)[`"]?\s+(\w+)(\([\d,\s]+\))?\s*(.*)?$/i);
      if (colMatch) {
        const [, colName, colType, colSize, colAttrs] = colMatch;
        
        columns.push({
          name: colName,
          type: colType.toUpperCase(),
          size: colSize ? colSize.replace(/[()]/g, '') : null,
          isPrimaryKey: colAttrs && colAttrs.toUpperCase().includes('PRIMARY KEY'),
          isNullable: !colAttrs || !colAttrs.toUpperCase().includes('NOT NULL'),
          isAutoIncrement: colAttrs && colAttrs.toUpperCase().includes('AUTO_INCREMENT'),
          isForeignKey: false,
          foreignKeyRef: null
        });
      }
    });

    return columns;
  }

  /**
   * Extract relationships dari foreign keys
   */
  extractRelationships(sqlContent, tables) {
    const relationships = [];
    
    // Match FOREIGN KEY constraints
    const fkRegex = /FOREIGN\s+KEY\s*\(\s*[`"]?(\w+)[`"]?\s*\)\s*REFERENCES\s+[`"]?(\w+)[`"]?\s*\(\s*[`"]?(\w+)[`"]?\s*\)/gi;
    
    let match;
    while ((match = fkRegex.exec(sqlContent)) !== null) {
      const [, localCol, refTable, refCol] = match;
      
      // Find table containing this FK
      const sourceTable = tables.find(t => 
        t.columns.some(c => c.name.toLowerCase() === localCol.toLowerCase())
      );
      
      const targetTable = tables.find(t => t.name.toLowerCase() === refTable.toLowerCase());
      
      if (sourceTable && targetTable) {
        relationships.push({
          id: `REL_${sourceTable.name}_${targetTable.name}`,
          from: sourceTable.id,
          to: targetTable.id,
          fromTable: sourceTable.name,
          toTable: targetTable.name,
          localColumn: localCol,
          referenceColumn: refCol,
          label: `${localCol} → ${refCol}`,
          type: 'oneToMany'
        });

        // Update column info
        const col = sourceTable.columns.find(c => c.name.toLowerCase() === localCol.toLowerCase());
        if (col) {
          col.isForeignKey = true;
          col.foreignKeyRef = `${refTable}.${refCol}`;
        }
      }
    }

    return relationships;
  }

  /**
   * Identifikasi external entities (aktor sistem)
   */
  identifyExternalEntities() {
    // Default external entities untuk sistem database
    return [
      {
        id: 'EE_ADMIN',
        name: 'Admin',
        displayName: 'Administrator',
        type: 'externalEntity',
        description: 'System Administrator'
      },
      {
        id: 'EE_USER',
        name: 'User',
        displayName: 'End User',
        type: 'externalEntity',
        description: 'System User/Client'
      },
      {
        id: 'EE_SYSTEM',
        name: 'System',
        displayName: 'External System',
        type: 'externalEntity',
        description: 'External Integrated System'
      }
    ];
  }

  /**
   * Generate processes dari CRUD operations
   */
  generateCRUDProcesses(tables) {
    const processes = [];
    let processId = 1;

    tables.forEach(table => {
      // Create Process
      processes.push({
        id: `P${processId}`,
        name: `Add ${table.displayName}`,
        displayName: `1.${processId} Add ${table.displayName}`,
        type: 'process',
        description: `Create new ${table.name} record`,
        dataStore: table.id,
        operation: 'CREATE'
      });
      processId++;

      // Read Process
      processes.push({
        id: `P${processId}`,
        name: `View ${table.displayName}`,
        displayName: `1.${processId} View ${table.displayName}`,
        type: 'process',
        description: `Retrieve ${table.name} records`,
        dataStore: table.id,
        operation: 'READ'
      });
      processId++;

      // Update Process
      processes.push({
        id: `P${processId}`,
        name: `Edit ${table.displayName}`,
        displayName: `1.${processId} Edit ${table.displayName}`,
        type: 'process',
        description: `Update ${table.name} record`,
        dataStore: table.id,
        operation: 'UPDATE'
      });
      processId++;

      // Delete Process
      processes.push({
        id: `P${processId}`,
        name: `Delete ${table.displayName}`,
        displayName: `1.${processId} Delete ${table.displayName}`,
        type: 'process',
        description: `Remove ${table.name} record`,
        dataStore: table.id,
        operation: 'DELETE'
      });
      processId++;
    });

    return processes;
  }

  /**
   * Format nama untuk display
   */
  formatName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

module.exports = new SQLParser();