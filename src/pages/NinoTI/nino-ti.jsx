import styles from './NinoTI.module.css';

export default function NinoTI() {
    return (
        <div className={styles.divContainerPgNinoTI}>
            <aside>
                <nav class="navMenuAreasTI">
                    <h3>Projetos Que Desenvolvi</h3>
                    <p>Link para os Projetos</p>
                    <p>Minhas areas Conhecimento</p>
                    <ul class="ulMenuAreasTI">
                        <li data-menuProgramacao="" id="1">Programação</li>
                        <li data-menuFrontEnd="" id="2">Front-End</li>
                        <li data-menuCyberSecurity="" id="3">Cyber Security</li>
                        <li data-menuDesignEUX="" id="4">Design e UX</li>
                        <li data-menuOS="" id="5">O.S</li>
                        <li data-menuBlockchainECriptoAtivos="" id="6">Blockchain</li>
                        <li data-menuHardware="" id="7">Hardware</li>
                        <li data-menuRedes="" id="8">Redes</li>
                        <li data-menuDataScience="" id="9">Data Science</li>
                        <li data-menuInteligenciaArtificial="" id="10">I.A</li>
                    </ul>
                </nav>
            </aside>
            <main>
                <section>
                    <h2>Estudando T.I a 28 anos, trabalhando e vivendo dela há 15!</h2>
                    <p>Minha idéia aqui é juntar e expor todos os Cursos, Formações, Certificados, Diplomas e afíns do
                        meu portfólio.</p>
                    <div class="divContainerAreasTI">
                        ICONES das areas...
                    </div>
                </section>
            </main>
        </div>
    );
};
