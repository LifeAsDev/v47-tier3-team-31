import { useState } from 'react';
import styles from './styles.module.css';
import Event from '@/models/event';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import { useOnboardingContext } from '@/lib/context';
import Attendees from '@/models/attendees';
import AvatarImage from '@/components/avatar/avatarImage/avatarImage';

export default function Event({
  eventData,
  attendeesArr,
  setAttendeesArr,
}: {
  setAttendeesArr: React.Dispatch<React.SetStateAction<Attendees[] | undefined>>;
  eventData: Event | undefined;
  attendeesArr: Attendees[] | undefined;
}) {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return date.toLocaleDateString('en-US', options);
  }

  const { session, status } = useOnboardingContext();
  const [attendeesMenuIsOpen, setAttendeesMenuIsOpen] = useState(false);
  const [attendeesSearchInput, setAttendeesSearchInput] = useState('');

  const subscribeToEvent = () => {
    const userAttende = {
      imageUrl: session.imageUrl,
      firstName: session.firstName,
      lastName: session.lastName,
      _id: session._id,
    };
    setAttendeesArr((prev): Attendees[] => [...(prev || []), userAttende]);
    const fetchSubscribe = async () => {
      try {
        const fetchUrl = `/api/event/${eventData?._id}/subscribe`;
        const res = await fetch(fetchUrl, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ userId: session._id }),
        });
        const resData = await res.json();

        if (res.ok) {
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscribe();
  };
  const unSubscribeToEvent = () => {
    setAttendeesArr((prevAttendeesArr) =>
      (prevAttendeesArr || []).filter((attende) => attende._id !== session._id),
    );

    const fetchUnsubscribe = async () => {
      try {
        const fetchUrl = `/api/event/${eventData?._id}/unsubscribe`;

        const res = await fetch(fetchUrl, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ userId: session._id }),
        });
        if (res.ok) {
          const resData = await res.json();
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnsubscribe();
  };
  return (
    <main className={styles.main}>
      {attendeesMenuIsOpen ? (
        <div className={styles.attendeesMenuBg}>
          <div className={styles.attendeesMenu}>
            <div className={styles.attendeesMenuTop}>
              <div className={styles.inputSearch}>
                <input
                  value={attendeesSearchInput}
                  onChange={(e) => setAttendeesSearchInput(e.target.value)}
                  type='text'
                ></input>
                <svg
                  width='1.25em'
                  height='1.25em'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z'
                    fill='#0F0F0F'
                  />
                </svg>
              </div>
              <svg
                onClick={() => setAttendeesMenuIsOpen(false)}
                className={`${styles.closeIcon}`}
                width='1.5em'
                height='1.5em'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z'
                  fill='white'
                />
              </svg>
            </div>
            <div className={`${styles.attendeesMenuBottom} scrollbar1`}>
              {attendeesArr
                ? attendeesArr
                    .filter((attende) => {
                      const fullName = `${attende.firstName} ${attende.lastName}`;
                      return fullName.toLowerCase().includes(attendeesSearchInput.toLowerCase());
                    })
                    .map((attende, i) => (
                      <div key={i} className={styles.attendeesMenuItem}>
                        <div className={styles.attendeesMenuItemImg}>
                          <AvatarImage attende={attende} />
                        </div>
                        <p className={styles.attendeesMenuItemName}>
                          {`${attende.firstName} ${attende.lastName}`}
                        </p>
                      </div>
                    ))
                : ''}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <section className={styles.eventDetailsSection}>
        <div className={styles.defaultMargin}>
          {eventData ? (
            <>
              <Image
                className={styles.eventHeroImage}
                width={500}
                height={500}
                alt=''
                src={eventData.imageUrl || '/images/event/mock-images/mock-image-02.svg'}
              />
              <div className={styles.mainInfo}>
                <h2>{eventData.title}</h2>
                <div className={styles.dateAndAddress}>
                  {formatDate(eventData.startDate.toString())}
                  {eventData.startDate === eventData.endDate
                    ? ''
                    : ` - ${formatDate(eventData.endDate.toString())}`}
                </div>
              </div>
              {attendeesArr ? (
                <p className={styles.hostedBy}>
                  Hosted By
                  <br />
                  {`${attendeesArr[0].firstName} ${attendeesArr[0].lastName}`}
                </p>
              ) : (
                <p className={styles.hostedBy}>
                  <Skeleton variant='text' sx={{ fontSize: '1.1em', width: '6em' }} />
                  <Skeleton variant='text' sx={{ fontSize: '1.1em', width: '5em' }} />
                </p>
              )}
              <header>Event Details</header>
              <p className={styles.description}>{eventData.description}</p>
              {attendeesArr && session ? (
                attendeesArr[0]._id === session._id ? (
                  ''
                ) : attendeesArr?.some((attende) => attende._id === session._id) ? (
                  <button onClick={unSubscribeToEvent} className={styles.subscribeBtn}>
                    Unsubscribe to event
                  </button>
                ) : (
                  <button onClick={subscribeToEvent} className={styles.subscribeBtn}>
                    Subscribe to event
                  </button>
                )
              ) : (
                ''
              )}
            </>
          ) : (
            <>
              <Skeleton variant='rectangular' sx={{ borderRadius: 0, height: '320px' }} />
              <div className={styles.mainInfo}>
                <Skeleton
                  variant='text'
                  sx={{ width: '8em', lineHeight: '1em', fontSize: '2.5em' }}
                />
                <Skeleton
                  variant='text'
                  sx={{ width: '8em', lineHeight: '1em', fontSize: '2.5em' }}
                />
              </div>
              <p className={styles.hostedBy}>
                <Skeleton variant='text' sx={{ fontSize: '1.1em', width: '6em' }} />
                <Skeleton variant='text' sx={{ fontSize: '1.1em', width: '5em' }} />
              </p>
              <header>Event Details</header>
              <p className={styles.description}>
                <Skeleton variant='text' sx={{}} />
                <Skeleton variant='text' sx={{}} />
                <Skeleton variant='text' sx={{}} />
                <Skeleton variant='text' sx={{}} />
                <Skeleton variant='text' sx={{}} />
              </p>
            </>
          )}
        </div>
      </section>
      <section className={styles.participantsSection}>
        <div className={styles.defaultMargin}>
          {attendeesArr ? (
            <>
              <header>Speaker</header>
              <p className={styles.hostName}>{attendeesArr[0].firstName}</p>
              <div className={styles.attendees}>
                <div className={styles.attendeesTopBox}>
                  <p className={styles.attendeesCount}>Attendees({attendeesArr.length})</p>
                  <p
                    onClick={() => setAttendeesMenuIsOpen(true)}
                    className={styles.attendeesSeeAll}
                  >
                    See all
                  </p>
                </div>
                <div className={styles.attendeesImgBox}>
                  {attendeesArr.slice(0, 2).map((attende, i) => (
                    <div key={i} className={styles.attendeesLink}>
                      <div className={styles.attendeesImgRounded}>
                        <AvatarImage attende={attende} />
                      </div>
                      <p className={styles.attendeesName}>
                        {`${attende.firstName} ${attende.lastName}`}
                      </p>
                    </div>
                  ))}
                  {attendeesArr.length === 4 ? (
                    <div className={styles.attendeesLink}>
                      <div className={styles.attendeesImgRounded}>
                        <AvatarImage attende={attendeesArr[4]} />
                      </div>
                      <p className={styles.attendeesName}>
                        {`${attendeesArr[4].firstName} ${attendeesArr[4].lastName}`}
                      </p>
                    </div>
                  ) : attendeesArr.length > 5 ? (
                    <>
                      <div
                        onClick={() => setAttendeesMenuIsOpen(true)}
                        className={styles.attendeesLink}
                      >
                        <div className={styles.attendeesImgRounded}>
                          <AvatarImage attende={attendeesArr[4]} />
                        </div>
                        <p className={styles.attendeesMoreBtn}>More</p>
                      </div>
                      <div className={styles.attendeesMoreBox}>
                        <div className={styles.attendeesImgRounded}>
                          <AvatarImage attende={attendeesArr[5]} />
                        </div>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <header>Speaker</header>
              <Skeleton variant='text' sx={{ width: '12em', fontSize: '1.3em' }} />
              <div className={styles.attendees}>
                <div className={styles.attendeesTopBox}>
                  <Skeleton variant='text' sx={{ width: '10em' }} />
                </div>
                <div className={styles.attendeesImgBox}>
                  <div className={styles.attendeesLink}>
                    <Skeleton
                      variant='rectangular'
                      sx={{ borderRadius: '50%', width: '9em', height: '12em' }}
                    />
                    <Skeleton variant='text' sx={{ width: '5em', fontSize: '1.2em' }} />
                  </div>
                  <div className={styles.attendeesLink}>
                    <Skeleton
                      variant='rectangular'
                      sx={{ borderRadius: '50%', width: '9em', height: '12em' }}
                    />
                    <Skeleton variant='text' sx={{ width: '5em', fontSize: '1.2em' }} />
                  </div>
                  <div className={styles.attendeesLink}>
                    <Skeleton
                      variant='rectangular'
                      sx={{ borderRadius: '50%', width: '9em', height: '12em' }}
                    />
                    <Skeleton variant='text' sx={{ width: '5em', fontSize: '1.2em' }} />
                  </div>
                  <div className={styles.attendeesLink}>
                    <Skeleton
                      variant='rectangular'
                      sx={{ borderRadius: '50%', width: '9em', height: '12em' }}
                    />
                    <Skeleton variant='text' sx={{ width: '5em', fontSize: '1.2em' }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
