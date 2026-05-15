const Footer = () => {
    const now = new Date();
    const formattedTime = now.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

  return (
    <footer className="absolute bottom-0 py-2">
      <div className="text-center text-xs text-gray-500">
        Версия: {formattedTime}
      </div>
    </footer>
  );
};

export default Footer;