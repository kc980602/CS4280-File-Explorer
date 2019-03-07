Vue.use(Toasted)
Vue.use(VueRouter)
new Vue({
    el: '#app',
    data: {
        currPath: [],
        folder: [],
        file: [],
        addDirName: ''
    },
    created() {
        const urlParams = new URLSearchParams(window.location.search)
        const path = urlParams.get('path')
        this.getDir(path ? path : '/')

    },
    methods: {
        getDir(path = '/') {
            axios.get(`/api/dir${path !== '/' ? '?path='+ path : ''}`)
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
            axios.post('/api/dir', {path: this.addDirName.trim()})
                .then(res => {
                    this.addDirName = ''
                    this.$toasted.show('Folder Created!', {
                        position: 'bottom-right',
                        duration: 3000,
                        type: 'success',
                        iconPack: 'fontawesome',
                        icon: 'fa-check'
                    })
                    this.getDir()
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
        delDir(){

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
        }
    }
})
