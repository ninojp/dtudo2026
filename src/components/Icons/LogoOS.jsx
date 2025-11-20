import imgLogoOS from './logo-os.webp';

export default function LogoOS({largura, altura}) {
  return (
    <img src={imgLogoOS} alt='Logo BlockChain e Bitcoin' style={{width: largura, height: altura}} />
  )
}
