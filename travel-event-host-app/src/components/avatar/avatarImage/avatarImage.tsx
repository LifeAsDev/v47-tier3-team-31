import styles from './styles.module.css';
import Attendees from '@/models/attendees';
function obtenerColorTexto(colorFondo: string) {
  var m = colorFondo.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!m) return null;

  var luminosity = 0.2126 * parseInt(m[1]) + 0.7152 * parseInt(m[2]) + 0.0722 * parseInt(m[3]);

  return luminosity < 128 ? 'white' : 'black';
}

export default function AvatarImage({ attende }: { attende: Attendees }) {
  return (
    <>
      {attende.imageUrl.startsWith('rgb') ? (
        <div className={styles.avatarBox} style={{ backgroundColor: attende.imageUrl }}>
          <p style={{ color: `${obtenerColorTexto(attende.imageUrl)}` }}>
            {' '}
            {`${attende.firstName[0].toUpperCase()}`}
          </p>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
