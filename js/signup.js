let app = new Vue({
    el: '#appVue',
    data: {
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    },
    methods: {
        async signUp(e){
            e.preventDefault();
            if(this.password === this.confirmPassword){
                let response = await fetch(backendPaths.preffix + backendPaths.pathApiUsers, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.name,
                        email: this.email,
                        username: this.username,
                        password: this.password
                    })
                });
                if(response.status === 200){
                    window.location.href = frontendPaths.pathLogin;
                } else {
                    console.log("Error en la respuesta");
                }
            } else {
                console.log("Contraseña no iguales");
            }
        }
    }
});