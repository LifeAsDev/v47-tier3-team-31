import styles from './styles.module.css';
import Event from '@/models/event';
import Image from 'next/image';
export default function Event({ eventData }: { eventData: Event | undefined }) {
  return (
    <main className={styles.main}>
      <h2>Code Event</h2>
      <Image width={500} height={500} alt='' src={'/images/event/mock-images/mock-image-02.svg'} />
      <p className={styles.description}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </p>
    </main>
  );
}
