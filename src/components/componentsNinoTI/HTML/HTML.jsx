import HTMLogo from '/HTML_300h.webp';
import styles from './HTML.module.css';

export default function HTML() {
  return (
    <div>
        <h3>HTML</h3>
        <img src={HTMLogo} className={styles.logoHTM} alt="HTML5 logo" />
    </div>
  )
};
