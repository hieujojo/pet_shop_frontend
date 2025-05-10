export async function fetchContent(locale: string) {
    const res = await fetch(`${process.env.BACKEND_URL}/api/content?locale=${locale}`);
    if (!res.ok) throw new Error('Failed to fetch content');
    return res.json();
  }