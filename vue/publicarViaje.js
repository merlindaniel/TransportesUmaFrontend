const app = new Vue({

    el: '#app',
    data: {

        cabecera: 'Publicar un Viaje',
        // userLogged : 
        userId: '619666eddf50cc5ce72bb82b',
        journey: {
            name: '',
            description: '',
            origin: '',
            destination: '',
            numberParticipants: '',
            organizer: '',
            participants: [],
            vehicle: '',
            price: '',
            startDate: '',
            hour: '',
            exam: null,
            finished: false
        },
        origen: '',
        destino: '',
        listaVehiculos: [],
        listaOrigenes: [],
        listaDestinos: []

    },
    methods: {

        async publicarViaje(){

            this.configurarViaje();

            let response = await fetch('http://localhost:8080/api/journeys/',
                {
                    method: 'POST',
                    body: JSON.stringify(this.journey),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if(response.ok){
                // Redirecciona a la página del viaje publicado

            } else {
                // Muestra un error

            }

        },
        async obtenerOrigen(){

            let response = await fetch('http://localhost:8080/api/opendata/get/places/40.416729/-3.703339/'+this.origen);

            if(response.ok){
                // Devuelve la lista con posibles origenes
                this.listaOrigenes = await response.json();
                console.log(this.listaOrigenes.length);
            } else {
                // Muestra un error

            }

        },
        async obtenerDestino(){

            let response = await fetch('http://localhost:8080/api/opendata/get/places/40.416729/-3.703339/'+this.destino);

            if(response.ok){
                // Devuelve la lista con posibles destinos
                this.listaDestinos = await response.json();
                console.log(this.listaDestinos.length);
            } else {
                // Muestra un error

            }

        },
        async obtenerVehiculos(){
            
            console.log('Hola');
            let response = await fetch('http://localhost:8080/api/vehicles/user/'+this.userId);

            if(response.ok){
                // Devuelve la lista con posibles destinos
                this.listaVehiculos = await response.json();
                console.log(this.listaVehiculos.length);
            } else {
                // Muestra un error

            }

        },
        configurarViaje(){

            this.journey.name = 'Viaje de ' + this.journey.origin + ' a ' + this.journey.destination;
            this.journey.description = 'El viaje se realizará el día ' + this.journey.startDate + ' a las ' + this.journey.hour + ' horas.\n Se han ofertado ' + this.journey.numberParticipants + ' a un precio de ' + this.journey.price + ' por plaza.';
            this.journey.organizer = '619666eddf50cc5ce72bb82b';
            // this.journey.origin = ;
            // this.journey.destination = ;
            // this.journey.vehicle = ;
        }
    },created: function (){
        this.obtenerVehiculos();
    }

})