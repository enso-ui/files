<template>    
    <a class="menu-item-link"
        @click="$emit('selected')">
        <span class="icon menu-item-icon"
            v-if="folder.icon">
            <fa :icon="folder.icon"
                size="sm"/>
        </span>
        <span class="menu-item-label">
            {{ i18n(folder.name) }}
        </span>
        <span v-if="count > 0">&nbsp;({{ count }})</span>
    </a>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

export default {
    name: 'Folder',

    components: { Fa },

    inject: ['i18n'],

    props: {
        count: {
            type: Number,
            default: 0,
        },
        folder: {
            type: Object,
            required: true,
        },
    },

    emits: ['selected'],
}
</script>