'use client';
import { useState } from 'react';
import styles from './styles.module.css';
import Event from '@/models/event';
import Image from 'next/image';
export default function Event({ eventData }: { eventData: Event | undefined }) {
  const [attendeesMenuIsOpen, setAttendeesMenuIsOpen] = useState(false);
  const [attendeesSearchInput, setAttendeesSearchInput] = useState('');
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
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Lucia</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Pedro</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Tony</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
              <div className={styles.attendeesMenuItem}>
                <div className={styles.attendeesMenuItemImg}></div>
                <p className={styles.attendeesMenuItemName}>Ana</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <section className={styles.eventDetailsSection}>
        <div className={styles.defaultMargin}>
          <Image
            className={styles.eventHeroImage}
            width={500}
            height={500}
            alt=''
            src={'/images/event/mock-images/mock-image-02.svg'}
          />
          <div className={styles.mainInfo}>
            <h2>Code Event</h2>
            <div className={styles.dateAndAddress}>8 fev. 2024 02:00 PM - São Paulo, Brazil</div>
          </div>
          <p className={styles.hostedBy}>
            Hosted By
            <br />
            Angelo
          </p>
          <header>Event Details</header>
          <p className={styles.description}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <button className={styles.subscribeBtn}>Subscribe to event</button>
        </div>
      </section>
      <section className={styles.participantsSection}>
        <div className={styles.defaultMargin}>
          <header>Speaker</header>
          <p className={styles.hostName}>Angelo Sarmiento</p>
          <div className={styles.attendees}>
            <div className={styles.attendeesTopBox}>
              <p className={styles.attendeesCount}>Attendees(31)</p>
              <p onClick={() => setAttendeesMenuIsOpen(true)} className={styles.attendeesSeeAll}>
                See all
              </p>
            </div>
            <div className={styles.attendeesImgBox}>
              <div className={styles.attendeesLink}>
                <div className={styles.attendeesImgRounded}></div>
                <p className={styles.attendeesName}>Lucia</p>
              </div>
              <div className={styles.attendeesLink}>
                <div className={styles.attendeesImgRounded}></div>
                <p className={styles.attendeesName}>Lucia</p>
              </div>
              <div className={styles.attendeesLink}>
                <div className={styles.attendeesImgRounded}></div>
                <p className={styles.attendeesName}>Lucia</p>
              </div>
              <div onClick={() => setAttendeesMenuIsOpen(true)} className={styles.attendeesLink}>
                <div className={styles.attendeesImgRounded}></div>
                <p className={styles.attendeesMoreBtn}>More</p>
              </div>
              <div className={styles.attendeesMoreBox}></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
