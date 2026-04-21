<template>
    <div class="columns is-mobile is-multiline is-variable is-1 is-centered">
        <div class="column is-full-mobile is-narrow-tablet">
            <div class="filter field has-addons has-addons-right">
                <div class="box p-1 has-text-centered">
                    <div class="control has-icons-left has-icons-right">
                        <input class="input filter"
                            :value="query"
                            @input="$emit('update:query', $event.target.value)"
                            type="text"
                            :placeholder="i18n('Filter files')">
                        <span class="icon is-small is-left has-text-muted">
                            <fa :icon="faSearch"/>
                        </span>
                        <span class="icon is-small is-right clear-button has-text-muted is-clickable"
                            @click="$emit('clear')"
                            v-if="query">
                            <a class="delete is-small"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="column is-hidden-mobile"/>
        <div class="column is-narrow">
            <div class="box p-1">
                <a class="button"
                    @click="$emit('update:thumbnails', !thumbnails)">
                    <span class="icon"
                        v-if="thumbnails">
                        <fa :icon="faImage"/>
                    </span>
                    <span class="icon"
                        v-else>
                        <fa :icon="faList"/>
                    </span>
                </a>
            </div>
        </div>
        <div class="column is-narrow">
            <div class="box p-1">
                <dropdown class="pagination-length">
                    <template #label>
                        {{ pagination }}
                    </template>
                    <template #items>
                        <dropdown-item v-for="value in paginationOptions"
                            :key="value"
                            :selected="pagination === value"
                            @select="$emit('update:pagination', value)">
                            {{ value }}
                        </dropdown-item>
                    </template>
                </dropdown>
            </div>
        </div>
        <div class="column is-narrow">
            <div class="box p-1">
                <enso-uploader v-bind="$attrs"
                    compact
                    multiple
                    :url="route('core.uploads.store')"
                    file-key="upload">
                    <template #control="{ controlEvents }">
                        <a class="button"
                            v-on="controlEvents">
                            <span class="icon">
                                <fa :icon="faUpload"/>
                            </span>
                        </a>
                    </template>
                </enso-uploader>
            </div>
        </div>
        <div class="column is-narrow">
            <div class="box p-1">
                <a class="button"
                    @click="$emit('refresh')">
                    <span class="icon">
                        <fa :icon="faArrowsRotate"/>
                    </span>
                </a>
            </div>
        </div>
    </div>
    <div class="columns is-centered">
        <div class="column is-narrow">
            <enso-date-filter class="box"
                v-bind="$attrs"
                v-model:filter="dateFilter"
                compact/>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import {
    faSearch, faArrowsRotate, faUpload, faList, faImage,
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import { EnsoUploader } from '@enso-ui/uploader/bulma';
import { EnsoDateFilter } from '@enso-ui/filters/bulma';

export default {
    name: 'Top',

    components: {
        Dropdown, DropdownItem, EnsoDateFilter, EnsoUploader, Fa,
    },

    inject: ['i18n', 'route'],

    props: {
        count: {
            type: Number,
            required: true,
        },
        query: {
            type: String,
            required: true,
        },
        pagination: {
            type: Number,
            required: true,
        },
        thumbnails: {
            type: Boolean,
            required: true,
        },
    },

    emits: [
        'clear', 'refresh', 'update:pagination', 'update:query', 'update:thumbnails',
    ],

    data: () => ({
        faArrowsRotate,
        faImage,
        faList,
        faSearch,
        faUpload,
        dateFilter: 'thisMonth',
        paginationOptions: [20, 40, 60, 80, 100],
    }),
};
</script>
