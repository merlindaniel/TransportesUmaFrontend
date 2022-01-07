let myJourneyApp = new Vue({
    el: '#journeysDetail',
    data: {
        tokenConBearer: null,
        loggedUser: {},

        journeyId: "",
        journey: {},
        participants: [],

        date: "",
        hour: "",

        origen: '',
        destino: '',
        listaVehiculos: [],
        listaOrigenes: [],
        listaDestinos: [],
        vehicleUser: null,
        fecha: '',

        errors: []
    },
    methods: {
        async getLoggedUser() {
            let response = await fetch('http://localhost:8080/api/users/current', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
            this.loggedUser = await response.json();
            console.log("Logged user: " + this.loggedUser);

        },

        async updateJourney() {
            const response = await axios.put('http://localhost:8080/api/journeys/' + this.journeyId, this.journey, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
            }});
            window.location.href = './my-journey.html?journey='+this.journeyId;
        },

        async configurarViaje(){

            // Configuración del Origen
            this.journey.origin.title = this.listaOrigenes[0].title;
            this.journey.origin.lat = this.listaOrigenes[0].lat;
            this.journey.origin.lng = this.listaOrigenes[0].lng;
            this.journey.origin.address = this.listaOrigenes[0].address;

            // Configuración del Destino
            this.journey.destination.title = this.listaDestinos[0].title;
            this.journey.destination.lat = this.listaDestinos[0].lat;
            this.journey.destination.lng = this.listaDestinos[0].lng;
            this.journey.destination.address = this.listaDestinos[0].address;


            // Configuración de la fecha, nombre, descripción y organizador del viaje
            this.journey.startDate = new Date(this.fecha+'T'+this.hour);
            this.journey.name = 'Viaje de ' + this.journey.origin.title + ' a ' + this.journey.destination.title;
            this.journey.description = 'El viaje se realizará el día ' + this.date+ ' a las ' + this.hour + ' horas.\nSe han ofertado ' + this.journey.numberParticipants + ' sitios a un precio de ' + this.journey.price + '€ por plaza.';
            
            // Escoger el vehículo elegido en la lista de vehículos
            await this.obtenerVehiculoElegido();

        },

        async getJourneyId() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const journey = urlParams.get('journey');

            if (journey) {
                this.journeyId = journey;
                console.log("journey: " + journey + " journey id" + this.journeyId);
                this.getJourney();
            } else {
                console.log("Error, no journey specified");
            }
        },

        async getJourney() {
            const response = await axios.get('http://localhost:8080/api/journeys/' + this.journeyId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
            }});
            this.journey = response.data;
            console.log(this.journey);
            this.getDate();
            this.origen = this.journey.origin.address;
            this.destino = this.journey.destination.address;
            this.getParticipants();
            this.obtenerVehiculos();
            
        },

        async deleteJourney() {
            const response = await axios.delete('http://localhost:8080/api/journeys/' + this.journeyId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
            }});
            window.location.href = './your-travels.html';
        },

        async getDate() {
            var dateJourney = new Date(Date.parse(this.journey.startDate));
            var day = dateJourney.getUTCDate();
            if (day < 10){
                day = "0" + day;
            }
            var month = dateJourney.getUTCMonth() + 1;
            if(month < 10){
                month = "0" + month;
            }
            this.date = day + "/" + month + "/" + dateJourney.getUTCFullYear();
            var hours = dateJourney.getUTCHours();
            if (hours < 10){
                hours = "0" + dateJourney.getUTCHours();
            }
            var minutes = dateJourney.getUTCMinutes();
            if(minutes < 10){
                minutes = "0" + dateJourney.getUTCMinutes();
            }
            this.hour = hours + ":" + minutes;
            this.fecha = dateJourney.getUTCFullYear() + "-" + month +"-"+day;
        },

        async getParticipants() {
            if(this.journey.participants.length > 0){
                const response = await axios.get('http://localhost:8080/api/journeys/participants/' + this.journeyId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
                this.participants = response.data;
                if(participants != null && participants != undefined){
                    console.log(participants);
                }
            }
        },
        async obtenerListaOrigenes(){

            let response = await fetch('http://localhost:8080/api/opendata/get/places/40.416729/-3.703339/'+this.origen, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});

            if(response.ok){
                // Devuelve la lista con posibles origenes
                this.listaOrigenes = await response.json();
            } else {
                // Muestra un error

            }

        },
        async obtenerListaDestinos(){

            // if(this.destino != ''){

                let response = await fetch('http://localhost:8080/api/opendata/get/places/40.416729/-3.703339/'+this.destino, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':this.tokenConBearer
                    }});

                if(response.ok){
                    // Devuelve la lista con posibles destinos
                    this.listaDestinos = await response.json();
                } else {
                    // Muestra un error

                }

            // }

        },

        async obtenerVehiculos(){

            let response = await fetch('http://localhost:8080/api/vehicles/user/myVehicles', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
            this.listaVehiculos = await response.json();
            

        },

        async obtenerVehiculoElegido(){

            let response = await fetch('http://localhost:8080/api/vehicles/'+this.vehicleUser, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});

            if(response.ok){
                // Devuelve el vehiculo elegido para el viaje
                this.journey.vehicle = await response.json();

            } else {
                // Muestra un error

            }

        },


        getTokenBearer() {
            this.tokenConBearer = Vue.$cookies.get('TokenJWT');
            console.log(this.tokenConBearer);
            if (this.tokenConBearer===null) {
                window.location.href = './index.html';
            } else {
                console.log('User is logged');
                this.getLoggedUser();
                this.getJourneyId();
            }
        },
    },
    mounted: function () {
        this.getTokenBearer();    

    },
});