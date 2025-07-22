
export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  score: number; // 0-100 quality score
}

export class MetadataValidator {
  static validateCabinetData(data: any): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Critical validations
    if (!data.parameters || data.parameters.length === 0) {
      issues.push('No parameters defined');
      score -= 30;
    }

    // Check for essential dimensions
    const hasWidth = data.parameters?.some((p: string) => 
      p.toLowerCase().includes('width') || p.toLowerCase().includes('w:')
    );
    const hasHeight = data.parameters?.some((p: string) => 
      p.toLowerCase().includes('height') || p.toLowerCase().includes('h:')
    );
    const hasDepth = data.parameters?.some((p: string) => 
      p.toLowerCase().includes('depth') || p.toLowerCase().includes('d:')
    );

    if (!hasWidth) {
      issues.push('Missing width specification');
      score -= 20;
    }
    if (!hasHeight) {
      issues.push('Missing height specification');
      score -= 20;
    }
    if (!hasDepth) {
      warnings.push('Missing depth specification');
      score -= 10;
    }

    // Version validation
    if (!data.version || data.version === 'Unknown') {
      warnings.push('No version information available');
      score -= 5;
    }

    // Parts validation
    if (!data.parts || data.parts.length === 0) {
      warnings.push('No parts defined - may be an assembly file');
      score -= 10;
    }

    // Logical consistency checks
    if (data.parameters) {
      const dimensionIssues = this.validateDimensions(data.parameters);
      issues.push(...dimensionIssues.errors);
      warnings.push(...dimensionIssues.warnings);
      score -= dimensionIssues.errors.length * 10;
      score -= dimensionIssues.warnings.length * 5;
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      score: Math.max(0, score)
    };
  }

  private static validateDimensions(parameters: string[]): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Extract numeric values from parameters
    const dimensions: Record<string, number> = {};
    
    parameters.forEach(param => {
      const lowerParam = param.toLowerCase();
      const match = param.match(/(\d+(?:\.\d+)?)/);
      const value = match ? parseFloat(match[1]) : null;
      
      if (value !== null) {
        if (lowerParam.includes('width')) dimensions.width = value;
        else if (lowerParam.includes('height')) dimensions.height = value;
        else if (lowerParam.includes('depth')) dimensions.depth = value;
      }
    });

    // Validate realistic dimensions (assuming inches)
    Object.entries(dimensions).forEach(([dim, value]) => {
      if (value <= 0) {
        errors.push(`Invalid ${dim}: ${value} (must be positive)`);
      } else if (value > 120) { // 10 feet
        warnings.push(`Unusually large ${dim}: ${value}" (over 10 feet)`);
      } else if (value < 1) {
        warnings.push(`Very small ${dim}: ${value}" (less than 1 inch)`);
      }
    });

    // Check proportions
    if (dimensions.width && dimensions.height) {
      const ratio = dimensions.width / dimensions.height;
      if (ratio > 5 || ratio < 0.2) {
        warnings.push(`Unusual width/height ratio: ${ratio.toFixed(2)}`);
      }
    }

    return { errors, warnings };
  }

  static generateQualityReport(data: any, validation: ValidationResult): string {
    const lines: string[] = [];
    
    lines.push(`QUALITY ASSESSMENT: ${validation.score}/100`);
    lines.push('');
    
    if (validation.isValid) {
      lines.push('✓ File structure is valid');
    } else {
      lines.push('✗ File has critical issues');
    }
    
    if (validation.issues.length > 0) {
      lines.push('');
      lines.push('CRITICAL ISSUES:');
      validation.issues.forEach(issue => lines.push(`  • ${issue}`));
    }
    
    if (validation.warnings.length > 0) {
      lines.push('');
      lines.push('WARNINGS:');
      validation.warnings.forEach(warning => lines.push(`  • ${warning}`));
    }
    
    lines.push('');
    lines.push('METADATA SUMMARY:');
    lines.push(`  • File Type: ${data.fileType}`);
    lines.push(`  • Version: ${data.version || 'Unknown'}`);
    lines.push(`  • Parameters: ${data.parameters?.length || 0}`);
    lines.push(`  • Parts: ${data.parts?.length || 0}`);
    lines.push(`  • Constraints: ${data.constraints?.length || 0}`);
    
    return lines.join('\n');
  }
}
