import styles from './styles.module.css';
import Event from '@/models/event';
import Image from 'next/image';
export default function Event({ eventData }: { eventData: Event | undefined }) {
  return (
    <main className={styles.main}>
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
              <p className={styles.attendeesSeeAll}>See all</p>
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
              <div className={styles.attendeesLink}>
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
