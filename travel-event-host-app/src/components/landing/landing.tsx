'use client';
import { useEffect, useState } from 'react';
import Categories from '../categories/categories';
import { CreateEventSection } from '../create-event-section/Create-event-section';
import EventsSection from '../events-section/Events-section';
import { HeroSection } from '../hero/Hero-Section';
import { getEventsBySearchQuery } from '@/app/clients/event/event-client';
import HostedEvent from '../../models/event';

export default function Landing() {
  const [hostedEvents, setHostedEvents] = useState<HostedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const searchParams = new URLSearchParams();

        const apiUrl = `/api/event/all?${searchParams.toString()}`;

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
    fetchEvents();
  }, []);

  return (
    <main>
      <HeroSection />
      <section id='#Upcoming-Events'>
        <EventsSection hostedEvents={hostedEvents} isLoading={loading} />
      </section>
      <Categories />
      <section id='Create-Event-Section'>
        <CreateEventSection />
      </section>
    </main>
  );
}
