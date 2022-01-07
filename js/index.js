const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,
        loggedUser: {}

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
    },

})