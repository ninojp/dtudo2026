import LogoFronEnd from '../../components/Icons/LogoFronEnd';
import styles from './NinoTIFrontEnd.module.css';
import Badge from '../../components/Badge/Badge';
import { FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaGitAlt } from 'react-icons/fa';
import { SiVite } from 'react-icons/si';

// Lista de tecnologias para os badges
const technologies = [
    { name: 'HTML5', icon: <FaHtml5 />, color: '#E34F26' },
    { name: 'CSS3', icon: <FaCss3Alt />, color: '#1572B6' },
    { name: 'JavaScript', icon: <FaJsSquare />, color: '#F7DF1E', textColor: '#000000' },
    { name: 'React', icon: <FaReact />, color: '#61DAFB', textColor: '#000000' },
    { name: 'Vite', icon: <SiVite />, color: '#646CFF' },
    { name: 'Git', icon: <FaGitAlt />, color: '#F05032' }
];

export default function NinoTIFrontEnd() {
    return (
        <main className={styles.mainContainerPage}>
            <h1>Front End</h1>
            <LogoFronEnd largura={'300px'} altura={'300px'}/>
            <h2>Estudando T.I. há 28 anos, trabalhando e vivendo dela há 15!</h2>
            <p>Minha ideia aqui é juntar e expor todos os Cursos, Formações, Certificados, Diplomas e afins desta área para formar meu portfólio.</p>
            
            <div className={styles.divContainerBadges}>
                {technologies.map((tech) => (
                    <Badge
                        key={tech.name}
                        icon={tech.icon}
                        text={tech.name}
                        backgroundColor={tech.color}
                        textColor={tech.textColor}
                    />
                ))}
            </div>

            {/* Você pode manter a div de áreas de TI ou integrá-la de outra forma */}
            {/* <div className={styles.divContainerAreasTI}>
                ICONES das areas...
            </div> */}
        </main>
    );
};
