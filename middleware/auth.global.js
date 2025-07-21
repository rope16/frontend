export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  // Ako korisnik nije ulogovan i pokušava pristupiti bilo kojoj stranici osim /login
  if (!auth.isAuthenticated && to.path !== '/login') {
    console.log('Korisnik nije ulogovan, preusmjeravam na /login');
    return navigateTo('/login')
  }

  // Ako je korisnik već ulogovan i ide na /login, pošalji ga na početnu
  if (auth.isAuthenticated && to.path === '/login') {
    console.log('Korisnik je već ulogovan, preusmjeravam na /');
    return navigateTo('/')
  }
})