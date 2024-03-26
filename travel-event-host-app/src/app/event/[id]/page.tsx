'use client';
import Event from '@/components/event/event';
import { useEffect, useState } from 'react';
export default function Page({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState();
  const [attendeesArr, setAttendeesArr] = useState();

  useEffect(() => {
    const fetchAttendeesData = async (ids: string[]) => {
      try {
        const fetchUrl = `/api/event?id=${ids.join(',')}`;
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
          const participantIds = resData.participantIds.map(
            (participant: { userId: string; timeStamp: Date }) => participant.userId,
          );
          const allIds = [resData.eventCreatorId, ...participantIds];
          fetchAttendeesData(allIds);
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [params.id]);
  return <Event eventData={eventData} attendeesArr={attendeesArr} />;
}
