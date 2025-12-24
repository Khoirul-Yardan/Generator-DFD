/**
 * DFD Model Structure
 * Dokumentasi struktur data untuk DFD (Data Flow Diagram)
 */

/**
 * Element Types dalam DFD
 * @typedef {Object} DFDElement
 * @property {string} id - Unique identifier (P1, DS1, EE1)
 * @property {string} type - Type: 'process' | 'dataStore' | 'externalEntity'
 * @property {string} name - Internal name
 * @property {string} displayName - Display name untuk diagram
 * @property {string} [description] - Optional description
 */

/**
 * Process - Aktivitas yang mentransformasi data
 * @typedef {Object} Process
 * @property {string} id - Process ID (P1, P2, etc)
 * @property {string} name - Process name
 * @property {string} displayName - Formatted display name
 * @property {string} type - 'process'
 * @property {string} description - What this process does
 * @property {string} dataStore - Reference ke data store yang diakses
 * @property {string} operation - CRUD operation (CREATE, READ, UPDATE, DELETE)
 * @property {number} level - DFD level (0, 1, 2, etc)
 * @property {boolean} [hasChildren] - Apakah process ini bisa di-decompose
 */

/**
 * Data Store - Penyimpanan data (database, file, cache)
 * @typedef {Object} DataStore
 * @property {string} id - Data Store ID (DS_TABLE_NAME)
 * @property {string} type - 'dataStore'
 * @property {string} name - Table/Store name
 * @property {string} displayName - Formatted display name
 * @property {string} description - Description
 * @property {Array<Column>} columns - Column definitions
 */

/**
 * Column - Kolom dalam data store
 * @typedef {Object} Column
 * @property {string} name - Column name
 * @property {string} type - Data type (VARCHAR, INT, etc)
 * @property {string} [size] - Column size
 * @property {boolean} isPrimaryKey - Primary key?
 * @property {boolean} isNullable - Nullable?
 * @property {boolean} isAutoIncrement - Auto-increment?
 * @property {boolean} isForeignKey - Foreign key?
 * @property {string} [foreignKeyRef] - Reference ke table.column
 */

/**
 * External Entity - Aktor atau sistem eksternal
 * @typedef {Object} ExternalEntity
 * @property {string} id - Entity ID (EE_ADMIN, EE_USER, etc)
 * @property {string} type - 'externalEntity'
 * @property {string} name - Entity name
 * @property {string} displayName - Formatted display name
 * @property {string} description - Description
 */

/**
 * Data Flow - Aliran data antar elemen
 * @typedef {Object} DataFlow
 * @property {string} id - Flow ID (F_SOURCE_TARGET)
 * @property {string} from - Source element ID
 * @property {string} to - Target element ID
 * @property {string} label - Flow label (data flow name)
 * @property {Array<string>} dataElements - Data items flowing
 */

/**
 * Relationship - Hubungan antar data stores (foreign key)
 * @typedef {Object} Relationship
 * @property {string} id - Relationship ID
 * @property {string} from - Source data store ID
 * @property {string} to - Target data store ID
 * @property {string} fromTable - Source table name
 * @property {string} toTable - Target table name
 * @property {string} localColumn - Local column name
 * @property {string} referenceColumn - Reference column name
 * @property {string} label - Relationship label
 * @property {string} type - Relationship type ('oneToMany', 'oneToOne', etc)
 */

/**
 * DFD Level Structure
 * @typedef {Object} DFDLevel
 * @property {number} level - DFD level (0, 1, 2, etc)
 * @property {string} title - Level title
 * @property {string} description - Level description
 * @property {Array<DFDElement>} elements - All elements in this level
 * @property {Array<DataFlow>} flows - All data flows in this level
 * @property {Array<Relationship>} [relationships] - All relationships
 */

/**
 * Database Structure
 * @typedef {Object} DatabaseStructure
 * @property {Array<DataStore>} tables - All tables
 * @property {Array<Relationship>} relationships - All relationships
 * @property {Array<ExternalEntity>} externalEntities - External entities
 * @property {Array<Process>} processes - Generated processes
 */

/**
 * Complete DFD Generation Result
 * @typedef {Object} DFDResult
 * @property {DFDLevel} level0 - Context diagram
 * @property {DFDLevel} level1 - Process decomposition
 * @property {DFDLevel} level2 - Detailed operations
 * @property {Object} summary - Summary statistics
 * @property {number} summary.totalDataStores - Number of data stores
 * @property {number} summary.totalProcesses - Number of processes
 * @property {number} summary.totalExternalEntities - Number of external entities
 * @property {number} summary.relationships - Number of relationships
 */

module.exports = {
  // Type definitions - exported untuk reference
  types: {
    Process: 'Process',
    DataStore: 'DataStore',
    ExternalEntity: 'ExternalEntity',
    DataFlow: 'DataFlow',
    Relationship: 'Relationship'
  },

  // DFD Naming Conventions
  conventions: {
    // Process naming: P1, P2, P1.1, P1.2 (sesuai level)
    processId: (parentId, childNumber, level) => {
      if (level === 0) return 'P0';
      if (level === 1) return `P${childNumber}`;
      if (parentId) return `${parentId}.${childNumber}`;
      return `P${childNumber}`;
    },

    // Data Store naming: DS_TABLE_NAME
    dataStoreId: (tableName) => `DS_${tableName.toUpperCase()}`,

    // External Entity naming: EE_ROLE
    externalEntityId: (role) => `EE_${role.toUpperCase()}`,

    // Data Flow naming: F_SOURCE_TARGET
    dataFlowId: (sourceId, targetId) => `F_${sourceId}_${targetId}`
  },

  // DFD Rules/Constraints
  rules: {
    // Level 0: 1 process, all external entities, all data stores
    level0: {
      maxProcesses: 1,
      includeAllExternalEntities: true,
      includeAllDataStores: true
    },

    // Level 1: Main processes, same external entities, same data stores
    level1: {
      maxProcesses: 7, // Typical: 3-7 processes
      includeAllExternalEntities: true,
      includeAllDataStores: true
    },

    // Level 2+: Detailed operations, filtered external entities/data stores
    levelN: {
      noNewExternalEntities: true,
      noNewDataStores: true,
      detailedOperations: true
    }
  },

  // CRUD Operations
  operations: {
    CREATE: 'Create',
    READ: 'Read',
    UPDATE: 'Update',
    DELETE: 'Delete'
  }
};
