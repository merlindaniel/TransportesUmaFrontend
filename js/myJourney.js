let app = new Vue({
    el: '#journeysDetail',
    data: {
        tokenConBearer: null,
        loggedUser: {},

        journeyId: "",
        journey: {},

        date: "",
        hour: "",

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
            
        },

        async getDate() {
            var dateJourney = new Date(Date.parse(this.journey.startDate));
            this.date = dateJourney.getUTCDate() + "/" + (dateJourney.getUTCMonth()+1) + "/" + dateJourney.getUTCFullYear();
            var hours = dateJourney.getUTCHours();
            if (hours < 10){
                hours = "0" + dateJourney.getUTCHours();
            }
            var minutes = dateJourney.getUTCMinutes();
            if(minutes < 10){
                minutes = "0" + dateJourney.getUTCMinutes();
            }
            this.hour = hours + ":" + minutes;
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