import styles from './H2SubTitulo.module.css';

export default function H2SubTitulo({children}) {
  return (
    <h2 className={styles.h2SubTitulo}>{children}</h2>
  )
}
