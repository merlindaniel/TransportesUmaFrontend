const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,
        cabecera: 'Lista de tus Viajes',
        
        // Logged user id
        loggedUserId: null,
        loggedUser: null,

        // Current user data:
        userId: null, 
        user: null,
        editionUser: {},
        vehicles: [],
        isLoggedUser: false,

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

            this.obtenerViajes();
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
            this.tokenConBearer = $cookies.get('TokenJWT');
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