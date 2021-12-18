const app = new Vue({

    el: '#app',
    data: {
        
        cabecera: 'Lista de tus Viajes',
        userLogged: null,
        userId: '619666eddf50cc5ce72bb82b',
        isDriver: true,
        listaViajesParticipados: [], 
        listaViajesOrganizados: [],
        listaViajes: []

    },
    methods: {
        async obtenerViajes(){

            if(this.isDriver){
                let response= await fetch('http://localhost:8080/api/journeys/organizing/'+this.userId);
                // let response = await fetch('http://localhost:8080/api/journeys/');

                if(response.ok){
                    this.listaViajesOrganizados = await response.json();
                } else {

                }

            }
            
            let response = await fetch('http://localhost:8080/api/journeys/participating/'+this.userId);
            // let response = await fetch('http://localhost:8080/api/journeys/');

            if(response.ok){
                this.listaViajesParticipados = await response.json();
                console.log(this.listaViajesParticipados.length);
            } else {

            }

        },
        async obtenerUsuario(){
            let response = await fetch('http://localhost:8080/api/users/'+this.userId);

            if(response.ok){
                this.userLogged = await response.json();
            } else {

            }
        }

    },
    created: function (){
        this.obtenerViajes();
        this.obtenerUsuario();
    }

})