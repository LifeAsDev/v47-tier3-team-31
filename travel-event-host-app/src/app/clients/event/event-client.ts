import Category from '@/lib/category';
import Event from '@/models/event';

export async function getEventsBySearchQuery(
  keyword: string,
  categories: Category[],
  page: number,
): Promise<any> {
  try {
    const searchParams = new URLSearchParams();

    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        searchParams.append('category', category);
      });
    }

    if (keyword) {
      searchParams.append('keyword', keyword);
    }
    searchParams.append('page', String(page));

    const apiUrl = `/api/event/search?${searchParams.toString()}`;

    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error: Cannot fetch user's events");
  }
}
