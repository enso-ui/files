<template>
    <div class="file-manager"
        v-if="browsable.length">
        <top v-model:query="query"
            v-model:interval="interval"
            :count="files.length"
            @clear="query = '';fetch()"
            @refresh="browse"
            @update:query="browse"
            @update:interval="browse"
            @upload-successful="select(uploadFolder)"/>
        <div class="columns is-variable is-1">
            <div class="column is-narrow py-1">
                <div class="box folders p-1">
                    <p class="is-family-secondary has-text-weight-medium"
                        v-for="folder in browsable"
                        :key="folder">
                        <folder :class="{'selected': folderId === folder.id}"
                            :folder="folder"
                            :key="folder.id"
                            @selected="select(folder)"/>
                    </p>
                </div>
            </div>
            <div class="column files">
                <transition-group tag="div"
                    class="columns is-multiline is-variable is-1"
                    enter-active-class="animate__fadeIn"
                    leave-active-class="animate__fadeOut">
                    <div class="animate__animated column is-half py-1"
                        v-for="file in files"
                        :key="file.id">
                        <file :file="file"
                            @delete="destroy(file)"/>
                    </div>
                </transition-group>
            </div>
            <loader large
                v-if="loading"/>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import Loader from '@enso-ui/loader/bulma';
import { files } from '../../../pinia/files';
import Top from './components/Top.vue';
import Folder from './components/Folder.vue';
import File from './components/File.vue';

export default {
    name: 'Index',

    inject: ['errorHandler', 'http', 'i18n', 'route'],

    components: { Top, Folder, File, Loader },

    data: () => ({
        currentFolder: null,
        files: [],
        interval: {
            min: null,
            max: null,
        },
        loading: false,
        query: '',
    }),

    computed: {
        browsable() {
            return files().browsable;
        },
        uploadFolder() {
            return files().uploadFolder;
        },
        folderId() {
            return this.currentFolder?.id;
        },
    },

    created() {
        this.browse = debounce(this.browse, 350);
        this.select(this.browsable[0]);
    },

    methods: {
        browse() {
            const { interval, query, currentFolder } = this;
            const { isSystem, endpoint, id } = currentFolder;

            const path = isSystem
                ? this.route(`core.files.${endpoint}`)
                : this.route('core.files.browse', id);

            this.loading = true;

            this.http.get(path, { params: { interval, query } })
                .then(({ data }) => (this.files = data))
                .catch(this.errorHandler)
                .finally(() => (this.loading = false));
        },
        destroy({ id }) {
            this.loading = true;

            const index = id => this.files.findIndex(file => file.id === id);

            this.http.delete(this.route('core.files.destroy', id, false))
                .then(() => this.files.splice(index(id), 1))
                .catch(this.errorHandler)
                .finally(() => (this.loading = false));
        },
        select(folder) {
            this.currentFolder = folder;
            this.browse();
        },
    },
};
</script>

<style lang="scss">
    .file-manager {
        .control.has-icons-right {
            .icon.clear-button {
                pointer-events: all;
            }

            .input {
                width: 20em;
            }
        }

        .folders {
            .button {
                opacity: 0.7;
                justify-content: flex-start;
                padding-inline: 0.65rem;
                width: 100%;

                .icon {
                    width: 2em;
                }

                &:hover,
                &:focus {
                    opacity: 1;
                }
            }
        }

        .box.folders {
            .selected {
                opacity: 1;
            }
        }

        .files {
            min-width: 0;
        }
    }
</style>
