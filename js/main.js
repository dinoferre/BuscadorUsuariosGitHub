const API = "https://api.github.com/users/";

const app = Vue.createApp({
    data() {
        return {
            search: null, // Variable para almacenar la búsqueda del usuario
            result: null, // Variable para almacenar los datos del usuario encontrado
            error: null, // Variable para almacenar cualquier error ocurrido durante la búsqueda
            favorites: new Map()
        };
    },
    computed: {
        isFavorite(){
            return this.favorites.has(this.result.id)
        }
    },
    methods: {
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
            this.favorites.set(this.result.id, this.result)
        },

        removeFavorite(){
            this.favorites.delete(this.result.id)
        }
    }
})
