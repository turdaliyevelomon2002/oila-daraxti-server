export const environment = {
  apiUrl: 'https://oila-daraxti-server.onrender.com',
};

export function resolveUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${environment.apiUrl}${url}`;
}
