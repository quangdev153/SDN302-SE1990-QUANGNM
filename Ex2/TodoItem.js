class TodoItem {
    constructor(title) {
        this.title = title;
        this.completed = false;
    }
    complete() {
        this.completed = true;
    }
}

module.exports = TodoItem;