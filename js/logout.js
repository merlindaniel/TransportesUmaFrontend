let btnLogOut = document.getElementById('logoutBtn');
if(btnLogOut!==null){
    btnLogOut.onclick = () => {
        console.log('Cerrando sesion')
        Vue.$cookies.remove('TokenJWT');
        window.location.href = './index.html';
      }
}
    