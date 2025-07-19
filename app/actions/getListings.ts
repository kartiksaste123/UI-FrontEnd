export default async function getListings() {
  try {
    const res = await fetch('http://localhost:9090/items', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch items');
    return await res.json();
  } catch (error: any) {
    throw new Error(error);
  }
}
