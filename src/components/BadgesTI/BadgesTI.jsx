import styles from './BadgesTI.module.css';

export default function BadgesTI({ icon, text, backgroundColor, textColor = '#ffffff' }) {
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
