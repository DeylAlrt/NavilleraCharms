/* ==============================================================
   Catalougue Edits

   QUICK EDITS
   • Sold out      → type the charm's name in  soldOut: ['Frog', 'Pug']
   • Price         → change  price: 8.99
   • New charm     → add its name at the END of  items
                     (its picture is the next number, e.g. (10).png)

   SECTION SETTINGS
   • picture   Where the pictures are, in the Charm Builder's public/charms.
               {n} = the charm's place in the list (1st, 2nd, 3rd...)
               {name} = the charm's name
   • startAt   Number of the first picture, if it isn't 1
   • skip      Picture numbers that don't exist, e.g. skip: [12]
   • oddPictures   Pictures that don't follow the pattern
   • sortAZ    true = shown A–Z on the website
   • unit      Text after the price (default: 'each link')
   • gold      Adds the Silver/Gold button. The gold price is the
               same as silver unless it has its own price.
   ============================================================== */

const SHOP = {
    /* ======================= CHARM LINKS ======================= */
    links: [
        {
            name: 'Plain Charms — Silver', price: 1.50,
            picture: 'Plain Links/{name}_Plain_Charm.png',
            items: ['Silver'],
            soldOut: [],
        },
        {
            name: 'Plain Charms — Colors', price: 2.50, sortAZ: true,
            picture: 'Plain Links/{name}_Plain_Charm.png',
            oddPictures: { 'Dark Blue': 'Plain Links/DarkBlue_Plain_Charm.png', 'Dark Pink': 'Plain Links/DarkPink_Plain_Charm.png' },
            items: ['Concave','Gold', 'Red', 'Blue', 'Dark Blue', 'Black', 'Brown', 'Purple', 'Pink', 'Dark Pink', 'Green'],
            soldOut: [],
        },
        {
            name: 'Concave Links', price: 3.00, sortAZ: true,
            picture: 'Concave Links/Concave_Silver_Links ({n}).png',
            items: ['Star', 'Butterfly', 'Sparkle', 'Flower', 'Heart', 'Heart Outline', 'Paw', 'Double Heart'],
            soldOut: [],
            gold: {
                price: 3.50,
                picture: 'Concave Links/Concave_Gold_Links ({n}).png',
                items: ['Star', 'Butterfly'],
                soldOut: [],
            },
        },
        {
            name: 'Letter Links', price: 3.50,
            picture: 'Letter Links/Letters Silver ({n}).png',
            oddPictures: { 'A': 'Letter Links/letter_Letters Silver (1).png' },
            items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            soldOut: ['A'],
            gold: {
                price: 4.50,
                picture: 'Letter Links/Letters Gold ({n}).png',
                oddPictures: { 'A': 'Letter Links/letter_Letters Gold (1).png' },
                items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                soldOut: ['A'],
            },
        },
        {
            name: 'Number Links', price: 3.50,
            picture: 'Number Links/Number ({n}).png',
            oddPictures: { '9': 'Number Links/number_number_Number.png' },
            items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            soldOut: [],
            gold: {
                price: 4.50,
                picture: 'Number Links/Gold_Number ({n}).png',
                items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                soldOut: [],
            },
        },
        {
            name: 'Gold Outline Links', price: 4.00, sortAZ: true,
            picture: 'Golden Outline Links/Gold_Outline_Links ({n}).png',
            items: ['Heart', 'Double Heart', 'Star', 'Flower', 'Paw', 'Butterfly', 'Heart Outline', 'Sun', 'Cupid', 'Hello-Kitty'],
            soldOut: [],
        },
        {
            name: 'Colored Links', price: 4.50, sortAZ: true,
            picture: 'Colored Links/Colored_Silver_Links ({n}).png',
            items: ['Red Heart', 'Pink Heart', 'Black Heart', 'Purple Heart', 'Double Pink Heart', 'Double Black Heart', 'Red Star',
                    'Red Butterfly', 'Pink Butterfly', 'Strawberry', 'Yin-Yang', 'Double Grey Heart', 'Black Star', 'Cherry'],
            soldOut: [],
            gold: {
                price: 5.00,
                picture: 'Colored Links/Colored_Gold_Links ({n}).png',
                items: ['Cherry', 'Strawberry'],
                soldOut: [],
            },
        },
        {
            name: 'Flags', price: 8.99, sortAZ: true,
            picture: 'Flag Links/Flags ({n}).png',
            items: ['Philippines', 'Netherlands', 'South Korea', 'India', 'Egypt', 'Czech Republic',
                    'UAE', 'Pakistan', 'United Kingdom', 'Palestine', 'Italy'],
            soldOut: ['Czech Republic'],
        },
        {
            name: 'Characters', price: 8.99,
            picture: 'Character Links/Character_Premium_Charms  ({n}).png',
            items: ['Blossom', 'Bubbles', 'Buttercup', 'My Melody', 'Cinnamoroll', 'Cinnamoroll II', 'Hello Kitty',
                    'Spider-Kitty', 'Kuromi', 'Pompompurin', 'Kirby', 'Badtz-Maru', 'Snoopy', 'Snoopy II',
                    'Captain America', 'Hulk', 'Spider-Man', 'Venom', 'Groot', 'Doctor Strange', 'Iron-Man',
                    'Spider-Man Logo', 'Bulbasaur', 'Cubone', 'Pokemon'],
            soldOut: ['Bubbles', 'Buttercup', 'Cinnamoroll II', 'Hello Kitty', 'Spider-Kitty'],
        },
        {
            name: 'Animals', price: 8.99, sortAZ: true,
            picture: 'Animal Links/Animal_Premium_Links ({n}).png',
            items: ['Frog', 'Golden Retriever', 'Pug', 'Cat', 'Maltese', 'French Bulldog', 'Husky', 'Shiba', 'Paw'],
            soldOut: ['French Bulldog'],
            gold: {
                price: 9.99,
                picture: 'Animal Links/Animal_Premium_Links ({n}).png', startAt: 11,
                items: ['Cat', 'Black Cat', 'Strawberry Cake Cat', 'Butterfly'],
                soldOut: [],
            },
        },
        {
            name: 'Cars', price: 8.99, sortAZ: true,
            picture: 'Car Links/Cars_Premium_Charms ({n}).png',
            items: ['Car', 'BMW', 'Mercedes', 'Lamborghini', 'Ferrari', 'Porsche', 'BMW Pink', 'Mercedes Pink', 'Ferrari Pink', 'Porsche Pink'],
            soldOut: [],
        },
        {
            name: 'Sports', price: 8.99, sortAZ: true,
            picture: 'Sport Links/Sports_Premium_Charms ({n}).png',
            items: ['Volleyball', 'Basketball', 'Football', 'Paris Saint-Germain', 'Inter Milan', 'Real Madrid',
                    'Manchester United', 'FC Barcelona', 'FC Bayern München', 'Juventus', 'AC Milan'],
            soldOut: ['FC Barcelona'],
        },
        {
            name: 'Premium Charms', price: 8.99,
            picture: 'Premium Links/Premium_Silver_Links ({n}).png',
            items: ['Lavender Clover Gem', 'Red Clover', 'Black Clover', 'Lavender Clover', 'Pearl Clover', 'Pink Clover',
                    'Pearl Clover Gem', 'Pink Clover Gem', 'Pink Flower', 'Lavender Flower', 'Cream Flower', 'White Flower',
                    'Green & Purple Gummy Bears', 'Blue & Red Gummy Bears', 'Black Bow', 'Pink Layered Heart', 'Red Heart Gem',
                    'Playing Card Suits', 'Pink Telephone', 'Heart Card', 'Black & White Checkered', 'Vintage Camera',
                    'Heart Sunglasses', '8 Ball', 'Pink Checkered', 'Piano Keys', 'Blue Star Sunburst', 'Moon Sunburst',
                    'Diamond Checkered', 'Blue Stars', 'Crescent Moon & Star', 'Racing Flags', 'Shit Happens', 'I Lost My Mind',
                    'I Love You', 'I Love My Boyfriend', 'I Love My Girlfriend', 'Sexy', 'Crazy', 'Barbie', 'Anti Social',
                    'Spiderweb', 'Black Bat', 'Black Spider', 'Dragon Tail', 'Dragon Body', 'Dragon Head'],
            soldOut: ['Pink Flower', 'Lavender Flower', 'Cream Flower', 'White Flower', 'Pink Checkered', 'Piano Keys',
                      'Blue Star Sunburst', 'Moon Sunburst', 'Diamond Checkered', 'Blue Stars', 'Crescent Moon & Star',
                      'Racing Flags', 'Barbie', 'Anti Social', 'Spiderweb', 'Black Bat', 'Black Spider'],
            gold: {
                price: 9.99,
                picture: 'Premium Links/Premium_Gold_Links ({n}).png',
                items: ['Lavender Clover Gem', 'Red Clover', 'Black Clover', 'Lavender Clover', 'Pearl Clover', 'Pearl Clover Gem',
                        'Pink Clover Gem', 'Black Clover Gem', 'Green Striped Clover Gem', 'Music Hearts', 'Crystal Gem',
                        'Crystal Paw I', 'Crystal Butterfly I', 'Strawberry', 'Daisy I', 'Daisy II', 'Boba', 'Boys Lie',
                        'Route 66', 'Cherries', 'Crystal Butterfly II', 'Crystal Flower Bud', 'Crystal Paw II',
                        'Pink Heart Gem', 'Heart Lock', 'Butterfly Outline', 'Dice', 'Pink Bow', 'Sexy', 'Crazy'],
                soldOut: [],
            },
        },
        {
            name: 'Magnet Hearts', price: 12.50,
            picture: 'Magnet Hearts/Silver_Dangling_Deluxe_Charms  ({n}).png', // two spaces before ( — matches the file names
            items: ['Magnet Heart I', 'Magnet Heart II'],
            soldOut: [],
            gold: {
                picture: 'Magnet Hearts/Gold_Dangling_Deluxe_Charms ({n}).png',
                items: ['Magnet Heart I', 'Magnet Heart II'],
                soldOut: [],
            },
        },
        {
            name: 'Dangling Links', price: 14.99, sortAZ: true,
            picture: 'Dangling Links/Dangling_Silver_Links ({n}).png',
            skip: [12],   // picture 12 (Crystal Bow Drop) moved to gold as Dangling_Gold_Links (30)
            items: ['Sparkle Chain', 'Angel Wings Purple Drop', 'Pink Star Coral', 'Pearl Bow Chain', 'Moon Pearl', 'Crystal Bow Pearls',
                    'Twin Stars', 'Crystal Butterfly Star', 'Pearl Bow', 'Green Flower Pearls', 'Crystal Heart Pearl',
                    'Crystal Safety Pin', 'Heart Lock', 'Airplane', 'Crystal Butterfly Outline', 'Bow Outline', 'Ribbon Bow',
                    'Jellyfish', 'Opal Planet', 'Opal Butterfly', 'Blue Star Moon', 'Moon & Stars', 'Lavender Crystal Butterfly',
                    'Pink Paw', 'Pink Crystal Bow', 'Pink Sparkle Star', 'Eiffel Tower', 'Pink Moon', 'Pink Sakura',
                    'Pink Star Gem', 'Pink Planet Heart', 'Pink Butterfly', 'Pink Cherries', 'Pink Crystal Heart',
                    'Pearl Shell', 'Butterfly'],
            soldOut: ['Pearl Shell', 'Butterfly'],
            gold: {
                price: 15.99,
                picture: 'Dangling Links/Dangling_Gold_Links ({n}).png', startAt: 5,   // pictures 2–5 don't exist
                oddPictures: { 'Pink Heart Wings': 'Dangling Links/Dangling_Gold_Links (1).png' },
                items: ['Pink Heart Wings', 'Crystal Butterfly Pearl', 'Twin Crystal Hearts', 'Pink Heart Drop', 'Heart Pearl',
                        'Crystal Safety Pin', 'Sparkle Star', 'Paw', 'Bow', 'Airplane', 'Crystal Fish', 'Textured Bow',
                        'Blue Jellyfish', 'Pink Jellyfish', 'Lavender Flower', 'Pink Flower', 'Blue Flower', 'Red Flower',
                        'Pink Heart Crown', 'Starfish', 'Crystal Leaf', 'Red Heart Cherries', 'Black Bow', 'Pastel Butterfly', 'Red Bow',
                        'Crystal Bow Drop'],
                soldOut: ['Black Bow', 'Crystal Leaf', 'Pastel Butterfly', 'Red Bow', 'Red Heart Cherries'],
            },
        },
        {
            name: 'Twin Chain Links', price: 20.00, unit: 'each',
            picture: 'Chain Links/Chain_Silver_Links ({n}).png',
            items: ['Planet & Star', 'Bow & Key', 'Star & Moon', 'Bow & Butterfly', 'Planet & Mermaid Tail', 'Pink Paw & Star'],
            soldOut: [],
        },
    ],

    /* ======================= WATCH CHARMS ====================== */
    watch: [
        {
            name: 'Apple Watch Connectors — 38/40/41mm', price: 30.00, unit: 'each pair',
            oddPictures: { 'Silver Connector': 'Apple Connector/Silver_Connector.png', 'Gold Connector': 'Apple Connector/Gold_Connector.png' },
            items: ['Silver Connector', 'Gold Connector'],
            soldOut: ['Silver Connector', 'Gold Connector'],
        },
        {
            name: 'Apple Watch Connectors — 44/45/46mm', price: 32.00, unit: 'each pair',
            oddPictures: { 'Silver Connector': 'Apple Connector/Silver_Connector.png', 'Gold Connector': 'Apple Connector/Gold_Connector.png' },
            items: ['Silver Connector', 'Gold Connector'],
            soldOut: [],
        },
        {
            name: 'Watch Charms', price: 55.50, unit: 'each', sortAZ: true,
            picture: 'Watches/{name}.png',
            items: ['White Square Watch', 'Heart Watch', 'Rose Gold Digital Watch'],
            soldOut: ['White Square Watch'],
            gold: {
                price: 65.50,
                picture: 'Watches/{name}.png',
                items: ['Oval Gold Watch'],
                soldOut: [],
            },
        },
    ],

    /* ======================== KEYCHAINS ======================== */
    keychain: [
        {
            name: 'Keychain Links', price: 10.00, unit: 'each',
            oddPictures: { 'Gold Keychain Link': 'Keychains/Gold Keychain.png', 'Silver Keychain Link': 'Keychains/Silver Keychain.png' },
            items: ['Gold Keychain Link', 'Silver Keychain Link'],
            soldOut: [],
        },
    ],

    /* ======================== BRACELETS ======================== */
    bracelets: [],
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
        blurb: 'Charm-ready keychain links.'
    }
};

function buildItems(list, sectionName) {
    const soldOut = list.soldOut || [];
    soldOut.filter(name => !list.items.includes(name)).forEach(name => {
        console.warn(`[catalogue] "${name}" is in soldOut but not in the items of "${sectionName}" — check the spelling.`);
    });

    // Picture numbers count up from startAt, jumping over any numbers in `skip`
    const skip = list.skip || [];
    let n = (list.startAt || 1) - 1;
    const nextNumber = () => { do { n++; } while (skip.includes(n)); return n; };

    return list.items.map(label => {
        const number = nextNumber();
        return {
            label,
            file: (list.oddPictures && list.oddPictures[label]) ||
                  list.picture.replace('{n}', number).replace('{name}', label),
            soldOut: soldOut.includes(label),
        };
    });
}

const CATALOGUE = Object.fromEntries(Object.entries(SHOP).map(([category, sections]) => [
    category,
    sections.map(s => ({
        name: s.name,
        price: s.price,
        unit: s.unit || 'each link',
        sortItems: !!s.sortAZ,
        items: buildItems(s, s.name),
        gold: s.gold && {
            name: s.gold.name || `Gold ${s.name}`,
            price: s.gold.price ?? s.price,
            items: buildItems(s.gold, `Gold ${s.name}`),
        },
    })),
]));
