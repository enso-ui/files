import { defineStore } from 'pinia';

export const files = defineStore('files', {
    state: () => ({
        types: [],
    }),

    getters: {
        browsable: state => state.types.filter(({ isBrowsable }) => isBrowsable),
        uploadFolder: state => state.types.find(({ isUpload }) => isUpload),
    },

    actions: {
        set(types) {
            this.types = types;
        },
    },
});
