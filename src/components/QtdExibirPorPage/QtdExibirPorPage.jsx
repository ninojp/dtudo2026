import ParagrafoPage from '../ParagrafoPage/ParagrafoPage';
import styles from './QtdExibirPorPage.module.css';

export default function QtdExibirPorPage({ value, onChange, options = [ 12, 24, 48, 96] }) {
    return (
        <div className={styles.divContainerParagQtd}>
            <label className={styles.labelQtdPorPg}>
                <span className={styles.spanQtdPorPg}>Exibir</span>
                <select className={styles.selectQtdPorPg}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                >
                    {options.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <span className={styles.spanQtdPorPg}>por página.</span>
            </label>
        </div >
    );
}
