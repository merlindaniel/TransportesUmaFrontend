const app = new Vue({
    el: '#hero',
    data: {
        // Logged user id
        loggedUserId: '61c28804cca492069b7eb609',

        // Current user data:
        // Example id = 61c1c831437c756c894c1fe4
        userId: '61c28804cca492069b7eb609', // Eliminar id por defecto (ahora está para hacer pruebas)
        user: {},
        editionUser: {},
        vehicles: [],
        isLoggedUser: false,

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

        async getUser() {
            const response = await axios.get('http://localhost:8080/api/users/' + this.userId);
            this.user = response.data;
            console.log(this.user);
            
            // Checks if this user is the current logged user
            this.isLoggedUser = this.user.id === this.loggedUserId;

            if (this.isLoggedUser)
                Object.assign(this.editionUser, this.user);
        },

        async getVehicles() {
            const response = await axios.get('http://localhost:8080/api/vehicles/user/' + this.userId);
            this.vehicles = response.data;
            console.log(this.vehicles);
        },

        async userEditionSubmit() {
            let canEdit = await this.editionValidation();

            if (canEdit) {
                let imgUrl = this.user.picture;
                const img = document.getElementById("profile-pic");
    
                // If image was uploaded, then uploads image to imgur
                if (img.files.length > 0) {
                    const formdata = new FormData();
                    formdata.append("image", img.files[0]);
                    await fetch("https://api.imgur.com/3/image/", {
                        method: "post",
                        headers: {
                            Authorization: "Client-ID 4f59459848bf8ef"
                        },
                        body: formdata
                    }).then(data => data.json()).then(data => {
                        imgUrl = data.data.link;

                        console.log(imgUrl);
                    });
                }

                this.editionUser.picture = imgUrl;

                console.log("Edited user: ");
                console.log(this.editionUser);

                const response = await axios.put('http://localhost:8080/api/users/' + this.user.id, this.editionUser);

                console.log("Response:");
                console.log(response);
                
                // Loads profile page after applying changes
                window.location.href = './profile.html';
            }
        },

        async editionValidation() {
            // Reiniciar mensajes de error
            this.errors = [];

            this.validateUsername();
            this.validateEmail();
            this.validateName();
            this.validatePassword();

            console.log(this.errors);
            return this.errors.length === 0;
        },

        async validateUsername() {
            // Comprobar que el nombre de usuario no está en uso o es igual al actual
            const editionUsername = document.getElementById('edition-username').value;
            if (editionUsername.length < 3 || editionUsername.length > 20) {
                this.errors.push(`El nombre de usuario "${editionUsername}" no es válido`);
            }
            else if (editionUsername !== this.user.username) {
                let response;
                response = await axios.get('http://localhost:8080/api/users/' + editionUsername).catch(error => {
                    return {};
                });

                if (response && response.data) {
                    this.errors.push(`El nombre de usuario "${editionUsername}" no está disponible`);
                    console.log(this.errors);
                }
            }
        },

        async validateEmail() {
            // Comprobar que el email del usuario no está en uso o es igual al actual
            const editionEmail = document.getElementById('edition-email').value;
            if (!editionEmail.includes('@') || !editionEmail.includes('.')) {
                this.errors.push(`El email "${editionEmail}" no es un email válido`);
            }
            else if (editionEmail !== this.user.email) {
                let response = await axios.get('http://localhost:8080/api/users/' + editionEmail);
                if (response && response.data) {
                    this.errors.push(`El email "${editionEmail}" no está disponible`);
                    console.log(this.errors);
                }
            }
        },

        async validateName() {
            // Comprobar que el nombre del usuario es válido
            const editionName = document.getElementById('edition-name').value;
            if (editionName.length < 1 || editionName.length > 100) {
                this.errors.push(`El nombre "${editionName}" no es válido`);
            }
        },

        async validatePassword() {
            // Comprobar que el email del usuario no está en uso o es igual al actual
            const editionPassword = document.getElementById('edition-password').value;
            const editionPasswordRepeat = document.getElementById('edition-password-repeat').value;

            if (editionPassword !== editionPasswordRepeat || editionPassword.length < 3) {
                this.errors.push(`Las contraseñas no coinciden o no son válidas`);
            }
        },

        async deleteUser() {
            if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
                const response = await axios.delete('http://localhost:8080/api/users/' + this.user.id);
                console.log(response);
                window.location.href = './index.html';
            }
        },

        async updateImg() {
            var fReader = new FileReader();
            fReader.readAsDataURL(document.getElementById("profile-pic").files[0]);
            fReader.onloadend = function(event) {
                var img = document.getElementById("picture");
                img.src = event.target.result;
            }
        }
    },
    mounted: function (){
        this.getUserId();
        this.getUser();
        this.getVehicles();
    },
});