Vue.use(Toasted)
Vue.use(VueRouter)
new Vue({
    el: '#app',
    data: {
        currPath: [],
        folder: [],
        file: [],
        addDirName: '',
        isCNModalShow: false,
        isULModalShow: false,
        oldName: '',
        newName: '',
        uploadFile: ''
    },
    created() {
        const urlParams = new URLSearchParams(window.location.search)
        const path = urlParams.get('path')
        if (path) this.currPath = path.split('/')

        this.getDir(path ? path : '/')
    },
    methods: {
        getDir(path = '/') {
            axios.get(`/api/dir${path !== '/' ? '?path=' + path : ''}`)
                .then(res => {
                    this.folder = res.data.folder
                    this.file = res.data.file
                })
                .catch(function (err) {
                    console.log(err)
                });
        },
        addDir() {
            if (!this.addDirName) {
                this.$toasted.show('Folder name cannot be empty!', {
                    position: 'bottom-right',
                    duration: 3000,
                    type: 'error',
                    iconPack: 'fontawesome',
                    icon: 'fa-times'
                })
                return
            }
            const path = (this.currPath.length > 0 ? this.currPath.join('/') + '/' : '') + this.addDirName.trim()
            console.log(path)
            axios.post('/api/dir', {path: path})
                .then(res => {
                    this.addDirName = ''
                    this.$toasted.show('Folder created!', {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'success',
                        iconPack: 'fontawesome',
                        icon: 'fa-check'
                    })
                    location.replace('/fe?path=' + this.currPath.join('/'))
                })
                .catch(e => {
                    this.$toasted.show(e.response.data.message, {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'error',
                        iconPack: 'fontawesome',
                        icon: 'fa-times'
                    })
                })
        },
        delDir(path) {
            axios.delete(`/api/dir${path !== '/' ? '?path=' + path : ''}`)
                .then(res => {
                    this.$toasted.show('Folder deleted!', {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'success',
                        iconPack: 'fontawesome',
                        icon: 'fa-check'
                    })
                    location.replace('/fe?path=' + this.currPath.join('/'))
                })
                .catch(e => {
                    this.$toasted.show(e.response.data.message, {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'error',
                        iconPack: 'fontawesome',
                        icon: 'fa-times'
                    })
                })
        },
        renameDir() {
            if (!this.oldName && !this.newName) {
                this.$toasted.show('New folder name cannot be empty!', {
                    position: 'bottom-right',
                    duration: 3000,
                    type: 'error',
                    iconPack: 'fontawesome',
                    icon: 'fa-times'
                })
                return
            }
            axios.patch('/api/dir', {oldName: this.oldName, newName: this.newName})
                .then(res => {
                    this.$toasted.show('Name changed!', {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'success',
                        iconPack: 'fontawesome',
                        icon: 'fa-check'
                    })
                    this.closeChangeNameModal()
                    location.replace('/fe?path=' + this.currPath.join('/'))
                })
                .catch(e => {
                    this.closeChangeNameModal()
                    this.$toasted.show(e.response.data.message, {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'error',
                        iconPack: 'fontawesome',
                        icon: 'fa-times'
                    })
                })
        },
        writeFile() {
            if (!this.uploadFile) {
                this.$toasted.show('File must me specified!', {
                    position: 'bottom-right',
                    duration: 3000,
                    type: 'error',
                    iconPack: 'fontawesome',
                    icon: 'fa-times'
                })
                return
            }
            const formData = new FormData()
            formData.append('file', this.uploadFile)
            formData.append('path', (this.currPath.length > 0 ? this.currPath.join('/') + '/' : ''))
            axios.post('/api/dir/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(res => {
                    this.addDirName = ''
                    this.$toasted.show('File uploaded!', {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'success',
                        iconPack: 'fontawesome',
                        icon: 'fa-check'
                    })
                    this.closeUploadModal()
                    location.replace('/fe?path=' + this.currPath.join('/'))
                })
                .catch(e => {
                    this.$toasted.show(e.response.data.message, {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'error',
                        iconPack: 'fontawesome',
                        icon: 'fa-times'
                    })
                })
        },
        getFileType(name) {
            const type = name.split('.')
            return type[type.length - 1]
        },
        bytesToSize(bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Bytes';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },
        deleteItem(item) {
            console.log(item)
        },
        openChangeNameModal(path) {
            this.isCNModalShow = true
            this.oldName = path
            this.newName = ''
        },
        closeChangeNameModal() {
            this.isCNModalShow = false
            this.oldName = ''
            this.newName = ''
        },
        openUploadModal(path) {
            this.isULModalShow = true
            this.uploadFile = ''
        },
        closeUploadModal() {
            this.isULModalShow = false
            this.uploadFile = ''
        },
        handleFileUpload() {
            this.uploadFile = this.$refs.file.files[0];
        }
    }
})
