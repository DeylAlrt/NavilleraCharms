function letterLinkItems(material) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => {
        const n = i + 1;
        const file = n === 1
            ? `letter_Letters ${material} (1).png`
            : `Letters ${material} (${n}).png`;
        return { label: letter, file };
    });
}

function numberLinkItems() {
    const items = [];
    for (let n = 1; n <= 9; n++) {
        items.push({ label: String(n - 1), file: `Number (${n}).png` });
    }
    items.push({ label: '9', file: 'number_number_Number.png' });
    return items;
}

const CATALOGUE = {
    links: [
        {
            name: 'Plain Charms — Silver', price: 1.00, unit: 'each link',
            items: [{ label: 'Silver', file: 'Silver_Plain_Charm.png' }]
        },
        {
            name: 'Plain Charms — Colors', price: 1.50, unit: 'each link',
            items: [
                { label: 'Gold', file: 'Gold_Plain_Charm.png', },
                { label: 'Red', file: 'Red_Plain_Charm.png' },
                { label: 'Blue', file: 'Blue_Plain_Charm.png' },
                { label: 'Black', file: 'Black_Plain_Charm.png' },
                { label: 'Brown', file: 'Brown_Plain_Charm.png' },
                { label: 'Purple', file: 'Purple_Plain_Charm.png' },
                { label: 'Pink', file: 'Pink_Plain_Charm.png' }
            ]
        },
        {
            name: 'Concave Classic Charms', price: 2.50, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7].map(n => ({
                label: ['Paw', 'Star', 'Heart Outline', 'Heart', 'Star Outline', 'Sparkle', 'Butterfly'][n - 1],
                file: `Concave_Classic_Charms (${n}).png`
            }))
        },
        {
            name: 'Gold Classic Charms', price: 3.00, unit: 'each link',
            items: [
                { label: 'Red Flower', file: 'Gold_Classic_Charms (1).png' },
                { label: 'Pink Flower', file: 'Gold_Classic_Charms (2).png' },
                { label: 'Clover Outline', file: 'Gold_Classic_Charms (3).png' },
                { label: 'Pink Heart', file: 'classic_Gold_Classic_Charms (4).png' }
            ]
        },
        {
            name: 'Silver Letter Links', price: 3.00, unit: 'each link',
            items: letterLinkItems('Silver')
        },
        {
            name: 'Number Links', price: 3.00, unit: 'each link',
            items: numberLinkItems()
        },
        {
            name: 'Gold Letter Links', price: 3.50, unit: 'each link',
            items: letterLinkItems('Gold')
        },
        {
            name: 'Outline Classic Charms', price: 3.50, unit: 'each link',
            items: [1, 2, 3, 4, 5].map(n => ({
                label: ['Heart', 'Butterfly', 'Flower', 'Star', 'Double Heart'][n - 1],
                file: `Outline_Classic_Charms (${n}).png`
            }))
        },
        {
            name: 'Colored Classic Charms', price: 4.00, unit: 'each link',
            items: [
                { label: 'Pink Heart', file: 'Colored_Classic_Charms (1).png' },
                { label: 'Pink Clover', file: 'Colored_Classic_Charms (2).png' },
                { label: 'Silver Clover Outline', file: 'Colored_Classic_Charms (3).png' },
                { label: 'Red Clover', file: 'Colored_Classic_Charms (4).png' },
                { label: 'Red Heart', file: 'Colored_Classic_Charms (5).png' },
                { label: 'Silver Heart Outline', file: 'Colored_Charms (6).png' },
                { label: 'Maroon Star', file: 'Colored_Classic_Charms (7).png' }
            ]
        },
        {
            name: 'Solid Classic Charms', price: 4.50, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6].map(n => ({
                label: ['Flower', 'Double Heart', 'Heart Outline', 'Heart', 'Star', 'Paw'][n - 1],
                file: `Solid_Classic_Charms (${n}).png`
            }))
        },
        {
            name: 'Starter Premium Charms', price: 5.00, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(n => ({
                label: [
                    'Concentric Hearts', 'Game Controller', 'Gold Flower', 'Black Spider',
                    'Green Gummy Bear', 'Pink & Blue Gummy Bears', 'Coffee Cup', 'Pink Lipstick',
                    'Pink Telephone', 'Evil Eye', 'Heart Sunglasses', 'Music Note', 'Pearl', 'Evil Eye II'
                ][n - 1],
                file: `Starter_Premium_Charms (${n}).png`
            }))
        },
        {
            name: 'Premium Charms', price: 7.00, unit: 'each link',
            items: [
                [30, 'PSG'], [31, 'Real Madrid'], [32, 'Bayern Munich'], [33, 'Juventus'], [34, 'AC Milan'], [35, 'Inter Milan'],
                [38, 'Barcelona'], [39, 'Manchester United'], [40, 'Fox Character'], [41, 'Bunny Character'], [42, 'Cinnamoroll'],
                [43, 'My Melody'], [44, 'Hello Kitty'], [45, 'Badtz-Maru'], [46, 'Pink Bunny Character'], [47, 'Cream Cat Character'],
                [48, 'Glitter Heart'], [49, 'Anti Social'], [50, 'Spiderweb'], [51, 'Vintage Camera'], [52, 'Buttercup'],
                [53, 'Pink Bunny Girl'], [54, 'Bubbles'], [55, 'Husky'], [56, 'French Bulldog'], [57, 'White Puppy'],
                [58, 'Black & White Cat'], [59, 'Volleyball'], [60, 'Soccer Ball'], [61, 'Basketball'], [62, 'Orange Ball Badge'],
                [63, 'Volleyball II'], [64, 'Corgi'], [65, 'Golden Retriever'], [66, 'Mercedes-Benz Logo'], [67, 'Racing Flags'],
                [68, 'Red Sports Car'], [69, 'BMW Logo'], [70, 'Ferrari Logo'], [71, 'Porsche Logo'], [72, 'Mercedes-Benz Logo II'],
                [73, 'Rolls-Royce'], [74, 'Pink Mercedes Logo'], [75, 'Pink BMW Logo'], [76, 'Pink Ferrari Horse'],
                [77, 'Pink Porsche Shield'], [78, 'Lamborghini Logo']
            ].map(([n, label]) => ({ label, file: `Premium Charms (${n}).png` }))
        },
        {
            name: 'Flags', price: 8.00, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
                label: ['Philippines', 'Netherlands', 'South Korea', 'India', 'Egypt', 'Czech Republic', 'UAE', 'Pakistan'][n - 1],
                file: `Flags (${n}).png`
            }))
        },
        {
            name: 'Iconic Premium Charms', price: 8.00, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(n => ({
                label: [
                    'Playing Card Suits', 'Black Bat', 'Crazy', 'Sexy', 'Opal Oval Gem', 'Red Oval Gem', 'Red Cross Clover',
                    'White Sparkle Gem', 'Pink Flower', 'Lavender Flower', 'Cream Flower', 'White Opal Cluster', 'Vodka',
                    'Drama Queen', 'Barbie', 'Pink Checkered', 'Pink Butterfly', 'I Love My Boyfriend', 'I Love My Girlfriend',
                    'Emerald Gem', 'Sexy II', 'Piano Keys', 'Black Spider', 'Gold Sunburst', 'Blue Star', 'Night Sky Moon',
                    'Diamond Checkered', 'Black & White Checkered', 'Blue Stars Pattern', 'Crescent Moon & Star'
                ][n - 1],
                file: `Iconic_Premium_Charms (${n}).png`
            }))
        },
        {
            name: 'Baby Deluxe Charms', price: 10.00, unit: 'each link',
            items: [{ label: 'Baby Blocks', file: 'deluxe_Baby_Deluxe_Charms.png' }]
        },
        {
            name: 'Silver Dangling Deluxe Charms', price: 12.00, unit: 'each link',
            items: [1, 2, 3, 4].map(n => ({
                label: ['Heart Dangle', 'Heart Dangle II', 'Butterfly Dangle', 'Pearl Shell Dangle'][n - 1],
                file: `Silver_Dangling_Deluxe_Charms (${n}).png`
            }))
        },
        {
            name: 'Gold Dangling Deluxe Charms', price: 15.00, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7].map(n => ({
                label: ['Heart Dangle', 'Heart Dangle II', 'Pearl Cluster Dangle', 'Red Heart Cherries Dangle', 'Black Bow Dangle', 'Pastel Butterfly Dangle', 'Red Bow Dangle'][n - 1],
                file: `Gold_Dangling_Deluxe_Charms (${n}).png`
            }))
        }
    ],

    watch: [
        {
            name: 'Silver Watch Charms', price: 45, unit: 'each',
            items: [
                { label: 'Black Square Watch', file: 'Black Square Watch.png' },
                { label: 'White Square Watch', file: 'White Square Watch.png' },
                { label: 'Pink Square Watch', file: 'Pink Square Watch.png', soldOut: true },
                { label: 'Gray Square Watch', file: 'Gray Square Watch.png', soldOut: true },
                { label: 'Oval Silver Watch', file: 'Oval Silver Watch.png' },
                { label: 'Purple Gem Watch', file: 'Purple Gem Watch.png', soldOut: true },
                { label: 'Pink Rectangle Watch', file: 'Pink Rectangle Watch.png', soldOut: true },
                { label: 'Heart Watch', file: 'Heart Watch.png', soldOut: true },
                { label: 'Black Digital Watch', file: 'Black Digital Watch.png' },
                { label: 'Rose Gold Digital Watch', file: 'Rose Gold Digital Watch.png' }
            ]
        },
        {
            name: 'Gold Watch Charms', price: 55, unit: 'each',
            items: [
                { label: 'Heart Gold Watch', file: 'Heart Gold Watch.png', soldOut: true },
                { label: 'Pink Gold Watch', file: 'Pink Gold Watch.png', soldOut: true },
                { label: 'Cream Gold Watch', file: 'Cream Gold Watch.png', soldOut: true },
                { label: 'Oval Gold Watch', file: 'Oval Gold Watch.png' }
            ]
        }
    ],

    keychain: [
        {
            name: 'Keychain Links', price: 12, unit: 'each',
            items: [
                { label: 'Gold Keychain Clip', file: 'Gold Keychain.png' },
                { label: 'Silver Keychain Clip', file: 'Silver Keychain.png', soldOut: true }
            ]
        }
    ],

    bracelets: []
};

const CATEGORY_META = {
    links: {
        title: 'Charm Links',
        blurb: 'Mix, match, and build your own Italian charm bracelet — one link at a time.'
    },
    bracelets: {
        title: 'Bracelets',
        blurb: 'Ready-made bracelet bases to start your charm collection.'
    },
    watch: {
        title: 'Watch Charms',
        blurb: 'Nomination-style watch faces to complete your bracelet.'
    },
    keychain: {
        title: 'Keychains',
        blurb: 'Charm-ready keychain clips.'
    }
};
