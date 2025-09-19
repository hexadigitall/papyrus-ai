export interface Suggestion {
  type: 'heading' | 'list' | 'table' | 'chart' | 'diagram';
  position: string;
  current: string;
  suggested?: string;
  level?: number;
  listType?: 'bullet' | 'numbered';
  chartType?: 'bar' | 'line' | 'pie' | 'scatter';
  data?: any;
  reasoning: string;
}

export interface Analysis {
  suggestions: Suggestion[];
  overall_structure: {
    title: string;
    sections: string[];
    estimated_pages: number;
    document_type: string;
  };
  typography: {
    font_suggestions: string[];
    style_recommendations: string[];
  };
}

export interface PDFOptions {
  title?: string;
  author?: string;
  template?: string;
  styles?: {
    fontFamily?: string;
    fontSize?: string;
    primaryColor?: string;
    accentColor?: string;
  };
  pdfOptions?: {
    format?: string;
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
  };
}

export interface ChartData {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter' | 'bubble';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }>;
  };
}

export interface UploadResult {
  success: boolean;
  upload_id: string;
  extracted_text: string;
  metadata: {
    originalName: string;
    size: number;
    type: string;
    format: string;
    uploadTime: string;
  };
  statistics: {
    character_count: number;
    word_count: number;
    line_count: number;
  };
}

export interface PDFResult {
  success: boolean;
  pdf: {
    filename: string;
    path: string;
    url: string;
    size: number;
  };
  generation_time: string;
}
