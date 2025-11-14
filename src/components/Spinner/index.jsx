import styles from './spinner.module.css'

export const Spinner = () => {
    return (
        <div className={styles.spinnerContainer}>
            <p>Carregando...</p>
            <span className={styles.loader}></span>
        </div>
    )
}
