const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,
        cabecera: 'Lista de tus Viajes',
        loggedUser: {},
        isDriver: true,
        listaViajesParticipados: [],
        listaViajesOrganizados: []

    },
    methods: {
        async getLoggedUser() {
            let response = await fetch('http://localhost:8080/api/users/current', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
            this.loggedUser = await response.json();

        },
        async obtenerViajes() {

            if (this.isDriver) {
                
                let response = await fetch('http://localhost:8080/api/journeys/user/organizing', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.tokenConBearer
                    }
                });

                if (response.ok) {
                    this.listaViajesOrganizados = await response.json();
                } else {
                }

            }


            let response = await fetch('http://localhost:8080/api/journeys/user/participating', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.tokenConBearer
                }
            });

            if (response.ok) {
                this.listaViajesParticipados = await response.json();
            } else {

            }

        },
        obtenerTokenBearer() {
            this.tokenConBearer = Vue.$cookies.get('TokenJWT');
            if (this.tokenConBearer === null) {
                window.location.href = frontendPaths.pathIndex;
            }

        }
    },
    created: function () {
        this.obtenerTokenBearer();
        this.getLoggedUser();
        this.obtenerViajes();
    },

})