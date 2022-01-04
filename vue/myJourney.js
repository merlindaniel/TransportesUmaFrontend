const app = new Vue({
    el: '#hero',
    data: {
        tokenConBearer: null,
        
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
        journeyId = null,
        journey = null,

        errors: [],
    },
    methods: {
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

            this.getJourney();
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

        async getJourney() {
            const response = await axios.get('http://localhost:8080/api/journeys/' + this.journeyId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
            }});
            this.journey = response.data;
            console.log(this.journey);
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
    mounted: function () {
        this.getTokenBearer();    
        this.getUserId();
        if (this.userId != null) this.getUser();
        this.getLoggedUser();
    },
});