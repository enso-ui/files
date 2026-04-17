import { describe, expect, it, vi } from 'vitest';

vi.mock('@enso-ui/enums/src/pinia/enums', () => ({
    enums: () => ({
        enums: {
            temporaryLinkDuration: {
                _filter: vi.fn(),
            },
        },
    }),
}));

vi.mock('@enso-ui/transitions', () => ({
    Fade: {},
}));

vi.mock('@enso-ui/confirmation/bulma', () => ({
    default: {},
}));

vi.mock('@enso-ui/clipboard', () => ({
    default: {},
}));

vi.mock('@enso-ui/mixins', () => ({
    EnsoFile: class {
        icon() {
            return 'icon';
        }
    },
}));

import Actions from '../src/bulma/pages/files/components/Actions.vue';

describe('files state access', () => {
    it('uses enum store directly in file actions', () => {
        expect(Actions.computed.enums.call({}).temporaryLinkDuration._filter).toBeTypeOf('function');
    });
});
