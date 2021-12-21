const app = new Vue({

    el: '#app',
    data: {
        
        cabecera: 'Publicar un Viaje',
        // userLogged : 
        userId: '61c1fff129ba763e6fd49cbb',
        journey: {
            name: '',                   // Configurado
            description: '',            // Configurado
            origin: {
                title: '',
                lat: '',
                lng: '',
                address: ''
            },
            destination: {
                title: '',
                lat: '',
                lng: '',
                address: ''
            },
            numberParticipants: '',     // Configurado
            organizer: '',              // Configurado
            participants: [],           // Configurado
            vehicle: '',                // Configurado
            price: '',                  // Configurado
            startDate: '',
            hour: '',   
            exam: null,                 // Configurado
            finished: false             // Configurado
        },
        origen: '',
        destino: '',
        listaVehiculos: [],
        listaOrigenes: [],
        listaDestinos: [],
        vehicleUser: null,
        fecha: '',
        errorDePublicacion: ''

    },
    methods: {

        async publicarViaje(){

            await this.configurarViaje();

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
                this.errorDePublicacion = 'ERROR';

            }

        },
        async obteneListaOrigenes(){

            let response = await fetch('http://localhost:8080/api/opendata/get/places/40.416729/-3.703339/'+this.origen);

            if(response.ok){
                // Devuelve la lista con posibles origenes
                this.listaOrigenes = await response.json();
            } else {
                // Muestra un error

            }

        },
        async obteneListaDestinos(){

            // if(this.destino != ''){

                let response = await fetch('http://localhost:8080/api/opendata/get/places/40.416729/-3.703339/'+this.destino);

                if(response.ok){
                    // Devuelve la lista con posibles destinos
                    this.listaDestinos = await response.json();
                } else {
                    // Muestra un error

                }

            // }

            

        },
        async obtenerVehiculos(){
            
            let response = await fetch('http://localhost:8080/api/vehicles/user/'+this.userId);

            if(response.ok){
                // Devuelve la lista con posibles destinos
                this.listaVehiculos = await response.json();

            } else {
                // Muestra un error

            }

        },
        async obtenerVehiculoElegido(){

            let response = await fetch('http://localhost:8080/api/vehicles/'+this.vehicleUser);

            if(response.ok){
                // Devuelve el vehiculo elegido para el viaje
                this.journey.vehicle = await response.json();

            } else {
                // Muestra un error

            }

        },
        async configurarViaje(){


            this.journey.origin.title = this.listaOrigenes[0].title;
            this.journey.origin.lat = this.listaOrigenes[0].lat;
            this.journey.origin.lng = this.listaOrigenes[0].lng;
            this.journey.origin.address = this.listaOrigenes[0].address;

            this.journey.destination.title = this.listaDestinos[0].title;
            this.journey.destination.lat = this.listaDestinos[0].lat;
            this.journey.destination.lng = this.listaDestinos[0].lng;
            this.journey.destination.address = this.listaDestinos[0].address;

            this.journey.startDate = new Date(this.fecha+'T'+this.journey.hour);
            this.journey.name = 'Viaje de ' + this.journey.origin.title + ' a ' + this.journey.destination.title;
            this.journey.description = 'El viaje se realizará el día ' + this.journey.startDate + ' a las ' + this.journey.hour + ' horas.\nSe han ofertado ' + this.journey.numberParticipants + ' sitios a un precio de ' + this.journey.price + '€ por plaza.';
            this.journey.organizer = this.userId;
            
            await this.obtenerVehiculoElegido();
            this.errorDePublicacion = '';

            console.log('Name: '+this.journey.name); // Listo
            console.log('Descripcion: '+this.journey.description); // Listo
            console.log('Origen: '+this.journey.origin);
            console.log('Destino: '+this.journey.destination);
            console.log('Numero de Participantes: '+this.journey.numberParticipants); // Listo
            console.log('Organizador: '+this.journey.organizer); // Listo
            console.log('Vehiculo: '+this.journey.vehicle); // Listo
            console.log('Precio: '+this.journey.price); // Listo
            console.log('StartDate: '+this.journey.startDate);
            console.log('Hour: '+this.journey.hour); // Listo
            console.log('Exam: '+this.journey.exam); // Listo
            console.log('Finisehd: '+this.journey.finished); // Listo
        }
    },
    mounted: function (){
        this.obtenerVehiculos();
    }

})