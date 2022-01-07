const app = new Vue({

    el: '#app',
    data: {
        tokenConBearer: null
    },
    methods: {
        obtenerTokenBearer() {
            this.tokenConBearer = Vue.$cookies.get('TokenJWT');
        }
    },
    created: function () {
        this.obtenerTokenBearer();
    },

})