import styles from './PageQtdExibir.module.css';

export default function PageQtdExibir({ value, onChange, options = [6, 12, 24, 48, 96] }) {
    return (
        <div className={styles.divContainerControles}>
            <label className={styles.labelQtdPorPg}>
                <span className={styles.spanQtdPorPg}>Exibir</span>
                <select className={styles.selectQtdPorPg}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{ padding: '4px 8px' }}
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
