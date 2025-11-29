import LogoFronEnd from '../../components/Icons/LogoFronEnd';
import styles from './NinoTIFrontEnd.module.css';
import Badge from '../../components/BadgesTI/BadgesTI';
import { FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaGitAlt } from 'react-icons/fa';
import { SiVite } from 'react-icons/si';
import HeaderPage from '../../components/HeaderPage/HeaderPage';

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
        <section className={styles.sectionContainerNinoTIPage}>
            <HeaderPage>
                <h1>Front End</h1>
                <h2>A programação front-end é a prática de criar a interface do usuário (UI) e a experiência do usuário (UX) de um site ou aplicativo.</h2>
                <h3>Minha ideia aqui é juntar e expor todos os Cursos, Formações, Certificados, Diplomas e afins desta área para formar meu portfólio.</h3>
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
            </HeaderPage>
            <main className={styles.mainContainerPage}>
                <div className={styles.divContainerAreasTI}>
                    <LogoFronEnd largura={'200px'} altura={'200px'} />
                    <p>A programação front-end é a prática de criar a interface do usuário (UI) e a experiência do usuário (UX) de um site ou aplicativo. Ela se concentra em tudo o que o usuário vê e interage diretamente no navegador ou dispositivo móvel. 
A definição curta é: A programação front-end é a arte e a ciência de transformar dados em uma interface gráfica para o usuário, por meio de HTML, CSS e JavaScript, garantindo funcionalidade e design responsivo.</p>
                </div>
            </main>

        </section>
    );
};
