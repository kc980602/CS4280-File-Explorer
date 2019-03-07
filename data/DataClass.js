class FileItem {
    constructor(name, type, size, dateModified, path, items) {
        this.name = name
        this.type = type
        this.size = size
        this.dateModified = dateModified
        this.path = path
        this.items = items
    }
}
module.exports = FileItem;
