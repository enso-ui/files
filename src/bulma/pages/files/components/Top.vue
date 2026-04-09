<template>
    <div class="level is-mobile mb-4 files-top">
        <div class="level-left">
            <div class="level-item">
                <div class="field has-addons has-addons-right">
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
            <div class="level-item"
                v-if="count > 0">
                <span>
                    {{ count }} {{ i18n('files')}}
                </span>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
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
            <div class="level-item">
                <a class="button"
                    @click="$emit('refresh')">
                    <span class="icon">
                        <fa :icon="faArrowsRotate"/>
                    </span>
                </a>
            </div>
        </div>
    </div>
    <enso-date-filter class="box files-top__date-filter"
        v-bind="$attrs"
        v-model:filter="dateFilter"
        compact/>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faSearch, faArrowsRotate, faUpload } from '@fortawesome/free-solid-svg-icons';
import { EnsoUploader } from '@enso-ui/uploader/bulma';
import { EnsoDateFilter } from '@enso-ui/filters/bulma';

export default {
    name: 'Top',

    components: { Fa, EnsoDateFilter, EnsoUploader },

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
    },

    emits: ['clear', 'refresh', 'update:query'],

    data: () => ({
        faArrowsRotate,
        faSearch,
        faUpload,
        dateFilter: 'thisMonth',
    }),
};
</script>

<style lang="scss">
.files-top {
    padding: 0.15rem 0;

    .input.filter,
    .button {
        background-color: var(--enso-filter-control-surface);
    }

    .input.filter {
        color: var(--bulma-input-color);

        &::placeholder {
            color: var(--bulma-text-light);
        }
    }

    .button {
        color: var(--bulma-text-strong);

        &:hover,
        &:focus {
            background-color: var(--enso-filter-surface);
            color: var(--bulma-text-strong);
        }
    }

    .clear-button {
        .delete {
            background-color: var(--bulma-scheme-main-ter);

            &::before,
            &::after {
                background-color: var(--bulma-text);
            }
        }
    }

    &__date-filter {
        background-color: var(--enso-filter-surface);
        border: none;
        box-shadow: none;
    }
}
</style>
