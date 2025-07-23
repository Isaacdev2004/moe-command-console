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
  private static readonly SUPPORTED_EXTENSIONS = ['.moz', '.dat', '.des', '.xml'];

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
        case '.moz':
          return this.parseMozFile(file, content);
        case '.dat':
          return this.parseDatFile(file, content);
        case '.des':
          return this.parseDesFile(file, content);
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

  private static parseMozFile(file: File, content: string): ParsedFileData {
    const parameters: string[] = [];
    const parts: string[] = [];
    const issues: string[] = [];
    
    let cabinetType = 'Mozaik Cabinet';
    let version = 'MOZ 1.0';

    // Parse MOZ file structure
    const lines = content.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('VERSION=')) {
        version = trimmed.substring(8);
      } else if (trimmed.startsWith('CABINET_TYPE=') || trimmed.startsWith('TYPE=')) {
        cabinetType = trimmed.substring(trimmed.indexOf('=') + 1);
      } else if (trimmed.includes('=') && (trimmed.includes('WIDTH') || trimmed.includes('HEIGHT') || trimmed.includes('DEPTH'))) {
        const [key, value] = trimmed.split('=');
        parameters.push(`${key.replace('_', ' ')}: ${value}`);
      } else if (trimmed.startsWith('PART_') || trimmed.startsWith('COMPONENT_')) {
        parts.push(trimmed.substring(trimmed.indexOf('_') + 1));
      }
    });

    // Basic validation for MOZ files
    if (!parameters.some(p => p.includes('WIDTH'))) {
      issues.push('Missing width specification');
    }
    if (!parameters.some(p => p.includes('HEIGHT'))) {
      issues.push('Missing height specification');
    }
    if (parts.length === 0) {
      issues.push('No parts defined in MOZ file');
    }

    return {
      fileName: file.name,
      fileType: 'MOZ',
      version,
      cabinetType,
      parameters,
      parts,
      constraints: [],
      issues,
      metadata: { lineCount: lines.length }
    };
  }

  private static parseDatFile(file: File, content: string): ParsedFileData {
    const parameters: string[] = [];
    const parts: string[] = [];
    const issues: string[] = [];
    
    let cabinetType = 'Mozaik Data File';
    let version = 'DAT 1.0';

    // Parse DAT file structure (binary or structured data format)
    const lines = content.split('\n').filter(line => line.trim());
    
    // Look for structured data patterns
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.includes('=')) {
        const [key, value] = trimmed.split('=');
        const cleanKey = key.trim().toUpperCase();
        
        if (cleanKey.includes('VERSION')) {
          version = value.trim();
        } else if (cleanKey.includes('TYPE') || cleanKey.includes('CABINET')) {
          cabinetType = value.trim();
        } else if (cleanKey.includes('WIDTH') || cleanKey.includes('HEIGHT') || cleanKey.includes('DEPTH') || cleanKey.includes('SIZE')) {
          parameters.push(`${cleanKey.replace('_', ' ')}: ${value.trim()}`);
        }
      } else if (trimmed.length > 0 && !trimmed.startsWith('#') && !trimmed.startsWith('//')) {
        // Potential part name or component
        if (trimmed.length < 50) { // Reasonable part name length
          parts.push(trimmed);
        }
      }
    });

    // DAT file validation
    if (parameters.length === 0) {
      issues.push('No parameters found in DAT file');
    }
    if (content.length < 100) {
      issues.push('DAT file appears to be too small or empty');
    }

    return {
      fileName: file.name,
      fileType: 'DAT',
      version,
      cabinetType,
      parameters,
      parts,
      constraints: [],
      issues,
      metadata: { 
        lineCount: lines.length,
        fileSize: content.length 
      }
    };
  }

  private static parseDesFile(file: File, content: string): ParsedFileData {
    const parameters: string[] = [];
    const parts: string[] = [];
    const constraints: string[] = [];
    const issues: string[] = [];
    
    let cabinetType = 'Mozaik Design File';
    let version = 'DES 1.0';

    // Parse DES (Design) file structure
    const lines = content.split('\n').filter(line => line.trim());
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check for section headers
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        currentSection = trimmed.slice(1, -1).toUpperCase();
        return;
      }
      
      if (trimmed.includes('=')) {
        const [key, value] = trimmed.split('=');
        const cleanKey = key.trim().toUpperCase();
        const cleanValue = value.trim();
        
        if (cleanKey.includes('VERSION')) {
          version = cleanValue;
        } else if (cleanKey.includes('TYPE') || cleanKey.includes('CABINET')) {
          cabinetType = cleanValue;
        } else if (currentSection === 'DIMENSIONS' || cleanKey.includes('WIDTH') || cleanKey.includes('HEIGHT') || cleanKey.includes('DEPTH')) {
          parameters.push(`${cleanKey.replace('_', ' ')}: ${cleanValue}`);
        } else if (currentSection === 'CONSTRAINTS' || cleanKey.includes('CONSTRAINT') || cleanKey.includes('RULE')) {
          constraints.push(`${cleanKey}: ${cleanValue}`);
        }
      } else if (currentSection === 'PARTS' && trimmed.length > 0) {
        parts.push(trimmed);
      }
    });

    // DES file validation
    if (!parameters.some(p => p.includes('WIDTH'))) {
      issues.push('Missing width specification in design file');
    }
    if (!parameters.some(p => p.includes('HEIGHT'))) {
      issues.push('Missing height specification in design file');
    }
    if (parts.length === 0) {
      issues.push('No parts defined in design file');
    }

    return {
      fileName: file.name,
      fileType: 'DES',
      version,
      cabinetType,
      parameters,
      parts,
      constraints,
      issues,
      metadata: { 
        lineCount: lines.length,
        sectionsFound: currentSection ? 1 : 0
      }
    };
  }

  private static parseXMLFile(file: File, content: string): ParsedFileData {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'application/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
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
