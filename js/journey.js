// javascript para la página de un trayecto (journey.html) desde buscar
const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,
        id: '',
        journey: '',
        organizer: '',
        nSpots: '',
        hour: '',
        date: '',
    },

    methods: {

        async getJourney(){
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const id = urlParams.get('journey');
            const nspots = urlParams.get('nSpots');
            if(id){
                
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
        /**
        async book(){

            let response = await fetch('http://localhost:8080/api/journeys/'+ this.journey.id + this.loggedUser.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':this.tokenConBearer
            }});

            
            if(response.ok){
               
            }else{
                //error
            }

        },

         */

        async setArgs(){
            
            let response = await fetch('http://localhost:8080/api/users/'+ this.journey.organizer, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':this.tokenConBearer
            }});

            if(response.ok){
                this.organizer = await response.json();
                this.date = this.journey.startDate.split("T")[0];
                this.hour = this.hoursFunction(this.journey.startDate);
            }else{
                //error
                this.journey = 'TERRIBLE';
            }

        },

        async goReservation(){
            /*
             
            let response = await fetch('http://localhost:8080/api/journeys/'+ this.journey.id + this.loggedUser.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':this.tokenConBearer
            }});

            
            if(response.ok){
                window.location.href = frontendPaths.pathReservation;
            }else{
                //error
            }*/
            window.location.href = frontendPaths.pathReservation + "?journey=" + this.journey.id + "&nSpots=" + this.nSpots;
        },

        getTokenBearer() {

            this.tokenConBearer = Vue.$cookies.get('TokenJWT');
            if (this.tokenConBearer === null) {
                window.location.href = frontendPaths.pathIndex;
            }else{
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
});