<template>
    <div class="is-flex">
        <template v-if="visible || handling">
            <template v-if="file.isManageable">
                <a class="button is-small is-naked p-1"
                    @click="makePrivate"
                    v-if="file.isPublic && canAccess('core.files.makePrivate')">
                    <span class="icon is-small">
                        <fa :icon="faUnlock"
                            size="xs"/>
                    </span>
                </a>
                <a class="button is-small is-naked p-1"
                    @click="makePublic"
                    v-else-if="!file.isPublic && canAccess('core.files.makePublic')">
                    <span class="icon is-small">
                        <fa :icon="faLock"
                            size="xs"/>
                    </span>
                </a>
            </template>
            <dropdown class="file-actions share"
                v-if="file.isAccessible && canAccess('core.files.link')"
                ref="dropdown"
                @hide="handling = false">
                <a class="button is-small is-naked p-1"
                    @click="handling = true">
                    <span class="icon is-small">
                        <fa :icon="faLink"
                            size="xs"/>
                    </span>
                </a>
                <template #popper>
                    <div class="file-actions share-menu">
                        <ul>
                        <li v-for="{ value, label } in enums.temporaryLinkDuration._filter()"
                            :key="value">
                            <button class="button is-small is-fullwidth file-actions share-button"
                                @click="$refs.dropdown.hide(); link(value)">
                                {{ label }}
                            </button>
                        </li>
                        </ul>
                    </div>
                </template>
            </dropdown>
            <a class="button is-small is-naked p-1"
                @click="show"
                v-if="isViewable">
                <span class="icon is-small">
                    <fa :icon="faEye"
                        size="xs"/>
                </span>
            </a>
            <a class="button is-small is-naked p-1"
                :href="route('core.files.download', file.id)"
                v-if="file.isAccessible && canAccess('core.files.download')">
                <span class="icon is-small">
                    <fa :icon="faCloudArrowDown"
                        size="xs"/>
                </span>
            </a>
            <confirmation placement="left"
                @confirm="$emit('delete')"
                @hide="handling = false"
                v-if="file.isManageable && canAccess('core.files.destroy')">
                <a class="button is-small is-naked p-1"
                    @click="handling = true">
                    <span class="icon is-small">
                        <fa :icon="faTrashCan"
                            size="xs"/>
                    </span>
                </a>
            </confirmation>
        </template>
        <a class="button is-small is-naked p-1"
            v-if="canAccess('core.files.favorite') && file.type.isBrowsable"
            :class="{ 'has-text-warning': file.isFavorite }"
            @click="toggleFavorite">
            <span class="icon is-small"
                v-if="file.isFavorite">
                <fa :icon="faStar"
                    size="xs"/>
            </span>
            <span class="icon is-small"
                v-else>
                <fa :icon="farStar"
                    size="xs"/>
            </span>
        </a>
        <a class="button is-small is-naked p-1"
            @click="$emit(visible ? 'hide' : 'show')"
            v-if="!thumbnail">
            <span class="icon is-small">
                <fa :icon="faEllipsis"
                    size="xs"/>
            </span>
        </a>
        <clipboard ref="clipboard"/>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import {
    faEye, faCloudArrowDown, faTrashCan, faLink,
    faStar, faLock, faUnlock, faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Confirmation from '@enso-ui/confirmation/bulma';
import Clipboard from '@enso-ui/clipboard';
import { Fade } from '@enso-ui/transitions';
import { enums } from '@enso-ui/enums/src/pinia/enums';
import { EnsoFile } from '@enso-ui/mixins';
import { Dropdown } from 'v-tooltip';

export default {
    name: 'Actions',

    components: {
        Fade, Confirmation, Clipboard, Fa, Dropdown,
    },

    inject: ['canAccess', 'errorHandler', 'http', 'i18n', 'route'],

    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        file: {
            type: Object,
            required: true,
        },
        thumbnail: {
            type: Boolean,
            default: false,
        },
    },

    emits: ['copy-to-clipboard', 'delete', 'hide', 'show'],

    data: v => ({
        faCloudArrowDown,
        faEllipsis,
        faEye,
        faLink,
        faLock,
        faStar,
        faTrashCan,
        faUnlock,
        farStar,
        ensoFile: new EnsoFile(v.file),
        message: null,
        preview: false,
        handling: false,
    }),

    computed: {
        enums() {
            return enums().enums;
        },
        isViewable() {
            return this.file.isAccessible
                && this.ensoFile.isViewable()
                && this.canAccess('core.files.show');
        },
    },

    methods: {
        copyToClipboard({ data: { link } }) {
            this.$refs.clipboard.copy(link);
            this.$emit('copy-to-clipboard', this.i18n('copied'));
        },
        link(seconds) {
            const path = this.route('core.files.link', this.file.id);
            this.http.get(path, { params: { seconds } })
                .then(this.copyToClipboard)
                .catch(this.errorHandler);
        },
        show() {
            const path = this.route('core.files.show', this.file.id);
            window.open(path, '_blank').focus();
        },
        makePrivate() {
            this.http.patch(this.route('core.files.makePrivate', this.file.id))
                .then(({ data: { isPublic } }) => (this.file.isPublic = isPublic))
                .catch(this.errorHandler);
        },
        makePublic() {
            this.http.patch(this.route('core.files.makePublic', this.file.id))
                .then(({ data: { isPublic } }) => (this.file.isPublic = isPublic))
                .catch(this.errorHandler);
        },
        toggleFavorite() {
            this.http.patch(this.route('core.files.favorite', this.file.id))
                .then(({ data: { isFavorite } }) => (this.file.isFavorite = isFavorite))
                .catch(this.errorHandler);
        },
    },
};
</script>

<style scoped lang="scss">
:deep(.file-actions .share) {
    --enso-tooltip-background: var(--bulma-scheme-main);
    --enso-tooltip-color: var(--bulma-text);
    --enso-tooltip-border-color: var(--bulma-border);
}

:deep(.file-actions .share-menu) {
    min-width: 4.75rem;

    ul {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }
}

:deep(.file-actions .share-button) {
    background-color: var(--enso-filter-control-surface);
    color: var(--bulma-text-strong);
    justify-content: center;

    &:hover,
    &:focus {
        background-color: var(--enso-surface);
        color: var(--bulma-text-strong);
    }
}

.is-flex > .button.is-small.is-naked {
    height: 1.85rem;
    min-height: 1.85rem;
    width: 1.85rem;
    padding: 0;
}
</style>
