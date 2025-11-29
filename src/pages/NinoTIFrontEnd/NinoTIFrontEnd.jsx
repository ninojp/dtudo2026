import styles from './NinoTIFrontEnd.module.css';
import { FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaGitAlt, FaGithub, FaNodeJs, FaFigma, FaWordpress, } from 'react-icons/fa';
import { BiLogoTypescript } from 'react-icons/bi';
import { SiVite } from 'react-icons/si';
import BadgesTI from '../../components/BadgesTI/BadgesTI';
import LogoFronEnd from '../../components/Icons/LogoFronEnd';
import HeaderPage from '../../components/HeaderPage/HeaderPage';
import H1TituloPage from '../../components/H1TituloPage/H1TituloPage';
import H2SubTitulo from '../../components/H2SubTitulo/H2SubTitulo';
import { RiNextjsFill } from 'react-icons/ri';

// Lista de tecnologias nome, icone, corFundo e corTexto para os badges.
const technologies = [
    { name: 'HTML5', icon: <FaHtml5 />, color: '#E34F26' },
    { name: 'CSS3', icon: <FaCss3Alt />, color: '#1572B6' },
    { name: 'JavaScript', icon: <FaJsSquare />, color: '#F7DF1E', textColor: '#000000' },
    { name: 'TypeScript', icon: <BiLogoTypescript />, color: '#3178C6', textColor: '#000000'},
    { name: 'Node.js', icon: <FaNodeJs />, color: '#339933', textColor: '#000000'},
    { name: 'React', icon: <FaReact />, color: '#61DAFB', textColor: '#000000' },
    { name: 'Vite', icon: <SiVite />, color: '#646CFF' },
    { name: 'Next.js', icon: <RiNextjsFill />, color: '#000000' },
    { name: 'Git/Bash', icon: <FaGitAlt />, color: '#F05032' },
    { name: 'GitHub', icon: <FaGithub />, color: '#232323' },
    { name: 'Figma', icon: <FaFigma />, color: 'var(--corDesignEUX)' },
    { name: 'WordPress', icon: <FaWordpress />, color: '#21759B' },
];

export default function NinoTIFrontEnd() {
    return (
        <section className={`${styles.sectionContainerNinoTIPage} styleFrontEnd`}>
            <HeaderPage>
                <H1TituloPage>Front End</H1TituloPage>
                <H2SubTitulo>Front-end é a prática de criar interfaces para usuários (UI)</H2SubTitulo>
                <p>A programação front-end é a arte e a ciência de transformar dados em uma interface gráfica para o usuário, por meio de HTML, CSS e JavaScript, garantindo funcionalidade, acessibilidade e design responsivo.</p>
                <div className={styles.divContainerBadges}>
                    {technologies.map((tech) => (
                        <BadgesTI
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
                    <p>Minha ideia aqui é juntar e expor todos os Cursos, Formações, Certificados, Diplomas e afins desta área para formar meu portfólio.</p>
                    <LogoFronEnd largura={'200px'} altura={'200px'} />
                    <p>A programação front-end é a prática de criar a interface do usuário (UI) e a experiência do usuário (UX) de um site ou aplicativo. Ela se concentra em tudo o que o usuário vê e interage diretamente no navegador ou dispositivo móvel.</p>
                </div>
            </main>
        </section>
    );
};
