'use client';
import Event from '@/components/event/event';
import { useEffect, useState } from 'react';
export default function Page({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUrl = `/api/event/${params.id}`;
        const res = await fetch(fetchUrl, {
          method: 'GET',
          headers: { 'Content-type': 'application/json' },
        });
        if (res.ok) {
          const resData = await res.json();
          setEventData(resData.eventFound);
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [params.id]);
  return <Event eventData={eventData} />;
}
