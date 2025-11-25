import styles from './ButtonPadrao.module.css';

export default function ButtonPadrao({children, type, styleExterno}) {
  return (
    <button type={type} className={`${styles.btnPadrao} ${styleExterno}`}>
        {children}
    </button>
  );
};
