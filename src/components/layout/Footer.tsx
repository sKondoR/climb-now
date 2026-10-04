import Image from 'next/image'

import packageJson from '../../../package.json'

const Footer = () => {
  const now = new Date();
  const formattedTime = now.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    // В потоке, а не absolute: на узком экране строка переносится и наезжала на последнюю карточку
    <footer className="mt-auto pt-8 pb-2 flex flex-wrap gap-x-5 gap-y-1 items-center">
      <div className="text-xs text-gray-500">
        Версия: {packageJson.version} ({formattedTime})
      </div>
      <div className="text-xs text-gray-500">
        <span>Контакты: </span>
        <a href="https://t.me/sergeykondrashin" target="_blank" rel="noopener noreferrer" className="inline-block">
          <Image
            src="/tg.svg"
            width={16}
            height={16}
            className="inline-block"
            alt="Telegram"
          />
          <span className="ml-1">@sergeykondrashin</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;