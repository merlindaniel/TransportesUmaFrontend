const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,
        cabecera: 'Lista de tus Viajes',
        //user: {},
        userId: '61c28804cca492069b7eb609',
        isDriver: true,
        listaViajesParticipados: [], 
        listaViajesOrganizados: []

    },
    methods: {
        async obtenerViajes(){

            if(this.isDriver){

                /*
                let response = await fetch('http://localhost:8080/api/journeys/user/organizing', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':this.tokenConBearer
                    }});*/
                let response= await fetch('http://localhost:8080/api/journeys/organizing/'+this.userId, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':this.tokenConBearer
                    }});

                if(response.ok){
                    this.listaViajesOrganizados = await response.json();
                } else {

                }

            }

            /*
            let response = await fetch('http://localhost:8080/api/journeys/user/participating', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});*/
            
            let response = await fetch('http://localhost:8080/api/journeys/participating/'+this.userId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});

            if(response.ok){
                this.listaViajesParticipados = await response.json();
            } else {

            }

        },
        /*async obtenerUsuario(){
            let response = await fetch('http://localhost:8080/api/users/'+this.userId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});

            if(response.ok){
                this.user = await response.json();
                console.log(this.user);
            } else {

            }
        },*/
        obtenerTokenBearer(){
            this.tokenConBearer = $cookies.get('TokenJWT');
            if(this.tokenConBearer===null){
                window.location.href = frontendPaths.pathIndex;
            } 
        }

    },
    created: function (){
        this.obtenerTokenBearer();
        this.obtenerViajes();
        //this.obtenerUsuario();
    },

})