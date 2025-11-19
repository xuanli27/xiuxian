export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number; // Contribution points
    type: 'RESOURCE' | 'CONSUMABLE' | 'ARTIFACT';
    effect?: {
        type: 'RESTORE_QI' | 'ADD_SPIRIT_STONE' | 'REDUCE_DEMON';
        value: number;
    };
    icon: string;
}

export const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'spirit_stone_pouch',
        name: '下品灵石袋',
        description: '装有少量灵石的袋子，是修仙界的硬通货。',
        price: 100,
        type: 'RESOURCE',
        effect: {
            type: 'ADD_SPIRIT_STONE',
            value: 100
        },
        icon: '💎'
    },
    {
        id: 'meditation_incense',
        name: '凝神香',
        description: '点燃后可平心静气，略微降低心魔。',
        price: 300,
        type: 'CONSUMABLE',
        effect: {
            type: 'REDUCE_DEMON',
            value: 50
        },
        icon: '♨️'
    },
    {
        id: 'qi_gathering_pill',
        name: '聚气丹',
        description: '服用后可快速恢复少量灵气。',
        price: 500,
        type: 'CONSUMABLE',
        effect: {
            type: 'RESTORE_QI',
            value: 200
        },
        icon: '💊'
    },
    {
        id: 'foundation_pill',
        name: '筑基丹碎片',
        description: '传说中筑基丹的碎片，集齐不知多少个也没用，主要是为了骗氪（划掉）收藏。',
        price: 1000,
        type: 'ARTIFACT',
        icon: '🧩'
    }
];
