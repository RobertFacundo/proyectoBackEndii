export default class UserDTO {
    constructor(user) {
        this.id = user._id; // Incluye solo lo necesario
        this.name = user.name;
        this.email = user.email;
        this.role = user.role; 
    }
}