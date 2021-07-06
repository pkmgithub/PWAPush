// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }


  self.addEventListener('activate', async () => {
    // This will be called only once when the service worker is activated.  Put Public key
    try {
      const applicationServerKey = urlB64ToUint8Array(
        'BIU1JFT29y0ELYvziCMbiTV_-Mn4NXimYZxcsFZpY4VZRD6HpvRSt9VnkuPmV8K3kBIkCo1Rvr132q0gpQFTBfA'
      )
      const options = { applicationServerKey, userVisibleOnly: true }
      const subscription = await self.registration.pushManager.subscribe(options)
      console.log(JSON.stringify(subscription))
    } catch (err) {
      console.log('Error', err)
    }
  })



self.addEventListener('push', function(event) {
    console.info('Event: Push');
    var title = 'Breaking News';
    var body = {
        'body': 'Click to see the latest breaking news', 'tag': 'pwa',
        'icon': './images/48x48.png'
    };
    event.waitUntil(self.registration.showNotification(title, body)
    );
});

self.addEventListener('notificationclick', function(event) {
    //---access data from event using event.notification.data---
    console.log('On notification click: ', event.notification.data);
    var url = './breaking.html';

    //---close the notification---
    event.notification.close();

    //---open the app and navigate to breaking.html
    // after clicking the notification---
    event.waitUntil(
        clients.openWindow(url)
    );
});
