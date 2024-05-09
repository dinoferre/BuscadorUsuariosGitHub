const API = "https://api.github.com/users/";

const app = Vue.createApp({
    data() {
        return {
            search: null, // Variable para almacenar la búsqueda del usuario
            result: null, // Variable para almacenar los datos del usuario encontrado
            error: null, // Variable para almacenar cualquier error ocurrido durante la búsqueda
            favorites: new Map() // Mapa para almacenar los usuarios favoritos
        };
    },
    // Método creado cuando se instancia la aplicación Vue
    created(){
        const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"))
        if(savedFavorites?.length){
            const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
            this.favorites = favorites
        }
    },
    computed: {
        isFavorite(){
            // Computed property para verificar si el usuario actual es favorito
            return this.favorites.has(this.result.id)
        },
        allFavorites(){
            // Computed property para obtener todos los favoritos como un array
            return Array.from(this.favorites.values())
        }
    },
    methods: {
        // Método para realizar la búsqueda de usuario en GitHub
        async doSearch() {
            this.result = this.error = null // Reinicia los resultados y errores en cada nueva búsqueda

            try {
                const response = await fetch(API + this.search) // Realiza una solicitud para obtener los datos del usuario
                if (!response.ok) throw new Error("Usuario No Encontrado") // Lanza un error si la solicitud no fue exitosa
                const data = await response.json() // Convierte la respuesta en formato JSON
                console.log(data)
                this.result = data // Almacena los datos del usuario encontrado

            } catch (error) {
                this.error = error // Captura cualquier error ocurrido durante la búsqueda y lo almacena
            } finally {
                this.search = null // Reinicia el campo de búsqueda después de cada búsqueda, independientemente del resultado
            }
        },

        addFavorite(){
            // Método para agregar un usuario a la lista de favoritos
            this.favorites.set(this.result.id, this.result)
            this.updateStorage()
        },

        removeFavorite(){
            // Método para eliminar un usuario de la lista de favoritos
            this.favorites.delete(this.result.id)
            this.updateStorage()
        },

        showFavorite(favorite){
            // Método para mostrar los detalles de un usuario favorito
            this.result = favorite
        },

        updateStorage(){
            // Método para actualizar el almacenamiento local con la lista de favoritos
            window.localStorage.setItem("favorites", JSON.stringify(this.allFavorites))
        }
    }
})