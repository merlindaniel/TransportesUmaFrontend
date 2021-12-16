const app = new Vue({

    el: '#app',
    data: {
        
        cabecera: 'Lista de tus Viajes',
        userLogged: null,
        listaViajesParticipados: [], 
        listaViajesOrganizados: [],
        listaViajes: []

    },
    methods: {

        // Viajes participados: /participating/userLogged.id
        // Viajes organizados: /organizing/userLogged.id
        async obtenerViajesParticipados(){
            let response = await fetch('http://localhost:8080/api/journeys/participating/'+this.userLogged.id);

            if(response.ok){
                this.listaViajesParticipados = response.json();
            } else {

            }

        }, 
        async obtenerViajesOrganizados(){
            let response = await fetch('http://localhost:8080/api/journeys/organizing/'+this.userLogged.id);

            if(response.ok){
                this.listaViajesOrganizados = response.json();
            } else {

            }

        },
        async obtenerViajes(){
            let response = await fetch('http://localhost:8080/api/journeys/');

            if(response.ok){
                this.listaViajes = await response.json();
            } else {
                
            }
        }

    },
    created: function (){
        this.obtenerViajes();
    }

})