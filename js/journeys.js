// javascript para la página que lista los trayectos buscados (journeys.html)
const app = new Vue({

    el: '#app',
    data: {

        tokenConBearer: null,
        origin: '',
        destination: '',
        date: '',
        nSpots: '',
        journeysList: [],
        journeysListDef: []
    },

    methods: {

        async getJourneys() {
            
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const origin = urlParams.get('origin');
            const destination = urlParams.get('destination');
            const nSpots = urlParams.get('nSpots');
            const date = urlParams.get('date');

            if(origin && destination && nSpots){
                
                this.origin = origin;
                this.destination = destination;
                this.nSpots = nSpots;
                this.date = date;
                
                let response = await fetch('http://localhost:8080/api/journeys/search/'+ this.origin + "/" + this.destination + "/" + this.nSpots + "/" + this.date, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});

                if (response.ok) {    
                    this.journeysList = await response.json();
                    this.setList();
                }else{
                    //error
                }
            }else{
                //error
            }

        },

        async setList(){
            
            
            for(journey of this.journeysList){
                var numSpots = journey.vehicle.seats - journey.numberParticipants ;
                var h = this.hoursFunction(journey.startDate,toString());
                
                let response = await fetch('http://localhost:8080/api/users/'+ journey.organizer, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':this.tokenConBearer
                }});
                 
                if(response.ok){
                    var org = await response.json();
                    this.journeysListDef.push({
                        id : journey.id,
                        name : journey.name,
                        description : journey.description,
                        origin: {
                            title: journey.origin.title,
                            lat: journey.origin.lat,
                            lng: journey.origin.lng,
                            address: journey.origin.address
                        },
                        destination: {
                            title: journey.destination.title,
                            lat: journey.destination.lat,
                            lng: journey.destination.lng,
                            address: journey.destination.address
                        },
                        // Organizador
                        organizer: org,              
                        numberParticipants: journey.numberParticipants,
                        // Numero de asientos restantes      
                        numberSpots: numSpots,
                        participants: journey.participants,           
                        vehicle: journey.vehicle,                
                        price: journey.price,                  
                        startDate: journey.startDate,
                        // hora
                        hour: h,   
                        exam: journey.exam,                 
                        finished: journey.finished  
                    });
                }

            }
        },

        getTokenBearer() {

            this.tokenConBearer = Vue.$cookies.get('TokenJWT');
            if (this.tokenConBearer === null) {
                window.location.href = frontendPaths.pathIndex;
            }else{
                this.getJourneys();
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
