interface HttpErrorDetail {
  domain: string;
  message: string;
  reason: string;
}

interface HttpError {
  error: HttpErrorDetail;
}

interface HttpHeaders {
  normalizedNames: Map<string, string>;
  lazyUpdate: any[] | null;
  lazyInit: () => void;
}

export interface HttpErrorResponse {
  error: HttpError;
  headers: HttpHeaders;
  message: string;
  name: string;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
}

