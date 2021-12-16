const app = new Vue({

    el: '#app',
    data: {

        cabecera: 'Publicar un Viaje',
        // userLogged : 
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
        }

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
        configurarViaje(){

            this.journey.name = 'Viaje de ' + this.journey.origin + ' a ' + this.journey.destination;
            this.journey.description = 'El viaje se realizará el día ' + this.journey.startDate + ' a las ' + this.journey.hour + ' horas.\n Se han ofertado ' + this.journey.numberParticipants + ' a un precio de ' + this.journey.price + ' por plaza.';
            this.journey.organizer = '02654654612314654';
        }

    }

})