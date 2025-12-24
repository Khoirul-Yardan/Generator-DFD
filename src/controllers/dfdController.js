const sqlParser = require('../services/sqlParser');
const dfdGenerator = require('../services/dfdGenerator');
const mermaidRenderer = require('../services/mermaidRenderer');
const path = require('path');
const fs = require('fs');
const { validateUpload, ValidationError } = require('../utils/validation');

class DFDController {
  /**
   * Upload SQL file dan generate DFD
   */
  async uploadAndGenerateDFD(req, res) {
    let filePath = null;
    try {
      // Validasi file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please upload a SQL file.'
        });
      }

      validateUpload(req.file);
      filePath = req.file.path;
      console.log(`✓ File uploaded: ${req.file.originalname}`);

      // Parse SQL
      let database;
      try {
        database = await sqlParser.parseSQLFile(filePath);
        console.log(`✓ SQL parsed: ${database.tables.length} tables found`);
      } catch (parseError) {
        console.error('SQL Parse Error:', parseError);
        return res.status(400).json({
          success: false,
          message: `Failed to parse SQL file: ${parseError.message}`,
          details: parseError.message
        });
      }

      // Generate DFD levels dengan Mermaid code
      let dfdData;
      try {
        dfdData = dfdGenerator.generateAllLevels(database);
        console.log(`✓ DFD generated: Level 0, 1, 2`);
      } catch (genError) {
        console.error('DFD Generation Error:', genError);
        return res.status(500).json({
          success: false,
          message: `Failed to generate DFD: ${genError.message}`
        });
      }

      // Prepare response
      const timestamp = Date.now();
      const jsonPath = `uploads/dfd_data_${timestamp}.json`;
      const os = require('os');
      const uploadsDir = process.env.VERCEL 
        ? path.join(os.tmpdir(), 'uploads') 
        : path.join(__dirname, '../../uploads');

      // Create uploads directory if it doesn't exist
      if (!require('fs').existsSync(uploadsDir)) {
        require('fs').mkdirSync(uploadsDir, { recursive: true });
      }

      // Save JSON data
      try {
        await mermaidRenderer.exportToJSON(dfdData, path.join(uploadsDir, `dfd_data_${timestamp}.json`));
        console.log(`✓ JSON data saved`);
      } catch (e) {
        console.warn(`⚠ JSON save warning: ${e.message}`);
        // Don't fail if JSON save fails
      }

      // Cleanup SQL file
      try {
        if (filePath && require('fs').existsSync(filePath)) {
          await require('fs').promises.unlink(filePath);
        }
      } catch (e) {
        console.warn(`⚠ File cleanup warning: ${e.message}`);
      }

      // Return clean response with Mermaid code and detailed statistics
      return res.json({
        success: true,
        message: 'DFD generated successfully!',
        data: {
          summary: {
            totalLevels: 3,
            totalDataStores: database.tables.length,
            totalProcesses: dfdData.summary.totalProcesses,
            totalExternalEntities: dfdData.summary.totalExternalEntities,
            relationships: dfdData.summary.relationships,
            tables: dfdData.summary.tables,
            externalEntities: dfdData.summary.externalEntities || [],
            level1Processes: dfdData.summary.level1Processes || [],
            level2Processes: dfdData.summary.level2Processes || []
          },
          details: {
            dataStores: database.tables.map(t => ({
              id: t.id,
              name: t.name,
              displayName: t.displayName,
              columns: t.columns.length,
              columnNames: t.columns.map(c => c.name)
            })),
            externalEntities: dfdData.summary.externalEntities,
            processes: {
              level0: ['P0 - Complete System'],
              level1: dfdData.summary.level1Processes || [],
              level2: dfdData.summary.level2Processes || []
            }
          },
          mermaidCode: {
            level0: dfdData.level0.mermaidCode,
            level1: dfdData.level1.mermaidCode,
            level2: dfdData.level2.mermaidCode
          },
          mermaidLiveLinks: {
            level0: generateMermaidLiveLink(dfdData.level0.mermaidCode),
            level1: generateMermaidLiveLink(dfdData.level1.mermaidCode),
            level2: generateMermaidLiveLink(dfdData.level2.mermaidCode)
          },
          outputs: {
            jsonData: jsonPath
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);

      if (req.file) {
        try {
          await fs.promises.unlink(req.file.path);
        } catch (e) {
          // File already deleted
        }
      }

      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate DFD'
      });
    }
  }

  /**
   * Get DFD history
   */
  async getDFDHistory(req, res) {
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      const files = await fs.promises.readdir(uploadsDir);

      const dfdFiles = files
        .filter(f => f.startsWith('dfd_'))
        .sort((a, b) => {
          const timeA = parseInt(a.match(/\d+/) || 0);
          const timeB = parseInt(b.match(/\d+/) || 0);
          return timeB - timeA;
        })
        .slice(0, 10); // Last 10

      return res.json({
        success: true,
        data: {
          files: dfdFiles.map(f => ({
            name: f,
            url: `/uploads/${f}`
          }))
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get DFD by ID
   */
  async getDFDById(req, res) {
    try {
      const { id } = req.params;
      const uploadsDir = path.join(__dirname, '../../uploads');
      const jsonFile = path.join(uploadsDir, `dfd_data_${id}.json`);

      if (!fs.existsSync(jsonFile)) {
        return res.status(404).json({
          success: false,
          message: 'DFD not found'
        });
      }

      const data = JSON.parse(await fs.promises.readFile(jsonFile, 'utf8'));

      return res.json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Download DFD as ZIP
   */
  async downloadDFD(req, res) {
    try {
      const { id } = req.params;
      const uploadsDir = path.join(__dirname, '../../uploads');

      const level0 = path.join(uploadsDir, `dfd_level0_${id}.png`);
      const level1 = path.join(uploadsDir, `dfd_level1_${id}.png`);
      const level2 = path.join(uploadsDir, `dfd_level2_${id}.png`);
      const jsonData = path.join(uploadsDir, `dfd_data_${id}.json`);

      // Check if all files exist
      const files = [level0, level1, level2, jsonData];
      for (const file of files) {
        if (!fs.existsSync(file)) {
          return res.status(404).json({
            success: false,
            message: 'DFD files not found'
          });
        }
      }

      // You can implement ZIP creation here using a library like 'archiver'
      // For now, return file paths
      return res.json({
        success: true,
        data: {
          files: {
            level0: `uploads/dfd_level0_${id}.png`,
            level1: `uploads/dfd_level1_${id}.png`,
            level2: `uploads/dfd_level2_${id}.png`,
            jsonData: `uploads/dfd_data_${id}.json`
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

/**
 * Generate Mermaid Live link from code
 * Encode code to base64 and create shareable link
 */
function generateMermaidLiveLink(mermaidCode) {
  try {
    const encoded = Buffer.from(mermaidCode).toString('base64');
    return `https://mermaid.live/edit#pako:${encoded}`;
  } catch (e) {
    return 'https://mermaid.live';
  }
}

module.exports = new DFDController();