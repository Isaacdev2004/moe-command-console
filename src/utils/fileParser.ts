
interface ParsedFileData {
  fileName: string;
  fileType: string;
  version?: string;
  cabinetType?: string;
  parameters?: string[];
  parts?: string[];
  constraints?: string[];
  issues?: string[];
  metadata?: Record<string, any>;
}

interface ParsingError {
  type: 'PARSING_ERROR' | 'UNSUPPORTED_FORMAT' | 'CORRUPTED_FILE';
  message: string;
  details?: string;
}

export class FileParser {
  private static readonly SUPPORTED_EXTENSIONS = ['.cab', '.cabx', '.mzb', '.xml'];

  static async parseFile(file: File): Promise<ParsedFileData | ParsingError> {
    const extension = this.getFileExtension(file.name);
    
    if (!this.SUPPORTED_EXTENSIONS.includes(extension)) {
      return {
        type: 'UNSUPPORTED_FORMAT',
        message: `Unsupported file format: ${extension}`,
        details: `Supported formats: ${this.SUPPORTED_EXTENSIONS.join(', ')}`
      };
    }

    try {
      const content = await this.readFileContent(file);
      
      switch (extension) {
        case '.xml':
          return this.parseXMLFile(file, content);
        case '.cab':
        case '.cabx':
          return this.parseCABFile(file, content);
        case '.mzb':
          return this.parseMZBFile(file, content);
        default:
          return {
            type: 'UNSUPPORTED_FORMAT',
            message: `Parser not implemented for ${extension}`,
          };
      }
    } catch (error) {
      return {
        type: 'PARSING_ERROR',
        message: 'Failed to parse file',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static getFileExtension(fileName: string): string {
    return fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  }

  private static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static parseXMLFile(file: File, content: string): ParsedFileData {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseDocument(content);
      
      if (xmlDoc.getElementsByTagName('parseroror').length > 0) {
        throw new Error('Invalid XML format');
      }

      const metadata = this.extractXMLMetadata(xmlDoc);
      const parameters = this.extractXMLParameters(xmlDoc);
      const parts = this.extractXMLParts(xmlDoc);
      const constraints = this.extractXMLConstraints(xmlDoc);
      const issues = this.detectXMLIssues(xmlDoc, content);

      return {
        fileName: file.name,
        fileType: 'XML',
        version: metadata.version,
        cabinetType: metadata.cabinetType,
        parameters,
        parts,
        constraints,
        issues,
        metadata
      };
    } catch (error) {
      throw new Error(`XML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static parseCABFile(file: File, content: string): ParsedFileData {
    // CAB file parsing logic - simplified for demo
    const lines = content.split('\n').filter(line => line.trim());
    const parameters: string[] = [];
    const parts: string[] = [];
    const issues: string[] = [];
    
    let cabinetType = 'Unknown Cabinet';
    let version = 'Unknown';

    // Extract basic info from CAB file format
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('VERSION=')) {
        version = trimmed.substring(8);
      } else if (trimmed.startsWith('CABINET_TYPE=')) {
        cabinetType = trimmed.substring(13);
      } else if (trimmed.startsWith('WIDTH=') || trimmed.startsWith('HEIGHT=') || trimmed.startsWith('DEPTH=')) {
        parameters.push(trimmed.replace('=', ': ').replace('_', ' '));
      } else if (trimmed.startsWith('PART_')) {
        parts.push(trimmed.substring(5));
      }
    });

    // Basic validation
    if (!parameters.some(p => p.includes('WIDTH'))) {
      issues.push('Missing width specification');
    }
    if (!parameters.some(p => p.includes('HEIGHT'))) {
      issues.push('Missing height specification');
    }

    return {
      fileName: file.name,
      fileType: 'CAB',
      version,
      cabinetType,
      parameters,
      parts,
      constraints: [],
      issues,
      metadata: { lineCount: lines.length }
    };
  }

  private static parseMZBFile(file: File, content: string): ParsedFileData {
    // MZB (Mozaik) file parsing logic
    const parameters: string[] = [];
    const parts: string[] = [];
    const issues: string[] = [];
    
    // Simulate Mozaik file structure parsing
    const sections = content.split('[').filter(section => section.trim());
    let cabinetType = 'Mozaik Cabinet';
    let version = 'MZB 1.0';

    sections.forEach(section => {
      const lines = section.split('\n');
      const sectionName = lines[0]?.replace(']', '').trim();
      
      if (sectionName === 'GENERAL') {
        lines.slice(1).forEach(line => {
          if (line.includes('=')) {
            const [key, value] = line.split('=');
            if (key.trim().toLowerCase().includes('type')) {
              cabinetType = value.trim();
            } else if (key.trim().toLowerCase().includes('version')) {
              version = value.trim();
            }
          }
        });
      } else if (sectionName === 'DIMENSIONS') {
        lines.slice(1).forEach(line => {
          if (line.includes('=')) {
            parameters.push(line.trim());
          }
        });
      } else if (sectionName === 'PARTS') {
        lines.slice(1).forEach(line => {
          if (line.trim() && !line.includes('=')) {
            parts.push(line.trim());
          }
        });
      }
    });

    // Detect common Mozaik issues
    if (parameters.length === 0) {
      issues.push('No dimensions found in MZB file');
    }
    if (parts.length === 0) {
      issues.push('No parts defined in cabinet');
    }

    return {
      fileName: file.name,
      fileType: 'MZB',
      version,
      cabinetType,
      parameters,
      parts,
      constraints: [],
      issues,
      metadata: { sectionCount: sections.length }
    };
  }

  private static extractXMLMetadata(xmlDoc: Document): Record<string, any> {
    const metadata: Record<string, any> = {};
    
    // Extract version info
    const versionElement = xmlDoc.querySelector('version, Version, VERSION');
    if (versionElement) {
      metadata.version = versionElement.textContent || 'Unknown';
    }
    
    // Extract cabinet type
    const typeElement = xmlDoc.querySelector('type, cabinetType, cabinet-type');
    if (typeElement) {
      metadata.cabinetType = typeElement.textContent || 'Unknown Cabinet';
    }
    
    return metadata;
  }

  private static extractXMLParameters(xmlDoc: Document): string[] {
    const parameters: string[] = [];
    const paramElements = xmlDoc.querySelectorAll('parameter, param, dimension, size');
    
    paramElements.forEach(element => {
      const name = element.getAttribute('name') || element.tagName;
      const value = element.textContent || element.getAttribute('value') || '';
      const unit = element.getAttribute('unit') || '';
      
      if (value) {
        parameters.push(`${name}: ${value}${unit}`);
      }
    });
    
    return parameters;
  }

  private static extractXMLParts(xmlDoc: Document): string[] {
    const parts: string[] = [];
    const partElements = xmlDoc.querySelectorAll('part, component, element');
    
    partElements.forEach(element => {
      const name = element.getAttribute('name') || element.textContent || 'Unnamed Part';
      const type = element.getAttribute('type') || '';
      const partName = type ? `${name} (${type})` : name;
      
      if (partName.trim()) {
        parts.push(partName.trim());
      }
    });
    
    return parts;
  }

  private static extractXMLConstraints(xmlDoc: Document): string[] {
    const constraints: string[] = [];
    const constraintElements = xmlDoc.querySelectorAll('constraint, rule, limitation');
    
    constraintElements.forEach(element => {
      const constraint = element.textContent || element.getAttribute('description') || '';
      if (constraint.trim()) {
        constraints.push(constraint.trim());
      }
    });
    
    return constraints;
  }

  private static detectXMLIssues(xmlDoc: Document, content: string): string[] {
    const issues: string[] = [];
    
    // Check for missing required elements
    if (!xmlDoc.querySelector('parameter, param, dimension')) {
      issues.push('No parameters or dimensions found');
    }
    
    // Check for empty values
    const emptyElements = xmlDoc.querySelectorAll('*:empty');
    if (emptyElements.length > 0) {
      issues.push(`${emptyElements.length} empty elements detected`);
    }
    
    // Check for malformed content
    if (content.includes('NaN') || content.includes('undefined')) {
      issues.push('Invalid numeric values detected');
    }
    
    return issues;
  }
}
