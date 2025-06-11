export default function HomePage() {
  // КРИТИЧЕСКИ ВАЖНО: Проверьте это сообщение в Runtime логах Vercel при загрузке главной страницы
  console.log('--- HomePage (src/app/page.tsx) IS RENDERING ON SERVER ---'); 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>FamilyCourse - Главная страница (Диагностика)</h1>
      <p>Если вы видите эту страницу, базовый рендеринг работает.</p>
      <p style={{ marginTop: '20px', color: 'gray', fontSize: 'small' }}>
        Пожалуйста, проверьте логи выполнения (Runtime Logs) на Vercel на наличие сообщения "--- HomePage (src/app/page.tsx) IS RENDERING ON SERVER ---".
      </p>
    </div>
  );
}
