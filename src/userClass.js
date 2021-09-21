export {User};

class User {
    constructor(password, image) {
        this.password = password;
        this.image = image;
        this.tasks = {
            "backlog": [],
            "ready": [],
            "in_progress": [],
            "finished": []
        }
    }
}