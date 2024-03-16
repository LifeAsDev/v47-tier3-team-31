import styles from './about.module.css';
import Images from 'next/image';

const AboutUs = () => {
  return (
    <main className={styles.main}>
      <section className={styles.aboutsection}>
        <div className={styles.showLeftImages}>
          <h1 className={styles.whiteTitle}>ABOUT US</h1>
          <div className={styles.imagesSubContainer}>
            <div className={styles.images}>
              <Images
                src={'/images/aboutus/eventpeople1.svg'}
                alt={'event1'}
                width={210}
                height={130}
              />
            </div>
            <div className={styles.images}>
              <Images
                src={'/images/aboutus/eventpeople2.svg'}
                alt={'event2'}
                width={210}
                height={130}
              />
            </div>
            <div className={styles.images}>
              <Images
                src={'/images/aboutus/eventpeople3.svg'}
                alt={'event3'}
                width={210}
                height={130}
              />
            </div>
            <div className={styles.images}>
              <Images
                src={'/images/aboutus/eventpeople4.svg'}
                alt={'event4'}
                width={210}
                height={130}
              />
            </div>
          </div>
        </div>
        <div className={styles.showRightText}>
          <p>
            BakPak brings you unparalleled opportunities to engage with events globally. Whether you
            wish to host your own event or join exciting gatherings around the world, BakPak
            provides the platform for seamless participation. Discover local meetups in your city or
            explore events to uncover the finest activities in a new destination you're visiting.
          </p>
          <p>See our repository for more details.</p>
          <p>See our Team Page</p>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
