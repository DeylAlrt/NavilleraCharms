function letterLinkItems(material) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => {
        const n = i + 1;
        const file = n === 1
            ? `letter_Letters ${material} (1).png`
            : `Letters ${material} (${n}).png`;
        return { label: letter, file };
    });
}

function numberLinkItems(material = 'Silver') {
    const items = [];
    for (let n = 1; n <= 9; n++) {
        const file = material === 'Gold'
            ? `Gold_Number (${n}).png`
            : `Number (${n}).png`;
        items.push({ label: String(n - 1), file });
    }
    items.push({
        label: '9',
        file: material === 'Gold' ? 'Gold_Number (10).png' : 'number_number_Number.png'
    });
    return items;
}

const CATALOGUE = {
    links: [
        {
            name: 'Plain Charms — Silver', price: 1.00, unit: 'each link',
            items: [{ label: 'Silver', file: 'Silver_Plain_Charm.png' }]
        },
        {
            name: 'Plain Charms — Colors', price: 2.50, unit: 'each link',
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
            name: 'Silver Number Links', price: 3.00, unit: 'each link',
            items: numberLinkItems()
        },
        {
            name: 'Gold Letter Links', price: 3.50, unit: 'each link',
            items: letterLinkItems('Gold')
        },
        {
            name: 'Gold Number Links', price: 3.50, unit: 'each link',
            items: numberLinkItems('Gold')
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
            name: 'Characters', price: 8.99, unit: 'each link',
            items: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(n => ({
                label: ['Blossom', 'Bubbles', 'Buttercup', '', '', 'Hello Kitty', 'Spider-Kitty', 'Cinnamoroll', 'My Melody', 'Kuromi', 'Cinnamoroll II', 'Pompompurin',
                     'Kirby', 'Badtz-Maru', 'Snoopy', 'Iron-Man', 'Captain America', 'Hulk', 'Spider-Man', 'Venom', 'Spider-Man Logo'][n - 1],
                file: `Character_Premium_Charms (${n}).png`,
                soldOut: [2].includes(n)
            }))
        },

        {
            name: 'Animals', price: 8.99, unit: 'each link',
            items: [1, 2, 4, 5, 6, 7, 8].map(n => ({
                label: ['Frog', 'Cat I', '', 'Maltese', 'French Bulldog', 'Husky', 'Corgi', 'Bunny'][n - 1],
                file: `Animal_Premium_Charms (${n}).png`
            }))
        },

         {
            name: 'Cars', price: 8.99, unit: 'each link',
            items: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12].map(n => ({
                label: ['Car', 'BMW', 'Mercedes', '', 'Lamborghini', 'Ferrari', 'Porsche', 'Rolls-Royce', 'BMW Pink',
                     'Mercedes Pink', 'Ferrari Pink', 'Porche Pink'][n - 1],
                file: `Cars_Premium_Charms (${n}).png`
            }))
        },

         {
            name: 'Sports', price: 8.99, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => ({
                label: ['Volleyball', 'Basketball', 'Football', 'Paris Saint-Germain', 'Inter Milan', 'Real Madrid',
                     'Manchester United', 'FC Barcelona', 'FC Bayern München', 'Juventus', 'AC Milan'][n - 1],
                file: `Sports_Premium_Charms (${n}).png`
            }))
        },

        {
            name: 'Premium Charms', price: 8.99, unit: 'each link',
            items: [
                [48, 'Glitter Heart'], [49, 'Anti Social'], [50, 'Spiderweb'], [51, 'Vintage Camera'], [67, 'Racing Flags'],
            ].map(([n, label]) => ({ label, file: `Premium Charms (${n}).png` }))
        },
        {
            name: 'Flags', price: 8.00, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => ({
                label: ['Philippines', 'Netherlands', 'South Korea', 'India', 'Egypt', 'Czech Republic', 'UAE', 'Pakistan', 'United Kingdom', 'Palestine', 'Italy'][n - 1],
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
        blurb: 'Charm-ready watch faces to complete your bracelet.'
    },
    keychain: {
        title: 'Keychains',
        blurb: 'Charm-ready keychain clips.'
    }
};
