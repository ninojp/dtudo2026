'use strict';
import jsonDados from '../json/db.json' with { type: 'json' };
import criaElementoHtml from '../Helpers/criaElementoHtml.js';
import dataAtual from '../Helpers/dataAtual.js';

// Atualiza a data no rodapé
document.getElementById('dataRodape').innerText = dataAtual();

// Função para criar os cards das áreas de TI
function criaCardAreaTI() {
    jsonDados.areasTI.forEach(areaTI => {
        const divCardAreaTI = criaElementoHtml('div', { class: 'divCardAreaTI', style: `border-color: ${areaTI.corPadrao};` },
            criaElementoHtml('h3', { style: `color: ${areaTI.corPadrao};` }, areaTI.areaNome),
            criaElementoHtml('div', { class: 'divImgSGVAreaTI' },
                criaElementoHtml('img', { class: 'imgSGVAreaTI', src: areaTI.srcImg, alt: areaTI.areaNome })
            )
        );
        document.querySelector('.divContainerAreasTI').appendChild(divCardAreaTI);

        // Adiciona o EventListener ao card
        divCardAreaTI.addEventListener('click', () => {
            document.querySelector('.divContainerAreasTI').innerHTML = '';
            criarContainerAreaTI(areaTI);
        });
    });
}

// Função para adicionar EventListeners ao menu
function adicionaEventListenersMenu() {
    document.querySelectorAll('.ulMenuAreasTI li').forEach(menuAreaTI => {
        menuAreaTI.addEventListener('click', () => {
            const menuId = parseInt(menuAreaTI.id); // Obtém o ID do menu clicado como número
            const areaTI = jsonDados.areasTI.find(area => area.id === menuId); // Busca o objeto correspondente no JSON

            if (areaTI) {
                document.querySelector('.divContainerAreasTI').innerHTML = '';
                criarContainerAreaTI(areaTI);
            } else {
                console.error(`Nenhuma área encontrada para o ID do menu: ${menuId}`);
            }
        });
    });
}

// Função para criar o container com os detalhes da área de TI
function criarContainerAreaTI(areaTI) {
    const divContainerAreaTI = criaElementoHtml('div', { class: 'divContainerAreaTI' },
        criaElementoHtml('h2', { style: `color: ${areaTI.corPadrao};` }, areaTI.areaNome),
        criaElementoHtml('div', { class: 'divImgSGVAreaTI' },
            criaElementoHtml('img', { class: 'imgSGVAreaTI', src: areaTI.srcImg, alt: areaTI.areaNome })
        ),
        criaElementoHtml('p', {}, areaTI.descricao)
    );
    document.querySelector('.divContainerAreasTI').appendChild(divContainerAreaTI);
}

// Inicializa a página
criaCardAreaTI();
adicionaEventListenersMenu();
// document.getElementById('dataRodape').innerText = dataAtual();
// function criaCardAreaTI() {
//     jsonDados.areasTI.forEach(areaTI => {
//         const divCardAreaTI = criaElementoHtml('div', { class: 'divCardAreaTI', style: `border-color: ${areaTI.corPadrao};` },
//             criaElementoHtml('h3', { style: `color: ${areaTI.corPadrao};` }, areaTI.areaNome),
//             criaElementoHtml('div', { class: 'divImgSGVAreaTI' },
//                 criaElementoHtml('img', { class: 'imgSGVAreaTI', src: areaTI.srcImg, alt: areaTI.areaNome })
//             )
//         );
//         document.querySelector('.divContainerAreasTI').appendChild(divCardAreaTI);
//         // Adiciona o EventListener ao card
//         divCardAreaTI.addEventListener('click', () => {
//             document.querySelector('.divContainerAreasTI').innerHTML = '';
//             criarContainerAreaTI(areaTI);
//         });
//     });
//     // Adiciona EventListeners ao menu
//     document.querySelectorAll('.ulMenuAreasTI li').forEach(menuAreaTI => {
//         menuAreaTI.addEventListener('click', () => {
//             const menuId = menuAreaTI.id; // Obtém o ID do menu clicado
//             const areaTI = jsonDados.areasTI.find(area => `menu${area.areaNome.replace(/\s+/g, '')}Id` === menuId);
//             if (areaTI) {
//                 document.querySelector('.divContainerAreasTI').innerHTML = '';
//                 criarContainerAreaTI(areaTI);
//             } else {
//                 console.error(`Nenhuma área encontrada para o ID do menu: ${menuId}`);
//             }
//         });
//     });
// }
// criaCardAreaTI();
//==========================================================================================================================
//Ao clicar no card ou no menu da área de TI, ele chama a função menuExibirAreaTI e passa o objeto da área de TI como parâmetro.
//para o objeto ser exibido dentro do container da área de TI.
// document.querySelectorAll('.divCardAreaTI').forEach((cardAreaTI, index) => {
//     cardAreaTI.addEventListener('click', () => {
//         document.querySelector('.divContainerAreasTI').innerHTML = '';
//         criarContainerAreaTI(jsonDados.areasTI[index]);
//     });
// });
// //ao clicar no menu da área de TI, ele chama a função menuExibirAreaTI e passa o objeto da área de TI como parâmetro.
// document.querySelectorAll('.ulMenuAreasTI li').forEach((menuAreaTI, index) => { 
//     menuAreaTI.addEventListener('click', () => {
//         document.querySelector('.divContainerAreasTI').innerHTML = '';
//         criarContainerAreaTI(jsonDados.areasTI[index]);
//     });
// });

// function criarContainerAreaTI(areaTI) {
//     const divContainerAreaTI = criaElementoHtml('div', { class: 'divContainerAreaTI' },
//         criaElementoHtml('h2', { style: `color: ${areaTI.corPadrao};` }, areaTI.areaNome),
//         criaElementoHtml('div', { class: 'divImgSGVAreaTI' },
//             criaElementoHtml('img', { class: 'imgSGVAreaTI', src: areaTI.srcImg, alt: areaTI.areaNome })
//         ),
//         criaElementoHtml('p', {}, areaTI.descricao)
//     );
//     document.querySelector('.divContainerAreasTI').appendChild(divContainerAreaTI);
// }

