<template>
    <div class="column is-narrow p-1"
        v-if="thumbnail">
        <Thumbnail v-bind="$attrs"/>
    </div>
    <div class="column is-full-mobile is-half-tablet is-one-third-desktop"
        v-else>
        <Item v-bind="$attrs"/>
    </div>
</template>

<script setup>
import Item from './Item.vue';
import Thumbnail from './Thumbnail.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    thumbnail: {
        type: Boolean,
        default: false,
    },
})
</script>
