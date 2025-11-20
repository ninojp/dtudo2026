import imgLogoHardware from './logo-hardware.webp';

export default function logoHardware({largura, altura}) {
  return (
    <img src={imgLogoHardware} alt='Logo Hardware' style={{width: largura, height: altura}} />
  )
};
