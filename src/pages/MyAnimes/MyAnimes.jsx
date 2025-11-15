import CardMyAnimes from '../../components/CardMyAnimes/CardMyAnimes';
import styles from './MyAnimes.module.css';

export default function MyAnimes() {
  return (
      <main className={styles.mainPageContainer}>
        <section className={styles.sectionContainer}>
          <div className={styles.containerFlex}>
            <h1>MyAnimes</h1>
            <h2>Lista de todas Animações que eu já assisti</h2>
            <p>Minha idéia principal com este projeto é usa-lo para praticar todo meu conhecimento adquirido nos cursos, formações e agora a Carreira React. Para reformular meu projeto pessoal, minha coleção de animes.</p>
          </div>
        </section>
        <section className={styles.sectionContainer}>
          <CardMyAnimes />
        </section>
      </main>
  );
};
