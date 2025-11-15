// src/components/CampoBusca/CampoBusca.jsx
import styles from './CampoBusca.module.css';

export default function CampoBusca({ searchTerm, onSearchChange, placeholder = "Buscar..." }) {
    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}
