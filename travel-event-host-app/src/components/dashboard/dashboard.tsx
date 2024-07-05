'use client';
import { useState, useEffect } from 'react';
import EventsSection from '../events-section/Events-section';
import HostedEvent from '@/models/event';
import { useOnboardingContext } from '@/lib/context';

export default function Dashboard() {
  const [hostedEvents, setHostedEvents] = useState<HostedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useOnboardingContext();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append('id', session._id);

        const apiUrl = `/api/event/user?${searchParams.toString()}`;

        const response = await fetch(apiUrl);

        const data = await response.json();
        setLoading(false);
        if (response.ok) {
          setHostedEvents(data.events);
          return data;
        } else {
          return null;
        }
      } catch (error) {
        throw new Error("Error: Cannot fetch user's events");
      }
    };

    if (session) fetchEvents();
  }, [session]);

  return <EventsSection title={'My Events'} hostedEvents={hostedEvents} isLoading={loading} />;
}
