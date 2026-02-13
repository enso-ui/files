<template>
    <component :is="component"/>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import Item from './Item.vue';
import Thumbnail from './Thumbnail.vue';

const props = defineProps({
    thumbnail: {
        type: Boolean,
        default: false,
    },
})

const component = computed(() => props.thumbnail ? Thumbnail : Item);
</script>
