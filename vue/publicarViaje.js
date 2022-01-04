const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,        
        cabecera: 'Publicar un Viaje',
        //userLogged: null,
        //userId: '61c28804cca492069b7eb609',
        // Logged user id
        loggedUserId: null,
        loggedUser: null,

        // Current user data:
        // Example id = 61c1c831437c756c894c1fe4
        userId: null, // Eliminar id por defecto (ahora está para hacer pruebas)
        user: null,
        editionUser: {},
        vehicles: [],
        isLoggedUser: false,
        journey: {
            name: '',                   
            description: '',            
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
                        'Content-Type': 'application/json',
                        'Authorization':this.tokenConBearer
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
        async obteneListaDestinos(){

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
/*
            let response = await fetch('http://localhost:8080/api/vehicles/user/myVehicles', {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization':this.tokenConBearer
                                    }});*/

            let response = await fetch('http://localhost:8080/api/vehicles/user/'+this.user.id, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization':this.tokenConBearer
                                    }});
            if(200===response.status){
                //Todo ok
                this.listaVehiculos = await response.json();
            } else {
                console.log("User: " + this.user);
                console.log("User.id: " + this.user.id);
                console.log("UserId: " + this.userId);
                console.log("Logged User: " + this.loggedUser);
                console.log("Logged user id: " + this.loggedUserId);
            //Mal el token. Redirect a la pagina principal
            //window.location.href = frontendPaths.pathIndex;
            }

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
            this.journey.startDate = new Date(this.fecha+'T'+this.journey.hour);
            this.journey.name = 'Viaje de ' + this.journey.origin.title + ' a ' + this.journey.destination.title;
            this.journey.description = 'El viaje se realizará el día ' + this.journey.startDate + ' a las ' + this.journey.hour + ' horas.\nSe han ofertado ' + this.journey.numberParticipants + ' sitios a un precio de ' + this.journey.price + '€ por plaza.';
            this.journey.organizer = this.userId;
            
            // Escoger el vehículo elegido en la lista de vehículos
            await this.obtenerVehiculoElegido();
            this.errorDePublicacion = '';

            // Mostrar los datos en la consola
            console.log('Name: '+this.journey.name); 
            console.log('Descripcion: '+this.journey.description); 
            console.log('Origen: '+this.journey.origin); 
            console.log('Destino: '+this.journey.destination); 
            console.log('Numero de Participantes: '+this.journey.numberParticipants); 
            console.log('Organizador: '+this.journey.organizer); 
            console.log('Vehiculo: '+this.journey.vehicle); 
            console.log('Precio: '+this.journey.price); 
            console.log('StartDate: '+this.journey.startDate);
            console.log('Hour: '+this.journey.hour);
            console.log('Exam: '+this.journey.exam); 
            console.log('Finisehd: '+this.journey.finished); 
        },
        async getUserId() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const userId = urlParams.get('user');

            if (userId)
                this.userId = userId;
        },

        async getLoggedUser() {
            const response = await axios.get('http://localhost:8080/api/users/current', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
            this.loggedUser = response.data;
            this.loggedUserId = this.loggedUser.id;
            console.log(this.loggedUser);
            
            if (this.user == null || this.user === {}) {
                this.user = this.loggedUser;
                this.userId = this.loggedUser.id;
            }

            // Checks if this user is the current logged user
            this.isLoggedUser = this.user.id === this.loggedUserId;

            if (this.isLoggedUser) {
                Object.assign(this.editionUser, this.user); 
            }
            this.obtenerVehiculos();
        },

        async getUser() {
            const response = await axios.get('http://localhost:8080/api/users/' + this.userId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
            this.user = response.data;
            console.log(this.user);
            
            // Checks if this user is the current logged user
            this.isLoggedUser = this.user.id === this.loggedUserId;

            if (this.isLoggedUser)
                Object.assign(this.editionUser, this.user);
                
        },

        getTokenBearer() {
            this.tokenConBearer = Vue.$cookies.get('TokenJWT');
            console.log(this.tokenConBearer);
            if (this.tokenConBearer===null) {
                window.location.href = './index.html';
            } else {
                console.log('User is logged');
            }
        },
    },
    created: function (){
        this.getTokenBearer();
        this.getUserId();
        if (this.userId != null) this.getUser();
        this.getLoggedUser();
    },

})