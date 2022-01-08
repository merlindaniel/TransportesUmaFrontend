// javascript para la página de reserva (reservation.html)
const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,
        loggedUser: '',
        id: '',
        journey: '',
        organizer: '',
        nSpots: '',
        hour: '',
        date: '',
    },

    methods: {
        /*
        async getLoggedUser() {
            let response = await fetch('http://localhost:8080/api/users/current', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
            this.loggedUser = await response.json();
            console.log("Logged user: " + this.loggedUser);

        }, **/

        async getJourney(){
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const id = urlParams.get('journey');
            const nspots = urlParams.get('nSpots');

            if(id && nspots){
                
                this.id = id;
                this.nSpots = nspots;
                let response = await fetch('http://localhost:8080/api/journeys/'+ this.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});

                if(response.ok){
                    this.journey = await response.json();
                    this.setArgs();
                }else{
                    //error
                    this.journey = 'TERRIBLE';
                }

            }else{
                //error
            }
        },

        async setArgs(){
            this.date = this.journey.startDate.split("T")[0];
            this.hour = this.hoursFunction(this.journey.startDate);
        },

        async book(){
            /**
            let response = await fetch('http://localhost:8080/api/journeys/'+ this.journey.id + this.loggedUser.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':this.tokenConBearer
            }});

            
            if(response.ok){
                // ir a mis viajes (?)
            }else{
                //error
            }
             */
        },

        getTokenBearer() {

            this.tokenConBearer = Vue.$cookies.get('TokenJWT');
            if (this.tokenConBearer === null) {
                window.location.href = frontendPaths.pathIndex;
            }else{
                //this.getLoggedUser();
                this.getJourney();
            }

        },

        hoursFunction: function (string) {   
            return string.split("T")[1].split(":")[0] + ":" + string.split("T")[1].split(":")[1];
        }

    },

    created: function () {
        this.getTokenBearer();
    },

})