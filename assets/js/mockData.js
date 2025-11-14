const sokoniAfricaSettings = {
  profileSettings: {
    profileInfo: [
      ["Profile photo & cover photo", "fi fi-sr-user-circle", "pf101"],
      ["Full name", "fi fi-sr-id-card", "pf102"],
      ["Username", "fi fi-sr-user", "pf103"],
      ["Phone number (OTP verify)", "fi fi-sr-phone", "pf104"],
      ["Email address (verify option)", "fi fi-sr-envelope", "pf105"],
      ["Date of birth", "fi fi-sr-calendar", "pf106"],
      ["Gender (optional)", "fi fi-sr-gender", "pf107"],
      ["Short bio / tagline", "fi fi-sr-text", "pf108"]
    ],
    accountSecurity: [
      ["Change password", "fi fi-sr-lock", "as201"],
      ["Two-Factor Authentication (2FA)", "fi fi-sr-shield-check", "as202"],
      ["Connected accounts", "fi fi-sr-link", "as203"],
      ["Device management", "fi fi-sr-devices", "as204"]
    ],
    addressPreferences: [
      ["Default billing address", "fi fi-sr-wallet", "ap301"],
      ["Default shipping/delivery address", "fi fi-sr-map-pin", "ap302"],
      ["Preferred language", "fi fi-sr-translate", "ap303"],
      ["Preferred currency", "fi fi-sr-coins", "ap304"]
    ],
    dangerZone: [
      ["Deactivate account", "fi fi-sr-exclamation-triangle", "dz401"],
      ["Permanently delete account", "fi fi-sr-trash", "dz402"]
    ]
  },

  generalSettings: {
    notifications: [
      ["Push notifications toggle", "fi fi-sr-bell", "nt501"],
      ["Email alerts toggle", "fi fi-sr-envelope", "nt502"],
      ["SMS alerts toggle", "fi fi-sr-chat-dots", "nt503"],
      ["Marketing & promotions toggle", "fi fi-sr-megaphone", "nt504"]
    ],
    privacy: [
      ["Profile visibility", "fi fi-sr-eye", "pr601"],
      ["Shop visibility", "fi fi-sr-store", "pr602"],
      ["Message permissions", "fi fi-sr-chat", "pr603"]
    ],
    paymentsBilling: [
      ["Add/remove payment methods", "fi fi-sr-credit-card", "pb701"],
      ["Default payment method", "fi fi-sr-star", "pb702"],
      ["Transaction history", "fi fi-sr-receipt", "pb703"],
      ["Subscription plan", "fi fi-sr-crown", "pb704"]
    ],
    userInterface: [
      ["Theme: Light/Dark/Auto", "fi fi-sr-moon-stars", "ui801"],
      ["Layout style: Compact/Spacious", "fi fi-sr-layout-grid", "ui802"],
      ["Font size", "fi fi-sr-text-size", "ui803"],
      ["Product view: Grid/List", "fi fi-sr-layout-list", "ui804"],
      ["Home feed default tab", "fi fi-sr-home", "ui805"],
      ["Language & localization", "fi fi-sr-globe", "ui806"],
      ["Accessibility options", "fi fi-sr-universal-access", "ui807"]
    ],
    appPreferences: [
      ["Data & storage", "fi fi-sr-database", "ap901"],
      ["Default landing page", "fi fi-sr-home-alt", "ap902"],
      ["Auto-update toggle", "fi fi-sr-refresh", "ap903"]
    ],
    helpSupport: [
      ["FAQs", "fi fi-sr-question-circle", "hs1001"],
      ["Contact support", "fi fi-sr-headset", "hs1002"],
      ["Report a problem", "fi fi-sr-flag", "hs1003"],
      ["Terms & Conditions / Privacy Policy", "fi fi-sr-file-contract", "hs1004"]
    ]
  },

  myShopPage: {
    shopInfo: [
      ["Shop name", "fi fi-sr-store", "si1101"],
      ["Logo & banner", "fi fi-sr-image", "si1102"],
      ["Business description", "fi fi-sr-paragraph", "si1103"],
      ["Category / industry", "fi fi-sr-tag", "si1104"],
      ["Business phone & email", "fi fi-sr-phone", "si1105"],
      ["Business address", "fi fi-sr-map-pin", "si1106"],
      ["Working hours", "fi fi-sr-clock", "si1107"]
    ],
    inventoryManagement: [
      ["Add product", "fi fi-sr-plus-circle", "im1201"],
      ["Edit product", "fi fi-sr-edit", "im1202"],
      ["Remove product", "fi fi-sr-trash", "im1203"],
      ["Organize categories & tags", "fi fi-sr-tag", "im1204"],
      ["Bulk upload products", "fi fi-sr-upload", "im1205"]
    ],
    ordersManagement: [
      ["View orders", "fi fi-sr-list", "om1301"],
      ["Order details", "fi fi-sr-info-circle", "om1302"],
      ["Update order status", "fi fi-sr-sync", "om1303"]
    ],
    salesAnalytics: [
      ["Revenue charts", "fi fi-sr-chart-pie", "sa1401"],
      ["Best-selling products", "fi fi-sr-chart-line-up", "sa1402"],
      ["Customer insights", "fi fi-sr-users", "sa1403"]
    ],
    deliveryLogistics: [
      ["Delivery options", "fi fi-sr-truck-side", "dl1501"],
      ["Delivery fee setup", "fi fi-sr-coins", "dl1502"],
      ["Delivery zones", "fi fi-sr-map-marked", "dl1503"]
    ],
    customerEngagement: [
      ["Reviews & ratings", "fi fi-sr-star", "ce1601"],
      ["Discounts & promotions", "fi fi-sr-ticket", "ce1602"],
      ["Featured products", "fi fi-sr-star-half", "ce1603"]
    ],
    productRepostSettings: [
      ["Enable/disable reposting", "fi fi-sr-share", "rs1701"],
      ["Per-product repost commission (%)", "fi fi-sr-percent", "rs1702"],
      ["Default repost commission", "fi fi-sr-cog", "rs1703"],
      ["Max repost commission cap", "fi fi-sr-sliders-h", "rs1704"],
      ["Minimum order value for repost earnings", "fi fi-sr-shopping-cart", "rs1705"],
      ["Reporting panel", "fi fi-sr-chart-bar", "rs1706"],
      ["Auto-payout settings", "fi fi-sr-wallet", "rs1707"]
    ],
    shopSettings: [
      ["Shop visibility", "fi fi-sr-eye", "ss1801"],
      ["Business verification", "fi fi-sr-id-badge", "ss1802"],
      ["Shop suspension/closure", "fi fi-sr-ban", "ss1803"]
    ]
  }
};

// mock data starts here 
// mock data starts here 
// mock data starts here 
// mock data starts here 

const mockChats = [
  {
    name: "Pemba Chakechake",
    img: "assets/images/faces/user0.jfif",
    time: "02:11",
    message: "Please send me the discount coupon so I can...",
    sentByUser: true,
    unread: 0
  },
  {
    name: "Michael howel",
    img: "assets/images/faces/user2.jfif",
    time: "02:11",
    message: "Thanks for your service I recieved the prod...",
    sentByUser: false,
    unread: 2,
    badge: "gold"
  },
  {
    name: "Lilian Mapunda",
    img: "assets/images/faces/user3.jfif",
    time: "01:05",
    message: "Where can I track my delivery?",
    sentByUser: false,
    unread: 1,
    badge: "blue"
  },
  {
    name: "Kevin Juma",
    img: "assets/images/faces/user4.jfif",
    time: "00:44",
    message: "Item was broken. Need a replacement.",
    sentByUser: false,
    unread: 3
  },
  {
    name: "Aisha Nasoro",
    img: "assets/images/faces/user5.jfif",
    time: "Yesterday",
    message: "How long is the warranty period again?",
    sentByUser: true,
    unread: 0,
    badge: "blue"
  },
  {
    name: "Furaha Kassim",
    img: "assets/images/faces/user6.jfif",
    time: "23:15",
    message: "It was nice doing business with you.",
    sentByUser: false,
    unread: 0
  },
  {
    name: "Tariq Saidi",
    img: "assets/images/faces/user7.jfif",
    time: "22:59",
    message: "Still waiting for your confirmation.",
    sentByUser: true,
    unread: 0,
    badge: "gold"
  },
  {
    name: "Winnie Mwita",
    img: "assets/images/faces/user8.jfif",
    time: "21:30",
    message: "Can I change the shipping address?",
    sentByUser: false,
    unread: 4
  },
  {
    name: "Musa Komba",
    img: "assets/images/faces/user9.jfif",
    time: "20:11",
    message: "Received the wrong product. Please assist.",
    sentByUser: false,
    unread: 1,
    badge: "blue"
  },
  {
    name: "Joyce Ndalu",
    img: "assets/images/faces/user10.jfif",
    time: "19:55",
    message: "Your team was very helpful, thanks!",
    sentByUser: false,
    unread: 0
  }
];

const countryCodes = '🇦🇴+244|🇧🇯+229|🇧🇼+267|🇧🇫+226|🇧🇮+257|🇨🇻+238|🇨🇲+237|🇨🇫+236|🇹🇩+235|🇰🇲+269|🇨🇬+242|🇨🇩+243|🇨🇮+225|🇩🇯+253|🇪🇬+20|🇬🇶+240|🇪🇷+291|🇸🇿+268|🇪🇹+251|🇬🇦+241|🇬🇲+220|🇬🇭+233|🇬🇳+224|🇬🇼+245|🇰🇪+254|🇱🇸+266|🇱🇷+231|🇱🇾+218|🇲🇬+261|🇲🇼+265|🇲🇱+223|🇲🇷+222|🇲🇺+230|🇲🇦+212|🇲🇿+258|🇳🇦+264|🇳🇪+227|🇳🇬+234|🇷🇼+250|🇸🇹+239|🇸🇳+221|🇸🇨+248|🇸🇱+232|🇸🇴+252|🇿🇦+27|🇸🇸+211|🇸🇩+249|🇹🇿+255|🇹🇬+228|🇹🇳+216|🇺🇬+256|🇿🇲+260|🇿🇼+263|🇸🇭+290|🇾🇹+262|🇷🇪+262|🇲🇶+596|🇧🇱+590|🇲🇫+590|🇵🇲+508|🇹🇫+262'
const masterCategories = [["Fashion","Mitindo"],["Electronics","Vifaa vya Kielektroniki"],["Home","Nyumbani"],["Automotive","Magari"],["Industrial","Viwandani"],["Healthcare","Afya"],["Agriculture","Kilimo"],["Education","Elimu"],["Travel","Usafiri"],["Business","Biashara"],["Energy","Nishati"],["Food","Chakula"],["Beauty","Urembo"],["Toys","Midoli"],["Sports","Michezo"],["Real Estate","Nyumba"],["Construction","Ujenzi"],["Books","Vitabu"],["Pets","Wanyama wa kufugwa"],["Crafts","Ufundi"]];
const sampleStories = [
    {
        thumbnail: 'assets/images/stories/story0.jfif',
        time: '23-07-2025 13:00',
        location: 'Dodoma, Tanzania',
        profile: {
            username: 'fanevesal',
            photo: 'assets/images/faces/user1.jfif',
            fullname: 'Fanevesal Peter'
        }
    },
    {
        thumbnail: 'assets/images/stories/story1.jfif',
        time: '23-07-2025 2:00',
        location: 'Mbeya, Tanzania',
        profile: {
            username: 'monkingston',
            photo: 'assets/images/faces/user2.jfif',
            fullname: 'Solomon Kingston'
        }
    },
    {
        thumbnail: 'assets/images/stories/story2.jfif',
        time: '23-07-2025 5:00',
        location: 'Dar-es-salaam, Tanzania',
        profile: {
            username: 'pedrickmods',
            photo: 'assets/images/faces/user3.jfif',
            fullname: 'Pedrick Modrich'
        }
    },
    {
        thumbnail: 'assets/images/stories/story3.jfif',
        time: '23-07-2025 13:00',
        location: 'Dodoma, Tanzania',
        profile: {
            username: 'chanflllqw',
            photo: 'assets/images/faces/user0.jfif',
            fullname: 'William Mchanga',
        }
    },
];

const mockPosts = [
  {
    username: "serengeti_safari",
    badge: "gold",
    location: "Serengeti National Park",
    date: "5th March, 2025",
    profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
    postImg: "https://i.pinimg.com/1200x/e2/d9/98/e2d9988ca15856d858cff87a84b8bbc2.jpg"
  },
  {
    username: "zanzibar_vibes",
    badge: "blue",
    location: "Zanzibar, Tanzania",
    date: "22nd February, 2025",
    profilePic: "https://randomuser.me/api/portraits/men/54.jpg",
    postImg: "assets/images/products/pods0.jfif"
  },
  {
    username: "mt_kilimanjaro",
    badge: "",
    location: "Mount Kilimanjaro",
    date: "12th April, 2025",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
    postImg: "assets/images/products/pods1.jfif"
  },
  {
    username: "dodoma_life",
    badge: "gold",
    location: "Dodoma, Tanzania",
    date: "15th January, 2025",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
    postImg: "https://i.pinimg.com/736x/7b/a4/ff/7ba4ff27369e67b0088612e90dcf6cc3.jpg"
  },
  {
    username: "mwanza_sunset",
    badge: "",
    location: "Mwanza, Tanzania",
    date: "28th March, 2025",
    profilePic: "https://randomuser.me/api/portraits/men/76.jpg",
    postImg: "assets/images/products/iphone3.jfif"
  },
  {
    username: "arusha_hiker",
    badge: "blue",
    location: "Arusha, Tanzania",
    date: "8th February, 2025",
    profilePic: "https://randomuser.me/api/portraits/women/21.jpg",
    postImg: "https://i.pinimg.com/736x/c5/38/8c/c5388cd1d304cef57f527c2540067b8f.jpg"
  }
];

const mockTitles = [
  "Wireless Noise-Cancelling Headphones",
  "4K Ultra HD Smart TV",
  "Portable Bluetooth Speaker",
  "Smartphone with AMOLED Display",
  "Laptop with Touchscreen",
  "Ergonomic Office Chair",
  "Gaming Mechanical Keyboard",
  "Wireless Gaming Mouse",
  "Smart Fitness Tracker",
  "Rechargeable Electric Toothbrush",
  "Stainless Steel Water Bottle",
  "Adjustable Standing Desk",
  "Instant Digital Camera",
  "Noise-Isolating Earbuds",
  "Foldable Drone with Camera",
  "LED Desk Lamp",
  "Smart Home Security Camera",
  "Electric Pressure Cooker",
  "Air Purifier with HEPA Filter",
  "Cordless Handheld Vacuum",
  "Smartwatch with GPS",
  "Cast Iron Skillet",
  "Ceramic Nonstick Cookware Set",
  "Kitchen Knife Set",
  "Stainless Steel Cutlery",
  "Nonstick Waffle Maker",
  "French Press Coffee Maker",
  "Espresso Machine",
  "High-Speed Blender",
  "Automatic Bread Maker",
  "Robot Vacuum Cleaner",
  "Luxury Memory Foam Pillow",
  "Weighted Blanket",
  "Cooling Gel Mattress Topper",
  "Silk Bed Sheet Set",
  "Velvet Throw Pillow",
  "Faux Fur Area Rug",
  "Geometric Wall Clock",
  "Abstract Canvas Wall Art",
  "Smart LED Light Bulb",
  "Waterproof Bluetooth Shower Speaker",
  "Hair Dryer with Ionic Technology",
  "Ceramic Hair Straightener",
  "Curling Wand with Adjustable Heat",
  "Beard Grooming Kit",
  "Facial Steamer",
  "Anti-Aging Face Serum",
  "Vitamin C Moisturizer",
  "Organic Aloe Vera Gel",
  "Sunscreen SPF 50",
  "Waterproof Action Camera",
  "Foldable Camping Chair",
  "Insulated Hiking Backpack",
  "Sleeping Bag for All Seasons",
  "Portable Camping Stove",
  "Trekking Poles",
  "LED Headlamp",
  "Mountain Bike Helmet",
  "Skateboard with LED Wheels",
  "Electric Scooter",
  "Inflatable Paddle Board",
  "Yoga Mat with Alignment Lines",
  "Adjustable Dumbbell Set",
  "Resistance Band Kit",
  "Foam Roller",
  "Punching Bag with Stand",
  "Boxing Gloves",
  "Golf Club Set",
  "Tennis Racket",
  "Tabletop Air Hockey Game",
  "VR Headset",
  "Racing Simulation Wheel",
  "Drone Racing Kit",
  "3D Printing Pen",
  "Smart Thermostat",
  "Wi-Fi Range Extender",
  "External SSD Drive",
  "Portable Power Bank",
  "Wireless Charging Pad",
  "USB-C Hub Adapter",
  "Noise-Cancelling Microphone",
  "Studio Ring Light",
  "Portable Green Screen",
  "Video Streaming Stick",
  "Smart Door Lock",
  "Digital Kitchen Scale",
  "Reusable Silicone Food Bags",
  "Stainless Steel Lunch Box",
  "Bamboo Cutting Board",
  "Glass Food Storage Set",
  "Electric Wine Opener",
  "Ice Cream Maker",
  "Mini Projector",
  "Home Theater Soundbar",
  "Compact Dishwasher",
  "Portable Washing Machine",
  "Air Fryer with Digital Display",
  "Dehumidifier for Small Rooms",
  "Pet Hair Remover Brush",
  "Cat Tree with Scratching Posts",
  "Automatic Pet Feeder",
  "Aquarium LED Lighting"
];