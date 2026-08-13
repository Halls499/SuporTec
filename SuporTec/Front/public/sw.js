// Ouve quando uma notificação push chega do servidor
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || "SuporTec";
  const options = {
    body: data.body || "Você tem uma nova atualização no chamado.",
    icon: "/favicon.ico" // Ícone que aparecerá na notificação
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Ação ao clicar na notificação (abre o app)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});