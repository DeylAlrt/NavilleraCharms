const CATALOGUE = {
    links: [
        {
            name: 'Plain Charms — Silver', price: 1.50, unit: 'each link',
            items: [{ label: 'Silver', file: 'Plain Links/Silver_Plain_Charm.png' }]
        },
        {
            name: 'Plain Charms — Colors', price: 2.50, unit: 'each link', sortItems: true,
            items: ['Gold', 'Red', 'Blue', 'Dark Blue', 'Black', 'Brown', 'Purple', 'Pink', 'Dark Pink', 'Green'].map(color => ({
                label: color,
                file: `Plain Links/${color.replace(' ', '')}_Plain_Charm.png`
            }))
        },
        {
            name: 'Concave Links', price: 3.00, unit: 'each link', sortItems: true,
            items: [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
                label: ['Star', 'Butterfly', 'Sparkle', 'Flower', 'Heart', 'Heart Outline', 'Paw', 'Double Heart'][n - 1],
                file: `Concave Links/Concave_Silver_Links (${n}).png`
            })),
            gold: {
                name: 'Gold Concave Links', price: 3.50,
                items: [1, 2].map(n => ({
                    label: ['Star', 'Butterfly' ][n - 1],
                    file: `Concave Links/Concave_Gold_Links (${n}).png`
                }))
            }
        },
        {
            name: 'Gold Outline Links', price: 4.00, unit: 'each link', sortItems: true,
                    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({
                        label: ['Heart', 'Double Heart', 'Star', 'Flower', 'Paw', 'Butterfly', 'Heart Outline', 'Sun', 'Cupid', 'Hello-Kitty'][n - 1],
                        file: `Golden Outline Links/Gold_Outline_Links (${n}).png`
                    }))
        },
        {
            name: 'Colored Links', price: 4.50, unit: 'each link', sortItems: true,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(n => ({
                label: ['Red Heart', 'Pink Heart', 'Black Heart', 'Purple Heart', 'Double Pink Heart',
                     'Double Black Heart', 'Red Star', 'Red Butterfly', 'Pink Butterfly', 'Strawberry', 'Yin-Yang', 'Double Grey Heart',
                      'Black Star', 'Cherry',][n - 1],
                file: `Colored Links/Colored_Silver_Links (${n}).png`
            })),
            gold: {
                name: 'Gold Colored Links', price: 5.00, unit: 'each link',
                items: [1, 2].map(n => ({
                    label: ['Cherry', 'Strawberry'][n - 1],
                    file: `Colored Links/Colored_Gold_Links (${n}).png`
                }))
            }
        },
        {
            name: 'Letter Links', price: 3.50, unit: 'each link',
            items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => ({
                label: letter,
                file: i === 0 ? 'Letter Links/letter_Letters Silver (1).png' : `Letter Links/Letters Silver (${i + 1}).png`
            })),
            gold: {
                name: 'Gold Letter Links', price: 4.50,
                items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => ({
                    label: letter,
                    file: i === 0 ? 'Letter Links/letter_Letters Gold (1).png' : `Letter Links/Letters Gold (${i + 1}).png`
                }))
            }
        },
        {
            name: 'Number Links', price: 3.50, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({
                label: String(n - 1),
                file: n === 10 ? 'Number Links/number_number_Number.png' : `Number Links/Number (${n}).png`
            })),
            gold: {
                name: 'Gold Number Links', price: 4.50,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({
                    label: String(n - 1),
                    file: `Number Links/Gold_Number (${n}).png`
                }))
            }
        },
        {
            name: 'Characters', price: 8.99, unit: 'each link',
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(n => ({
                label: ['Blossom', 'Bubbles', 'Buttercup', 'My Melody', 'Cinnamoroll', 'Cinnamoroll II', 'Hello Kitty', 'Spider-Kitty', 'Kuromi', 'Pompompurin',
                     'Kirby', 'Badtz-Maru', 'Snoopy', 'Snoopy II', 'Captain America', 'Hulk', 'Spider-Man', 'Venom',
                      'Groot', 'Doctor Strange', 'Iron-Man', 'Spider-Man Logo', 'Bulbasaur', 'Cubone', 'Pokemon',][n - 1],
                file: `Character Links/Character_Premium_Charms  (${n}).png`,
                soldOut: [2].includes(n)
            }))
        },

        {
            name: 'Animals', price: 8.99, unit: 'each link', sortItems: true,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({
                label: ['Frog', 'Golden Retriever', 'Pug', 'Cat', 'Maltese', 'French Bulldog', 'Husky', 'Shiba', 'Paw'][n - 1],
                file: `Animal Links/Animal_Premium_Links (${n}).png`
            })),
            gold: {
                name: 'Gold Animals', price: 9.99,
                items: [11, 12, 13, 14].map((n, i) => ({
                    label: ['Cat', 'Black Cat', 'Strawberry Cake Cat', 'Butterfly'][i],
                    file: `Animal Links/Animal_Premium_Links (${n}).png`
                }))
            }
        },

         {
            name: 'Cars', price: 8.99, unit: 'each link', sortItems: true,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({
                label: ['Car', 'BMW', 'Mercedes', 'Lamborghini', 'Ferrari', 'Porsche', 'BMW Pink', 'Mercedes Pink',
                     'Ferrari Pink', 'Mercedes Pink'][n - 1],
                file: `Car Links/Cars_Premium_Charms (${n}).png`
            }))
        },

         {
            name: 'Sports', price: 8.99, unit: 'each link', sortItems: true,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => ({
                label: ['Volleyball', 'Basketball', 'Football', 'Paris Saint-Germain', 'Inter Milan', 'Real Madrid',
                     'Manchester United', 'FC Barcelona', 'FC Bayern München', 'Juventus', 'AC Milan'][n - 1],
                file: `Sport Links/Sports_Premium_Charms (${n}).png`
            }))
        },

        {
            name: 'Premium Charms', price: 8.99, unit: 'each link',
            items: [
                'Lavender Clover Gem', 'Red Clover', 'Black Clover', 'Lavender Clover', 'Pearl Clover', 'Pink Clover',
                'Pearl Clover Gem', 'Pink Clover Gem', 'Pink Flower', 'Lavender Flower', 'Cream Flower', 'White Flower',
                'Green & Purple Gummy Bears', 'Blue & Red Gummy Bears', 'Black Bow', 'Pink Layered Heart', 'Red Heart Gem', 'Playing Card Suits',
                'Pink Telephone', 'Heart Card', 'Black & White Checkered', 'Vintage Camera', 'Heart Sunglasses', '8 Ball',
                'Pink Checkered', 'Piano Keys', 'Blue Star Sunburst', 'Moon Sunburst', 'Diamond Checkered', 'Blue Stars',
                'Crescent Moon & Star', 'Racing Flags', 'Shit Happens', 'I Lost My Mind', 'I Love You', 'I Love My Boyfriend',
                'I Love My Girlfriend', 'Sexy', 'Crazy', 'Barbie', 'Anti Social', 'Spiderweb',
                'Black Bat', 'Black Spider', 'Dragon Tail', 'Dragon Body', 'Dragon Head'
            ].map((label, i) => ({ label, file: `Premium Links/Premium_Silver_Links (${i + 1}).png` })),
            gold: {
                name: 'Gold Premium Charms', price: 9.99,
                items: [
                    'Lavender Clover Gem', 'Red Clover', 'Black Clover', 'Lavender Clover', 'Pearl Clover', 'Pearl Clover Gem',
                    'Pink Clover Gem', 'Black Clover Gem', 'Green Striped Clover Gem', 'Music Hearts', 'Crystal Gem', 'Crystal Paw I',
                    'Crystal Butterfly I', 'Strawberry', 'Daisy I', 'Daisy II', 'Boba', 'Boys Lie',
                    'Route 66', 'Cherries', 'Crystal Butterfly II', 'Crystal Flower Bud', 'Crystal Paw II', 'Pink Heart Gem',
                    'Heart Lock', 'Butterfly Outline', 'Dice', 'Pink Bow', 'Sexy', 'Crazy'
                ].map((label, i) => ({ label, file: `Premium Links/Premium_Gold_Links (${i + 1}).png` }))
            }
        },
        {
            name: 'Flags', price: 8.00, unit: 'each link', sortItems: true,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => ({
                label: ['Philippines', 'Netherlands', 'South Korea', 'India', 'Egypt', 'Czech Republic', 'UAE', 'Pakistan', 'United Kingdom', 'Palestine', 'Italy'][n - 1],
                file: `Flag Links/Flags (${n}).png`
            }))
        },
        {
            name: 'Dangling Links', price: 14.99, unit: 'each link', sortItems: true,
            items: [1, 2].map(n => ({
                label: ['Pearl Shell Dangle', 'Butterfly Dangle'][n - 1],
                file: `Dangling Links/Dangling_Silver_Links (${n}).png`
            })),
            gold: {
                name: 'Gold Dangling Links', price: 15.99,
                items: [1, 2, 3, 4, 5].map(n => ({
                    label: ['Red Bow Dangle', 'Crystal Leaf Dangle', 'Red Heart Cherries Dangle', 'Black Bow Dangle', 'Pastel Butterfly Dangle'][n - 1],
                    file: `Dangling Links/Dangling_Gold_Links (${n}).png`
                }))
            }
        },
        {
            name: 'Magnet Hearts', price: 12.50, unit: 'each link',
            items: [1, 2].map(n => ({
                label: ['Magnet Heart I', 'Magnet Heart II'][n - 1],
                file: `Magnet Hearts/Silver_Dangling_Deluxe_Charms (${n}).png`
            })),
            gold: {
                name: 'Gold Magnet Hearts', price: 12.50,
                items: [1, 2].map(n => ({
                    label: ['Magnet Heart I', 'Magnet Heart II'][n - 1],
                    file: `Magnet Hearts/Gold_Dangling_Deluxe_Charms (${n}).png`
                }))
            }
        }
    ],

    watch: [
        {
            name: 'Watch Charms', price: 65.50, unit: 'each', sortItems: true,
            items: [
                { label: 'Black Square Watch', file: 'Watches/Black Square Watch.png' },
                { label: 'White Square Watch', file: 'Watches/White Square Watch.png' },
                { label: 'Pink Square Watch', file: 'Watches/Pink Square Watch.png', soldOut: true },
                { label: 'Gray Square Watch', file: 'Watches/Gray Square Watch.png', soldOut: true },
                { label: 'Oval Silver Watch', file: 'Watches/Oval Silver Watch.png' },
                { label: 'Purple Gem Watch', file: 'Watches/Purple Gem Watch.png', soldOut: true },
                { label: 'Pink Rectangle Watch', file: 'Watches/Pink Rectangle Watch.png', soldOut: true },
                { label: 'Heart Watch', file: 'Watches/Heart Watch.png', soldOut: true },
                { label: 'Black Digital Watch', file: 'Watches/Black Digital Watch.png' },
                { label: 'Rose Gold Digital Watch', file: 'Watches/Rose Gold Digital Watch.png' }
            ],
            gold: {
                name: 'Gold Watch Charms', price: 55.50,
                items: [
                    { label: 'Heart Gold Watch', file: 'Watches/Heart Gold Watch.png', soldOut: true },
                    { label: 'Pink Gold Watch', file: 'Watches/Pink Gold Watch.png', soldOut: true },
                    { label: 'Cream Gold Watch', file: 'Watches/Cream Gold Watch.png', soldOut: true },
                    { label: 'Oval Gold Watch', file: 'Watches/Oval Gold Watch.png' }
                ]
            }
        },
        {
            name: 'Apple Watch Connectors — 38/40/41mm', price: 30.00, unit: 'each pair',
            items: [
                { label: 'Silver Connector', file: 'Apple Connector/Silver_Connector.png', soldOut: true },
                { label: 'Gold Connector', file: 'Apple Connector/Gold_Connector.png', soldOut: true }
            ]
        },
        {
            name: 'Apple Watch Connectors — 44/45/46mm', price: 32.00, unit: 'each pair',
            items: [
                { label: 'Silver Connector', file: 'Apple Connector/Silver_Connector.png' },
                { label: 'Gold Connector', file: 'Apple Connector/Gold_Connector.png' }
            ]
        }
    ],

    keychain: [
        {
            name: 'Keychain Links', price: 10, unit: 'each',
            items: [
                { label: 'Gold Keychain Clip', file: 'Keychains/Gold Keychain.png' },
                { label: 'Silver Keychain Clip', file: 'Keychains/Silver Keychain.png', soldOut: true }
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
