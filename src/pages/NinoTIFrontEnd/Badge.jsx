import styles from './Badge.module.css';

export default function Badge({ icon, text, backgroundColor, textColor = '#ffffff' }) {
    return (
        <div className={styles.badgeContainer} style={{ backgroundColor: backgroundColor, color: textColor }}>
            <span className={styles.icon}>
                {icon}
            </span>
            <span className={styles.text}>
                {text}
            </span>
        </div>
    );
}
