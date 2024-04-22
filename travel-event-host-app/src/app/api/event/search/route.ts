import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let page: number = parseInt(searchParams.get('page') || '1', 10);
  const pageSize: number = parseInt(searchParams.get('pageSize') || '10', 10);
  const keyword = searchParams.get('keyword');
  const categories: string[] = searchParams.getAll('category');

  await connectMongoDB();

  let aggregatePipeline: any[] = [];

  if (keyword) {
    aggregatePipeline = aggregatePipeline.concat(
      {
        $match: {
          title: { $regex: keyword, $options: 'i' },
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    );
  }

  if (categories.length > 0) {
    aggregatePipeline[0].$match.$or = [{ categories: { $in: categories } }];
  }

  const allEvents = await Event.aggregate(aggregatePipeline);
  if (allEvents.length === 0 || !allEvents[0].metadata[0]) {
    // Si no hay eventos o no se encontró metadata, significa que no hay eventos que coincidan con la búsqueda
    return NextResponse.json(
      { totalCount: 0, totalPages: 1, currentPage: page, events: [], message: 'Not found events' },
      { status: 200 },
    );
  }

  const totalCount = allEvents[0].metadata[0].totalCount;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (page > totalPages) {
    // Si la página seleccionada es mayor que el número total de páginas,
    // establece la página en 1 y vuelve a consultar los eventos
    page = 1;
    aggregatePipeline[1].$facet.data = [{ $skip: 0 }, { $limit: pageSize }];
    const updatedEvents = await Event.aggregate(aggregatePipeline);
    return NextResponse.json(
      {
        totalCount,
        totalPages,
        currentPage: page,
        events: updatedEvents[0].data,
        message: 'Page does not exist. Showing events from page 1.',
      },
      { status: 200 },
    );
  }

  if (allEvents[0].data.length > 0) {
    return NextResponse.json(
      { totalCount, totalPages, currentPage: page, events: allEvents[0].data },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      { totalCount: 0, totalPages, currentPage: page, events: [], message: 'Not found events' },
      { status: 404 },
    );
  }
}
