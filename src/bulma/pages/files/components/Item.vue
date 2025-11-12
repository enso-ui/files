<template>
    <div class="box file-box raises-on-hover p-1 mb-1"
        v-click-outside="() => actions = false">
        <div class="level is-mobile m-0">
            <div class="level-left is-flex-grow-1 is-flex-shrink-1 min-w-0"
                v-tooltip="`${file.name}.${file.extension}`">
                <div class="level-item is-narrow mr-1">
                    <p class="has-text-centered">
                        <fa :icon="icon"/>
                    </p>
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
                <div class="level-item is-justify-content-flex-start is-flex-shrink-1 min-w-0"
                    v-else>
                    <div class="level m-0 is-flex-shrink-1 min-w-0 has-text-weight-bold is-size-7">
                        <div class="level-item m-0 is-flex-shrink-1 min-w-0">
                            <div class="ellipsis">
                                <span class="base"
                                    @click.right.prevent="edit">
                                    {{ file.name }}
                                </span>
                            </div>
                        </div>
                        <div class="level-item"
                            v-if="!editing">
                            <span class="extension"
                                @click.right.prevent="edit">
                                .{{ file.extension }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="level-right is-narrow">
                <div class="level-item is-flex-direction-column">
                    <div class="level-item"
                        v-if="message">
                        <p class="has-text-success mr-2 has-text-weight-bold is-size-7 mx-1">
                            {{ message }}
                        </p>
                    </div>
                    <actions class="is-align-self-flex-end"
                        :file="file"
                        :visible="actions"
                        @copy-to-clipboard="showMessage"
                        @show="actions = true"
                        @hide="actions = false"
                        v-bind="$attrs"
                        v-else-if="!editing"/>
                </div>
            </div>
        </div>
        <div class="level is-mobile">
            <div class="level-left is-flex-shrink-1 min-w-0">
                <div class="level-item is-flex-shrink-1 min-w-0">
                    <p class="info is-family-code is-size-7 ellipsis">
                        <span class="has-text-weight-bold">{{ file.size }}</span> {{ timestamp }}
                    </p>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
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
    name: 'Item',

    directives: { clickOutside, focus, selectOnFocus },

    components: { Actions, Fa, Avatar },

    inject: ['errorHandler', 'http', 'route'],

    props: {
        file: {
            type: Object,
            required: true,
        },
    },

    data: v => ({
        editing: false,
        actions: false,
        message: null,
        originalName: v.file.name,
    }),

    computed: {
        icon() {
            return (new EnsoFile(this.file)).icon();
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

    .box.file-box {
        cursor: pointer;

        .level {
            .level-left {
                overflow: hidden;

                .filename .base, .info {
                    white-space: nowrap;
                    text-overflow: ellipsis
                }
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
