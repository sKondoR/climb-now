import Image from 'next/image'

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
    <footer className="absolute bottom-0 py-2 flex justify-between items-center">
      <div className="text-center text-xs text-gray-500">
        Версия: {formattedTime}
      </div>
      <div className="text-xs text-gray-500 ml-5">
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