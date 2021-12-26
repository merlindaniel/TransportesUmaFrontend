let backendPaths = {
    preffix: "http://localhost:8080",
    pathAuthenticationLogin: "/authentication/user/login"
}



let app = new Vue({
    el: '#appVue',
    data: {
        username: "",
        password: "",
        data: null
    },
    methods: {
        async logIn(){
            let response = await fetch(backendPaths.preffix + backendPaths.pathAuthenticationLogin, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                });

            if(response.status == 200){
                this.data = await response.json();
                Vue.$cookies.set('Token', this.data.jwttoken);
            } else {
                //Datos incorrectos
            }
        }
    }
});