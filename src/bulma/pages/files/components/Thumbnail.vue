<template>
    <div class="column is-narrow p-1"
          v-click-outside="() => actions = false">
        <div class="box file-thumbnail raises-on-hover p-1 mb-1">
            <div class="preview has-text-centered">
                <figure class="image is-192x192 is-flex is-align-content-center is-justify-content-center"
                    v-if="isImage">
                    <img :src="route('core.files.show', file.id)">
                </figure>
                <fa :icon="icon"
                    size="8x"
                    v-else/>
            </div>
             <div class="level-item"
                    v-if="editing">
                    <input class="input is-small is-fullwidth"
                        v-model="file.name"
                        v-click-outside="cancelEdit"
                        v-focus
                        v-select-on-focus
                        @keydown.enter="update"
                        @keydown.esc="cancelEdit">
            </div>
            <div class="filename has-text-weight-bold has-text-centered is-size-7 
                is-flex is-justify-content-center m-0"
                v-tooltip="`${file.name}.${file.extension}`"
                v-else >
                <div class="level-item is-flex-shrink-1 min-w-0 mr-0">
                    <div class="ellipsis">
                        <span class=""
                         @click.right.prevent="edit">
                            {{ file.name }}.
                        </span>
                    </div>
                </div>
                <div class="level-item"
                    v-if="!editing">
                    <span class="extension"
                        @click.right.prevent="edit">
                        {{ file.extension }}
                    </span>
                </div>
            </div>
            <p class="info is-family-code is-size-7">
                <span class="has-text-weight-bold">{{ file.size }}</span> {{ timestamp }}
            </p>
            <div class="level m-0">
                <div class="level-item is-narrow is-size-7 has-text-weight-bold"
                    v-if="message">
                    <p class="has-text-success">
                        {{ message }}
                    </p>
                </div>
                <div class="level-item is-flex-grow-1 is-justify-content-flex-start"
                    v-else>
                    <actions thumbnail
                        :file="file"
                        :visible="actions"
                        @copy-to-clipboard="showMessage"
                        v-bind="$attrs"/>
                </div>
                <div class="level-item is-narrow">
                    <avatar class="is-24x24"
                        tooltip
                        :user="file.owner"
                        v-if="file.owner"/>
                    <figure class="image is-24x24"
                        v-else/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import Avatar from '@enso-ui/users/src/bulma/pages/users/components/Avatar.vue';
import { EnsoFile } from '@enso-ui/mixins';
import { clickOutside, focus, selectOnFocus } from '@enso-ui/directives';
import format from '@enso-ui/ui/src/modules/plugins/date-fns/format';
import Actions from './Actions.vue';

export default {
    name: 'Thumbnail',

    directives: { clickOutside, focus, selectOnFocus },

    components: { Actions, Fa, Avatar },

    inject: ['errorHandler', 'http', 'route'],

    props: {
        file: {
            type: Object,
            required: true,
        },
        actions: {
            type: Boolean,
            default: true,
        },
    },

    data: v => ({
        editing: false,
        message: null,
        originalName: v.file.name,
    }),

    computed: {
        icon() {
            return (new EnsoFile(this.file)).icon();
        },
        isImage() {
            return (new EnsoFile(this.file)).isImage();
        },
        timestamp() {
            return format(this.file.createdAt, 'd M Y h:i');
        },
    },

    methods: {
        cancelEdit() {
            this.file.name = this.originalName;
            this.editing = false;
        },
        edit() {
            if (this.file.isManageable) {
                this.editing = true;
            }
        },
        showMessage(message) {
            this.message = message;

            setTimeout(() => (this.message = null), 2500);
        },
        update() {
            if (this.file.name === '' || this.file.name.length > 255) {
                return;
            }

            const { id, name } = this.file;

            this.http.patch(this.route('core.files.update', id), { name })
                .then(() => (this.originalName = this.file.name))
                .catch(this.errorHandler)
                .finally(() => (this.editing = false));
        },
    },
};
</script>

<style lang="scss">
.min-w-0 {
    min-width: 0;
}
.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.box.file-thumbnail {
    cursor: pointer;
    width: 12.5em;

    .preview {
        .image.is-192x192 {
                height: 192px;
                width: 192px;

                img {
                    object-fit: contain;
                }
            }
    }

    .level {
        .level-left {
            overflow: hidden;

            // .filename .base, .info {
            //     word-break: break-all;
            // }
        }
        .level-right {
            .v-popper__inner {
                padding: 1px;
            }

            .image.avatar {
                margin: 0 0 0 auto;
            }
        }
    }
}
</style>
