<template>
    <div class="files-wrapper"
        v-if="browsable.length">
        <top v-model:query="query"
            v-model:interval="interval"
            :count="total"
            :pagination="pagination"
            :thumbnails="thumbnails"
            @clear="clearQuery"
            @refresh="browse"
            @update:pagination="updatePagination"
            @update:query="updateQuery"
            @update:thumbnails="thumbnails = $event"
            @update:interval="updateInterval"
            @upload-successful="select(uploadFolder)"/>
        <div class="columns is-mobile is-variable is-1">
            <div class="column is-narrow">
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
            <div class="column">
                <div class="columns is-mobile is-multiline is-variable is-1"
                    :class="{ 'is-centered': thumbnails }">
                    <file v-for="file in files"
                        :key="file.id"
                        :file="file"
                        :thumbnail="thumbnails"
                        @delete="destroy(file)"/>
                </div>
                <enso-pagination :length="total"
                    :loading="loading"
                    :page="page"
                    :page-size="pagination"
                    @page-changed="changePage"/>
            </div>
            <loader large
                v-if="loading"/>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import { EnsoPagination } from '@enso-ui/pagination/bulma';
import Loader from '@enso-ui/loader/bulma';
import { files } from '../../../pinia/files';
import Top from './components/Top.vue';
import Folder from './components/Folder.vue';
import File from './components/File.vue';

export default {
    name: 'Index',

    inject: ['errorHandler', 'http', 'i18n', 'route'],

    components: {
        EnsoPagination, Top, Folder, File, Loader,
    },

    data: () => ({
        currentFolder: null,
        files: [],
        interval: {
            min: null,
            max: null,
        },
        loading: false,
        page: 1,
        pagination: 20,
        query: '',
        thumbnails: false,
        total: 0,
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
            const { currentFolder, interval, page, pagination, query } = this;
            const { isSystem, endpoint, id } = currentFolder;

            const path = isSystem
                ? this.route(`core.files.${endpoint}`)
                : this.route('core.files.browse', id);

            this.loading = true;

            this.http.get(path, {
                params: { interval, page, pagination, query },
            })
                .then(({ data }) => {
                    this.files = data.data;
                    this.page = data.meta.current_page;
                    this.pagination = data.meta.per_page;
                    this.total = data.meta.total;
                })
                .catch(this.errorHandler)
                .finally(() => (this.loading = false));
        },
        destroy({ id }) {
            this.loading = true;

            this.http.delete(this.route('core.files.destroy', id, false))
                .then(() => {
                    if (this.files.length === 1 && this.page > 1) {
                        this.page -= 1;
                    }

                    this.browse();
                })
                .catch(this.errorHandler)
                .finally(() => (this.loading = false));
        },
        changePage(page) {
            this.page = page;
            this.browse();
        },
        clearQuery() {
            this.query = '';
            this.resetPage();
            this.browse();
        },
        select(folder) {
            this.resetPage();
            this.currentFolder = folder;
            this.browse();
        },
        resetPage() {
            this.page = 1;
        },
        updateInterval() {
            this.resetPage();
            this.browse();
        },
        updatePagination(pagination) {
            this.pagination = pagination;
            this.resetPage();
            this.browse();
        },
        updateQuery() {
            this.resetPage();
            this.browse();
        },
    },
};
</script>

<style lang="scss">
    .files-wrapper {
        .icon.clear-button {
            pointer-events: all;
        }

        .filter {
            &.field {
                justify-content: center;
            }

            .control {
                .input {
                    width: 24em;
                }
            }
        }

        .pagination-length {
            .button.input {
                width: 4rem;
                justify-content: center;
            }
        }

        .folders {
            .button {
                opacity: 0.6;
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
                font-weight: bold;
            }
        }
    }
</style>
