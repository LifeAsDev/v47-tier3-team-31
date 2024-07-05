'use client';
import styles from './styles.module.css';

import { getEventsBySearchQuery } from '@/app/clients/event/event-client';
import Category from '@/lib/category';
import Event from '@/models/event';
import { Box, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EventCard from '../event/event-card/Event-card';
import FilterBox from './searchEventsFilterBox/filterBox';
import { SearchInput } from './searchInput/searchInput';
import Link from 'next/link';

export default function SearchSection({ keyword }: { keyword: string }) {
  const [sortBy, setSortBy] = useState<string>('Date');
  const [resultEventList, setResultEventList] = useState<Event[] | null>([]);
  const [categoryCheckboxState, setCategoryCheckboxState] = useState<{ [key in string]: boolean }>(
    {},
  );
  const [filterBoxIsOpen, setFilterBoxIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleSearch = (searchInput: string) => {
    setPage(1);
    const url = `/search-events/${searchInput}`; // Construct the URL
    router.push(url); // Navigate to the URL
  };

  useEffect(() => {
    const fetch = async () => {
      const eventsResultFetch = await getEventsBySearchQuery(
        keyword,
        getCheckedCategories(categoryCheckboxState),
        page,
      );
      if (eventsResultFetch) {
        setTotalPages(eventsResultFetch.totalPages);
        setPage(eventsResultFetch.currentPage);
        setResultEventList(eventsResultFetch.events);
      }
    };
    if (keyword !== '') fetch();
  }, [categoryCheckboxState, keyword, page]);

  const getCheckedCategories = (checkboxState: { [key in string]: boolean }): Category[] => {
    // This gets only the checked categories checkboxes
    return Object.entries(checkboxState).reduce((acc: Category[], [category, checked]) => {
      if (checked) {
        acc.push(category as Category);
      }
      return acc;
    }, []);
  };

  return (
    <main>
      <section className={styles.section}>
        <div
          onClick={() => setFilterBoxIsOpen(false)}
          className={`${styles.overlay} ${filterBoxIsOpen ? styles.open : ''}`}
        ></div>

        <FilterBox
          filterBoxIsOpen={filterBoxIsOpen}
          setCategories={setCategoryCheckboxState}
          categories={categoryCheckboxState}
          setFilterBoxIsOpen={setFilterBoxIsOpen}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '2em' }}>
            <SearchInput handleSearch={handleSearch} keyword={keyword} />
            <Select
              sx={{
                backgroundColor: 'white',
                minWidth: '8em',
                height: 'min-content',
              }}
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as string)}
            >
              <MenuItem value='Relevance'>Revelance</MenuItem>
              <MenuItem value='Date'>Date</MenuItem>
            </Select>
          </Box>
          <p onClick={() => setFilterBoxIsOpen(true)} className={styles.filterBtn}>
            Filters
          </p>
          <ul className={styles.eventsGrid}>
            {resultEventList && resultEventList.length > 0 ? (
              resultEventList.map((event) => (
                <li key={event['_id']}>
                  <EventCard hostedEvent={event} />
                </li>
              ))
            ) : keyword && resultEventList === null ? (
              <p className={styles.eventNotFound}>No events found for "{keyword}"</p>
            ) : (
              <p className={styles.eventNotFound}>Please enter search text</p>
            )}
          </ul>
        </Box>
      </section>
      <div className={styles.pageBox}>
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            onClick={() => setPage(index + 1)}
            className={`${styles.pageItem} ${page === index + 1 ? styles.pageSelect : ''}`}
            key={index}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </main>
  );
}
