const MATTERPORT_SHOWCASE_REGEX = /^https:\/\/my\.matterport\.com\/show\/\?m=[a-zA-Z0-9]+$/;

export function isValidMatterportUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  return MATTERPORT_SHOWCASE_REGEX.test(url);
}

export function extractMatterportScanId(url: string): string | null {
  const match = url.match(/[?&]m=([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export function buildMatterportEmbedUrl(scanId: string): string {
  return `https://my.matterport.com/show/?m=${scanId}&play=1`;
}
