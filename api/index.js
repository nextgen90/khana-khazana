var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// backend/vercelHandler.ts
var vercelHandler_exports = {};
__export(vercelHandler_exports, {
  default: () => handler
});
module.exports = __toCommonJS(vercelHandler_exports);

// backend/app.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);

// backend/engine/data.ts
var INITIAL_TABLES = [
  {
    id: "T1",
    label: "T1 \xB7 Golden Bay Window",
    capacity: 2,
    zone: "Window",
    isAccessible: false,
    isVipBooth: false,
    combinableWith: null,
    status: "Occupied",
    currentCourse: "Mains",
    elapsedMins: 34,
    assignedPartyId: "S-01",
    assignedPartyName: "Rao Couple",
    assignedPartySize: 2,
    activeBookingId: "KK-7401",
    gridCol: 0,
    gridRow: 0
  },
  {
    id: "T2",
    label: "T2 \xB7 Brass Hearth Two-Top",
    capacity: 2,
    zone: "Main Hall",
    isAccessible: true,
    isVipBooth: false,
    combinableWith: null,
    status: "Dirty",
    currentCourse: "None",
    elapsedMins: 0,
    assignedPartyId: null,
    assignedPartyName: null,
    assignedPartySize: null,
    activeBookingId: null,
    gridCol: 1,
    gridRow: 0
  },
  {
    id: "T3",
    label: "T3 \xB7 Lotus West",
    capacity: 4,
    zone: "Main Hall",
    isAccessible: true,
    isVipBooth: false,
    combinableWith: "T4",
    status: "Free",
    currentCourse: "None",
    elapsedMins: 0,
    assignedPartyId: null,
    assignedPartyName: null,
    assignedPartySize: null,
    activeBookingId: "KK-8942",
    gridCol: 2,
    gridRow: 0
  },
  {
    id: "T4",
    label: "T4 \xB7 Lotus East",
    capacity: 4,
    zone: "Main Hall",
    isAccessible: true,
    isVipBooth: false,
    combinableWith: "T3",
    status: "Free",
    currentCourse: "None",
    elapsedMins: 0,
    assignedPartyId: null,
    assignedPartyName: null,
    assignedPartySize: null,
    activeBookingId: null,
    gridCol: 3,
    gridRow: 0
  },
  {
    id: "T5",
    label: "T5 \xB7 Skyline Window North",
    capacity: 4,
    zone: "Window",
    isAccessible: false,
    isVipBooth: false,
    combinableWith: "T6",
    status: "Paying",
    currentCourse: "Billing",
    elapsedMins: 52,
    assignedPartyId: "S-02",
    assignedPartyName: "Mehta Quartet",
    assignedPartySize: 4,
    activeBookingId: "KK-7512",
    gridCol: 0,
    gridRow: 1
  },
  {
    id: "T6",
    label: "T6 \xB7 Skyline Window South",
    capacity: 4,
    zone: "Window",
    isAccessible: false,
    isVipBooth: false,
    combinableWith: "T5",
    status: "Occupied",
    currentCourse: "Dessert",
    elapsedMins: 44,
    assignedPartyId: "S-03",
    assignedPartyName: "Sen Family",
    assignedPartySize: 3,
    activeBookingId: "KK-7618",
    gridCol: 1,
    gridRow: 1
  },
  {
    id: "T7",
    label: "T7 \xB7 Saffron Corner",
    capacity: 2,
    zone: "Window",
    isAccessible: true,
    isVipBooth: false,
    combinableWith: null,
    status: "Free",
    currentCourse: "None",
    elapsedMins: 0,
    assignedPartyId: null,
    assignedPartyName: null,
    assignedPartySize: null,
    activeBookingId: null,
    gridCol: 2,
    gridRow: 1
  },
  {
    id: "T8",
    label: "T8 \xB7 Imperial Velvet Salon",
    capacity: 6,
    zone: "VIP Lounge",
    isAccessible: false,
    isVipBooth: true,
    combinableWith: "T9",
    status: "Free",
    currentCourse: "None",
    elapsedMins: 0,
    assignedPartyId: null,
    assignedPartyName: null,
    assignedPartySize: null,
    activeBookingId: null,
    gridCol: 3,
    gridRow: 1
  },
  {
    id: "T9",
    label: "T9 \xB7 Sovereign Suite",
    capacity: 4,
    zone: "VIP Lounge",
    isAccessible: true,
    isVipBooth: true,
    combinableWith: "T8",
    status: "Occupied",
    currentCourse: "Appetizer",
    elapsedMins: 14,
    assignedPartyId: "S-04",
    assignedPartyName: "Vikramaditya Party",
    assignedPartySize: 4,
    activeBookingId: "KK-7904",
    gridCol: 0,
    gridRow: 2
  },
  {
    id: "T10",
    label: "T10 \xB7 Heritage Chef Table",
    capacity: 6,
    zone: "Main Hall",
    isAccessible: true,
    isVipBooth: true,
    combinableWith: null,
    status: "Paying",
    currentCourse: "Billing",
    elapsedMins: 58,
    assignedPartyId: "S-05",
    assignedPartyName: "Chatterjee Guests",
    assignedPartySize: 5,
    activeBookingId: "KK-8010",
    gridCol: 1,
    gridRow: 2
  }
];
var INITIAL_QUEUE = [
  {
    id: "P-101",
    name: "Dr. Sharma Group",
    size: 4,
    isVip: false,
    needsWheelchair: true,
    preferredZone: "Main Hall",
    dietaryNotes: "Step-free table requested",
    waitMins: 6,
    status: "WAITING",
    bookingId: "KK-8942"
  },
  {
    id: "P-102",
    name: "Verma VIP Celebration",
    size: 6,
    isVip: true,
    needsWheelchair: false,
    preferredZone: "VIP Lounge",
    dietaryNotes: "Anniversary tasting",
    waitMins: 12,
    status: "WAITING",
    bookingId: "KK-8955"
  },
  {
    id: "P-103",
    name: "Aarav & Meera",
    size: 2,
    isVip: false,
    needsWheelchair: false,
    preferredZone: "Window",
    dietaryNotes: "Window evening seating",
    waitMins: 4,
    status: "WAITING",
    bookingId: "KK-8961"
  },
  {
    id: "P-104",
    name: "Kulkarni Family Eight",
    size: 7,
    isVip: false,
    needsWheelchair: true,
    preferredZone: "Main Hall",
    dietaryNotes: "Jain options requested",
    waitMins: 8,
    status: "WAITING",
    bookingId: "KK-8970"
  }
];
var INITIAL_RESERVATIONS = [
  {
    bookingId: "KK-8942",
    guestName: "Dr. Sharma Group",
    email: "sharma.family@example.com",
    phone: "+91 98201 44120",
    dateTime: "2026-11-14T20:00",
    partySize: 4,
    preferredZone: "Main Hall",
    needsWheelchair: true,
    isVip: false,
    specialRequests: "Wheelchair-friendly Main Hall dining",
    status: "CONFIRMED",
    assignedTableIds: ["T3"],
    qrPassCode: "KK-QR-T3-8942",
    triggeredRules: ["R1: Accessible Filter (isAccessible == true)", "Zone Match: Main Hall"],
    bayesianConfidencePct: 100,
    fScore: 0,
    createdAt: "19:42:10"
  },
  {
    bookingId: "KK-8955",
    guestName: "Verma VIP Celebration",
    email: "verma.vip@example.com",
    phone: "+91 98112 77319",
    dateTime: "2026-11-14T20:15",
    partySize: 6,
    preferredZone: "VIP Lounge",
    needsWheelchair: false,
    isVip: true,
    specialRequests: "Anniversary saffron welcome",
    status: "CONFIRMED",
    assignedTableIds: ["T8"],
    qrPassCode: "KK-QR-T8-8955",
    triggeredRules: ["Zone Match: VIP Lounge", "R3: VIP Wait > 10m \u2192 Saffron Amuse-Bouche"],
    bayesianConfidencePct: 100,
    fScore: 0.5,
    createdAt: "19:50:22"
  }
];
var INITIAL_INGREDIENTS = [
  {
    id: "ing-truffle",
    name: "Black Truffle Shavings",
    unit: "g",
    stock: 90,
    parLevel: 120,
    perOrderHighlight: "15g per Truffle Paneer Tikka"
  },
  {
    id: "ing-paneer",
    name: "Fresh Malai Paneer",
    unit: "g",
    stock: 2400,
    parLevel: 3e3,
    perOrderHighlight: "220g per Paneer dish"
  },
  {
    id: "ing-saffron",
    name: "Kashmiri Saffron Strands",
    unit: "mg",
    stock: 800,
    parLevel: 1e3,
    perOrderHighlight: "80mg per Biryani / Dessert"
  },
  {
    id: "ing-lentils",
    name: "24-Hour Simmered Black Lentils",
    unit: "g",
    stock: 3200,
    parLevel: 4e3,
    perOrderHighlight: "260g per Dal Makhani"
  },
  {
    id: "ing-gf-penne",
    name: "Artisan Gluten-Free Rice Penne",
    unit: "g",
    stock: 1100,
    parLevel: 1500,
    perOrderHighlight: "180g per Penne dish"
  },
  {
    id: "ing-basmati",
    name: "Aged Royal Basmati Rice",
    unit: "g",
    stock: 4e3,
    parLevel: 5e3,
    perOrderHighlight: "280g per Saffron Biryani"
  },
  {
    id: "ing-mozzarella",
    name: "Buffalo Mozzarella & San Marzano",
    unit: "g",
    stock: 1800,
    parLevel: 2400,
    perOrderHighlight: "200g per Stone Pizza"
  },
  {
    id: "ing-khoya",
    name: "Cardamom Khoya Dumplings",
    unit: "pcs",
    stock: 48,
    parLevel: 60,
    perOrderHighlight: "4 pcs per Gulab Jamun"
  }
];
var MENU_DISHES = [
  {
    id: "dish-truffle-paneer",
    name: "Truffle Paneer Tikka",
    category: "Signature Starters",
    description: "Char-grilled artisanal cottage cheese marinated in smoked yogurt, Kashmiri chili, and fresh black truffle shavings.",
    price: 540,
    prepMins: 14,
    dietaryTags: ["Veg", "Chef Signature", "Gluten-Free"],
    isVeg: true,
    image: "/images/food_paneer_naan_1794676918929.jpg",
    recipe: [
      { ingredientId: "ing-truffle", amount: 15 },
      { ingredientId: "ing-paneer", amount: 220 }
    ],
    substituteDishIds: ["dish-dal-makhani", "dish-margherita"]
  },
  {
    id: "dish-dal-makhani",
    name: "24-Hour Smoked Dal Makhani",
    category: "Royal Mains",
    description: "Slow-simmered black urad lentils finished with churned white butter, heirloom tomato puree, and organic cream.",
    price: 420,
    prepMins: 12,
    dietaryTags: ["Veg", "House Classic"],
    isVeg: true,
    image: "/images/culinary_heritage_plating_1794675538229.jpg",
    recipe: [{ ingredientId: "ing-lentils", amount: 260 }],
    substituteDishIds: ["dish-truffle-paneer", "dish-saffron-biryani"]
  },
  {
    id: "dish-saffron-biryani",
    name: "Royal Saffron Dum Biryani",
    category: "Royal Mains",
    description: "Sealed brass-handi aged basmati rice layered with aromatic spices, caramelized shallots, and Kashmiri saffron.",
    price: 490,
    prepMins: 18,
    dietaryTags: ["Gluten-Free", "Chef Signature"],
    isVeg: false,
    image: "/images/food_dum_biryani_1794676920335.jpg",
    recipe: [
      { ingredientId: "ing-basmati", amount: 280 },
      { ingredientId: "ing-saffron", amount: 80 }
    ],
    substituteDishIds: ["dish-chicken-paratha", "dish-dal-makhani"]
  },
  {
    id: "dish-gf-penne",
    name: "Gluten-Free Masala Penne",
    category: "Artisan & Global",
    description: "Al dente rice-quinoa penne tossed in velvety roasted tomato-makhani emulsion, basil, and aged parmesan.",
    price: 450,
    prepMins: 14,
    dietaryTags: ["Veg", "Gluten-Free"],
    isVeg: true,
    image: "/images/food_artisan_pizza_1794676918698.jpg",
    recipe: [
      { ingredientId: "ing-gf-penne", amount: 180 },
      { ingredientId: "ing-mozzarella", amount: 120 }
    ],
    substituteDishIds: ["dish-margherita", "dish-dal-makhani"]
  },
  {
    id: "dish-chicken-paratha",
    name: "Homestyle Chicken & Flaky Paratha",
    category: "Royal Mains",
    description: "Slow-braised spiced chicken masala paired with hand-layered golden butter parathas straight from the tawa.",
    price: 470,
    prepMins: 16,
    dietaryTags: ["Non-Veg", "House Favorite"],
    isVeg: false,
    image: "/images/food_chicken_paratha_1794676918657.jpg",
    recipe: [{ ingredientId: "ing-basmati", amount: 120 }],
    substituteDishIds: ["dish-saffron-biryani", "dish-dal-makhani"]
  },
  {
    id: "dish-margherita",
    name: "Wood-Fired Burrata Margherita",
    category: "Artisan & Global",
    description: "Stone-baked sourdough crust topped with San Marzano tomatoes, fresh buffalo mozzarella, and garden basil.",
    price: 430,
    prepMins: 11,
    dietaryTags: ["Veg", "Stone-Baked"],
    isVeg: true,
    image: "/images/food_artisan_pizza_1794676918698.jpg",
    recipe: [{ ingredientId: "ing-mozzarella", amount: 200 }],
    substituteDishIds: ["dish-gf-penne", "dish-truffle-paneer"]
  },
  {
    id: "dish-gulab-jamun",
    name: "Warm Saffron & Pistachio Gulab Jamun",
    category: "Desserts",
    description: "Melt-in-the-mouth golden khoya dumplings steeped in warm cardamom-saffron syrup.",
    price: 220,
    prepMins: 8,
    dietaryTags: ["Veg", "Sweet Classic"],
    isVeg: true,
    image: "/images/food_gulab_jamun_1794676919306.jpg",
    recipe: [
      { ingredientId: "ing-khoya", amount: 4 },
      { ingredientId: "ing-saffron", amount: 40 }
    ],
    substituteDishIds: ["dish-dal-makhani", "dish-margherita"]
  }
];
var INITIAL_ORDERS = [
  {
    orderId: "ORD-301",
    tableId: "T1",
    bookingId: "KK-7401",
    items: [
      {
        dishId: "dish-dal-makhani",
        name: "24-Hour Smoked Dal Makhani",
        quantity: 1,
        price: 420
      },
      {
        dishId: "dish-saffron-biryani",
        name: "Royal Saffron Dum Biryani",
        quantity: 1,
        price: 490
      }
    ],
    totalAmount: 910,
    prepTimeMins: 18,
    status: "Preparing",
    dispatchedAgentId: "W2",
    createdAt: "20:10:15"
  }
];
var INITIAL_WAITERS = [
  {
    id: "W1",
    name: "W1 \xB7 Arjun",
    role: "Waiter (Utility-Based)",
    zone: "Main Hall",
    currentAction: "ClearTable",
    targetTableId: "T2",
    energyPct: 86,
    utilityScore: 0.92,
    utilityBreakdown: {
      urgency: 0.98,
      vipBonus: 0.1,
      distancePenalty: 0.02,
      loadPenalty: 0.14,
      totalUtility: 0.92
    },
    tasksCompleted: 14
  },
  {
    id: "W2",
    name: "W2 \xB7 Kavya",
    role: "Waiter (Utility-Based)",
    zone: "Window",
    currentAction: "ServeOrder",
    targetTableId: "T1",
    energyPct: 81,
    utilityScore: 0.89,
    utilityBreakdown: {
      urgency: 0.88,
      vipBonus: 0.15,
      distancePenalty: 0.02,
      loadPenalty: 0.12,
      totalUtility: 0.89
    },
    tasksCompleted: 11
  },
  {
    id: "W3",
    name: "W3 \xB7 Rohan",
    role: "Waiter (Utility-Based)",
    zone: "VIP Lounge",
    currentAction: "ServeOrder",
    targetTableId: "T9",
    energyPct: 90,
    utilityScore: 0.85,
    utilityBreakdown: {
      urgency: 0.72,
      vipBonus: 0.25,
      distancePenalty: 0.02,
      loadPenalty: 0.1,
      totalUtility: 0.85
    },
    tasksCompleted: 9
  },
  {
    id: "Host-01",
    name: "Host-01 \xB7 Concierge",
    role: "Host (Goal-Based)",
    zone: "Main Hall",
    currentAction: "DispatchAStar",
    targetTableId: "T3",
    energyPct: 97,
    utilityScore: 0.96,
    utilityBreakdown: {
      urgency: 0.9,
      vipBonus: 0.12,
      distancePenalty: 0.03,
      loadPenalty: 0.03,
      totalUtility: 0.96
    },
    tasksCompleted: 22
  }
];
var INITIAL_AGENT_EVENTS = [
  {
    id: "evt-1",
    tick: 0,
    timestamp: "20:14:02",
    agentId: "Host-01",
    agentName: "Host-01 \xB7 Concierge",
    agentType: "Host (Goal-Based)",
    utilityScore: 0.96,
    targetTableId: "T3",
    message: "Host-01 locked KK-8942 (Dr. Sharma Group, step-free Main Hall) for Table T3 via Rule R1."
  },
  {
    id: "evt-2",
    tick: 0,
    timestamp: "20:14:05",
    agentId: "W1",
    agentName: "W1 \xB7 Arjun",
    agentType: "Waiter (Utility-Based)",
    utilityScore: 0.92,
    targetTableId: "T2",
    message: "W1 Arjun selected ClearTable on T2 (Urgency 0.98 \u2212 Dist 0.02 \u2212 Load 0.14 = 0.92 utility)."
  },
  {
    id: "evt-3",
    tick: 0,
    timestamp: "20:14:08",
    agentId: "W2",
    agentName: "W2 \xB7 Kavya",
    agentType: "Waiter (Utility-Based)",
    utilityScore: 0.89,
    targetTableId: "T1",
    message: "W2 Kavya dispatched kitchen order ORD-301 (Dal Makhani + Saffron Biryani) to Table T1."
  }
];
var INITIAL_XAI_LOGS = [
  {
    id: "xai-1",
    timestamp: "20:12:44",
    partyName: "Vikramaditya Party",
    partySize: 4,
    assignedTables: ["T9"],
    algorithm: "A* Search + Rule R1",
    fScore: 0.5,
    bayesianProb: 1,
    rulesApplied: ["Zone Match: VIP Lounge", "R1: Accessible Verified"],
    justification: "Assigned T9 (Sovereign Suite, 4 seats) with 0 wasted seats and VIP booth affinity bonus (-0.5)."
  },
  {
    id: "xai-2",
    timestamp: "20:08:19",
    partyName: "Chatterjee Guests",
    partySize: 5,
    assignedTables: ["T10"],
    algorithm: "A* Search",
    fScore: 1,
    bayesianProb: 1,
    rulesApplied: ["R1: Accessible Filter", "Zone Match: Main Hall"],
    justification: "Selected single 6-top T10 over merging T3+T4 (saving 2 seats waste and avoiding 3.5 merge penalty)."
  }
];
var SIGNATURE_MENU_KNOWLEDGE_BASE = [
  {
    name: "Paneer Butter Masala with Butter Naan",
    price: 420,
    allergens: ["Dairy", "Gluten", "Cashews"],
    nutFree: false,
    glutenFree: false
  },
  {
    name: "Spiced Chicken with Flaky Malabar Paratha",
    price: 480,
    allergens: ["Gluten", "Dairy"],
    nutFree: true,
    glutenFree: false
  },
  {
    name: "Wood-Fired Truffle & Burrata Pizza",
    price: 590,
    allergens: ["Gluten", "Dairy"],
    nutFree: true,
    glutenFree: false
  },
  {
    name: "Warm Saffron & Pistachio Gulab Jamun",
    price: 240,
    allergens: ["Dairy", "Pistachio", "Gluten"],
    nutFree: false,
    glutenFree: false
  },
  {
    name: "Royal Zafrani Dum Biryani",
    price: 510,
    allergens: ["Dairy"],
    nutFree: true,
    glutenFree: true
  },
  {
    name: "Truffle Paneer Tikka",
    price: 540,
    allergens: ["Dairy"],
    nutFree: true,
    glutenFree: true
  },
  {
    name: "24-Hour Smoked Dal Makhani",
    price: 420,
    allergens: ["Dairy"],
    nutFree: true,
    glutenFree: true
  },
  {
    name: "Gluten-Free Masala Penne",
    price: 450,
    allergens: ["Dairy"],
    nutFree: true,
    glutenFree: true
  }
];
var RESTAURANT_POLICIES_CHUNKS = [
  {
    id: "POL-01",
    section: "Operating Hours, Zones & Wheelchair Accessibility (Rule R1)",
    sourceFile: "restaurant_policies.md",
    content: "Open daily 11:30 AM \u2013 11:30 PM (kitchen closes 11:00 PM) across Main Hall, Window View, and VIP Lounge. Tables T2 (Main Hall, 2 seats), T3 & T4 (Main Hall, 4 seats each), T7 (Window, 2 seats), T9 (VIP Lounge, 4 seats), and T10 (Main Hall, 6 seats) provide step-free wheelchair access.",
    keywords: ["wheelchair", "accessible", "step-free", "r1", "hours", "open", "zones"]
  },
  {
    id: "POL-02",
    section: "VIP & Fairness Policy (Rule R3 / R4)",
    sourceFile: "restaurant_policies.md",
    content: "VIP guests waiting >= 10 minutes receive complimentary Saffron Masala Papad & Welcome Drink (Saffron Amuse-Bouche). Fairness Guardrail: VIP reservations never bump wheelchair bookings or regular guests waiting > 20 minutes.",
    keywords: ["vip", "wait", "complimentary", "papad", "fairness", "r3", "r4", "10 minutes"]
  },
  {
    id: "POL-03",
    section: "Combinable Table Architecture (Rule R2 / R3 Merge)",
    sourceFile: "restaurant_policies.md",
    content: "Adjacent wheelchair-accessible tables T3 and T4 in the Main Hall combine dynamically (up to 8 seats; ideal for wheelchair parties of 5\u20138 if 6-top T10 is occupied). Pairs T5 + T6 (Window, 8 seats) and T8 + T9 (VIP Lounge, 10 seats) also merge for larger groups.",
    keywords: ["combine", "merge", "large", "group", "party", "t3", "t4", "5", "6", "7", "8", "9", "10"]
  },
  {
    id: "POL-04",
    section: "Signature Menu & Verified Allergens",
    sourceFile: "restaurant_policies.md",
    content: "Signature dishes & allergens: Paneer Butter Masala with Butter Naan (\u20B9420 \u2014 Dairy, Gluten, Cashews), Spiced Chicken with Flaky Malabar Paratha (\u20B9480 \u2014 Gluten, Dairy \xB7 Nut-Free), Wood-Fired Truffle & Burrata Pizza (\u20B9590 \u2014 Gluten, Dairy \xB7 Nut-Free), Warm Saffron & Pistachio Gulab Jamun (\u20B9240 \u2014 Dairy, Pistachio, Gluten), Royal Zafrani Dum Biryani (\u20B9510 \u2014 Dairy \xB7 Nut-Free, GF), Truffle Paneer Tikka (\u20B9540 \u2014 Dairy \xB7 Nut-Free, GF), 24-Hour Smoked Dal Makhani (\u20B9420 \u2014 Dairy \xB7 Nut-Free, GF), Gluten-Free Masala Penne (\u20B9450 \u2014 Dairy \xB7 Nut-Free, GF).",
    keywords: ["menu", "food", "dish", "nut-free", "nut", "cashew", "pistachio", "gluten", "allergen", "biryani", "paneer", "pizza", "dal"]
  },
  {
    id: "POL-05",
    section: "Facility Grounding & Hallucination Boundaries",
    sourceFile: "restaurant_policies.md",
    content: "Khana-Khazana operates strictly as an indoor fine-dining restaurant with Main Hall, Window View, and VIP Lounge seating. We do NOT have a rooftop pool, swimming pool, spa, hotel rooms, helipad, or casino.",
    keywords: ["policy", "facility", "zone", "hall", "lounge", "window", "pool"]
  }
];
var RESTAURANT_POLICIES = {
  brandName: "Khana-Khazana",
  tagline: "Where Culinary Heritage Meets Autonomous Intelligence.",
  hours: "Open Daily, 11:30 AM \u2013 11:30 PM (Kitchen closes at 11:00 PM)",
  zones: ["Main Hall", "Window View", "VIP Lounge"],
  wheelchairPolicy: RESTAURANT_POLICIES_CHUNKS[0].content,
  vipPolicy: RESTAURANT_POLICIES_CHUNKS[1].content,
  combinableTables: RESTAURANT_POLICIES_CHUNKS[2].content,
  culinaryMenu: RESTAURANT_POLICIES_CHUNKS[3].content,
  boundaries: RESTAURANT_POLICIES_CHUNKS[4].content
};

// backend/engine/aiEngine.ts
var PRIOR_FREE_10 = 0.35;
var STAGE_LIKELIHOODS = {
  None: { pStageGivenFree: 0.99, pStageGivenNotFree: 0.01 },
  Appetizer: { pStageGivenFree: 0.04, pStageGivenNotFree: 0.42 },
  Mains: { pStageGivenFree: 0.14, pStageGivenNotFree: 0.38 },
  Dessert: { pStageGivenFree: 0.48, pStageGivenNotFree: 0.16 },
  Billing: { pStageGivenFree: 0.88, pStageGivenNotFree: 0.06 }
};
function computeBayesianTurnoverProb(status, course, elapsedMins = 0) {
  if (status === "Free") return 1;
  if (status === "Dirty") return 0.96;
  const likelihood = STAGE_LIKELIHOODS[course] ?? STAGE_LIKELIHOODS.Mains;
  const num = likelihood.pStageGivenFree * PRIOR_FREE_10;
  const den = num + likelihood.pStageGivenNotFree * (1 - PRIOR_FREE_10);
  const posterior = den === 0 ? 0 : num / den;
  const timeBonus = Math.min(0.12, Math.max(0, (elapsedMins - 30) * 4e-3));
  return Number(Math.min(0.98, Math.max(0.03, posterior + timeBonus)).toFixed(4));
}
function generateCandidateConfigs(tables, party) {
  const candidates = [];
  const eligibleTables = party.needsWheelchair ? tables.filter((t) => t.isAccessible) : tables;
  for (const t of eligibleTables) {
    if (t.capacity >= party.size) {
      if (t.status === "Free") {
        candidates.push({
          tableIds: [t.id],
          capacity: t.capacity,
          isMerged: false,
          isBayesianPreAllocation: false,
          bayesianProb: 1,
          expectedWaitMins: 0,
          matchesZone: party.preferredZone === "ANY" || t.zone === party.preferredZone,
          matchesVipBooth: !party.isVip || t.isVipBooth
        });
      } else if (t.status === "Dirty") {
        candidates.push({
          tableIds: [t.id],
          capacity: t.capacity,
          isMerged: false,
          isBayesianPreAllocation: false,
          bayesianProb: 0.96,
          expectedWaitMins: 3,
          matchesZone: party.preferredZone === "ANY" || t.zone === party.preferredZone,
          matchesVipBooth: !party.isVip || t.isVipBooth
        });
      } else if (t.status === "Paying") {
        const prob = computeBayesianTurnoverProb(
          t.status,
          t.currentCourse,
          t.elapsedMins
        );
        if (prob >= 0.75) {
          candidates.push({
            tableIds: [t.id],
            capacity: t.capacity,
            isMerged: false,
            isBayesianPreAllocation: true,
            bayesianProb: prob,
            expectedWaitMins: Math.max(4, Math.round((1 - prob) * 35)),
            matchesZone: party.preferredZone === "ANY" || t.zone === party.preferredZone,
            matchesVipBooth: !party.isVip || t.isVipBooth
          });
        }
      }
    }
  }
  const seenPairs = /* @__PURE__ */ new Set();
  for (const t1 of eligibleTables) {
    if (!t1.combinableWith) continue;
    const t2 = eligibleTables.find((t) => t.id === t1.combinableWith);
    if (!t2) continue;
    const pairKey = [t1.id, t2.id].sort().join("+");
    if (seenPairs.has(pairKey)) continue;
    seenPairs.add(pairKey);
    const combinedCap = t1.capacity + t2.capacity;
    if (combinedCap < party.size) continue;
    const bothFree = t1.status === "Free" && t2.status === "Free";
    const readySoon = (t1.status === "Free" || t1.status === "Dirty" || t1.status === "Paying") && (t2.status === "Free" || t2.status === "Dirty" || t2.status === "Paying");
    if (bothFree || readySoon) {
      const bayesianTriggered = t1.status === "Paying" || t2.status === "Paying";
      const prob = bothFree ? 1 : Math.min(
        computeBayesianTurnoverProb(t1.status, t1.currentCourse, t1.elapsedMins),
        computeBayesianTurnoverProb(t2.status, t2.currentCourse, t2.elapsedMins)
      );
      if (!bayesianTriggered || prob >= 0.75) {
        candidates.push({
          tableIds: [t1.id, t2.id].sort(),
          capacity: combinedCap,
          isMerged: true,
          isBayesianPreAllocation: bayesianTriggered,
          bayesianProb: Number(prob.toFixed(4)),
          expectedWaitMins: bothFree ? 1 : bayesianTriggered ? 6 : 4,
          matchesZone: party.preferredZone === "ANY" || t1.zone === party.preferredZone,
          matchesVipBooth: !party.isVip || t1.isVipBooth || t2.isVipBooth
        });
      }
    }
  }
  return candidates;
}
function runAStarAllocation(tables, party, remainingQueueCount = 0, weights = { w1Waste: 1, w2Wait: 1 }) {
  const triggeredRules = [];
  if (party.needsWheelchair) {
    triggeredRules.push("R1: Accessible Filter (isAccessible == true)");
  }
  if (party.isVip && party.waitMins > 10) {
    triggeredRules.push("R3: VIP Wait > 10m \u2192 Complimentary Saffron Starter");
  }
  const candidates = generateCandidateConfigs(tables, party);
  if (candidates.length === 0) {
    const gScore = Number(((party.waitMins + 15) * weights.w2Wait).toFixed(2));
    const hScore = Number((2 * (remainingQueueCount + 1)).toFixed(2));
    return {
      success: false,
      party,
      assignedTableIds: [],
      isMerged: false,
      isBayesianPreAllocation: false,
      totalCapacity: 0,
      wastedSeats: 0,
      gScore,
      hScore,
      fScore: Number((gScore + hScore).toFixed(2)),
      bayesianProb: 0,
      triggeredRules,
      explanation: `No Free or \u226575% Bayesian table currently matches party of ${party.size}${party.needsWheelchair ? " with wheelchair access" : ""}. Party stays prioritized in queue.`,
      complimentaryStarterTriggered: party.isVip && party.waitMins > 10
    };
  }
  const scored = candidates.map((c) => {
    const wastedSeats = c.capacity - party.size;
    const mergePenalty = c.isMerged ? party.size > 4 ? 0.5 : 3.5 : 0;
    const zonePenalty = c.matchesZone ? 0 : 1.5;
    const vipBoothBonus = party.isVip && c.matchesVipBooth ? -0.5 : 0;
    const gScore = Number(
      (c.expectedWaitMins * weights.w2Wait + mergePenalty + zonePenalty + vipBoothBonus).toFixed(2)
    );
    const hScore = Number(
      (wastedSeats * weights.w1Waste + 2 * Math.max(0, remainingQueueCount)).toFixed(2)
    );
    const fScore = Number((gScore + hScore).toFixed(2));
    return { candidate: c, wastedSeats, gScore, hScore, fScore };
  });
  scored.sort((a, b) => a.fScore - b.fScore || a.wastedSeats - b.wastedSeats);
  const best = scored[0];
  if (best.candidate.isMerged) {
    triggeredRules.push(
      `R2: Adjacent Merge (${best.candidate.tableIds.join(" + ")})`
    );
  }
  if (best.candidate.isBayesianPreAllocation) {
    triggeredRules.push(
      `Bayes Pre-Alloc: P(Free\u2081\u2080 | Billing) = ${Math.round(
        best.candidate.bayesianProb * 100
      )}% \u2265 75%`
    );
  }
  if (best.candidate.matchesZone && party.preferredZone !== "ANY") {
    triggeredRules.push(`Zone Match: ${party.preferredZone}`);
  }
  const tableStr = best.candidate.tableIds.join(" + ");
  const explanation = best.candidate.isBayesianPreAllocation ? `Pre-allocated ${tableStr} via Bayesian Turnover (${Math.round(
    best.candidate.bayesianProb * 100
  )}% chance free \u2264 10m). f(n) = ${best.fScore} with ${best.wastedSeats} wasted seat${best.wastedSeats === 1 ? "" : "s"}.` : `Assigned ${tableStr} (${best.candidate.capacity} seats) for party of ${party.size}. Minimizes f(n) = g(${best.gScore}) + h(${best.hScore}) = ${best.fScore} with ${best.wastedSeats} wasted seat${best.wastedSeats === 1 ? "" : "s"}.`;
  return {
    success: true,
    party,
    assignedTableIds: best.candidate.tableIds,
    isMerged: best.candidate.isMerged,
    isBayesianPreAllocation: best.candidate.isBayesianPreAllocation,
    totalCapacity: best.candidate.capacity,
    wastedSeats: best.wastedSeats,
    gScore: best.gScore,
    hScore: best.hScore,
    fScore: best.fScore,
    bayesianProb: best.candidate.bayesianProb,
    triggeredRules,
    explanation,
    complimentaryStarterTriggered: party.isVip && party.waitMins > 10
  };
}
function zoneDistance(fromZone, toZone) {
  if (fromZone === toZone) return 0.02;
  if (fromZone === "Main Hall" || toZone === "Main Hall") return 0.1;
  return 0.18;
}
function stepMultiAgentSimulation(tables, queue, waiters, tickCount) {
  const nextTick = tickCount + 1;
  const nextTables = tables.map((t) => ({ ...t }));
  const nextQueue = queue.map(
    (p) => p.status === "WAITING" ? { ...p, waitMins: p.waitMins + 1 } : { ...p }
  );
  const nextWaiters = waiters.map((w) => ({ ...w }));
  const newEvents = [];
  const now = /* @__PURE__ */ new Date();
  const baseTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  for (const table of nextTables) {
    if (table.status === "Occupied") {
      table.elapsedMins += 4;
      if (table.currentCourse === "Appetizer" && table.elapsedMins >= 18) {
        table.currentCourse = "Mains";
      } else if (table.currentCourse === "Mains" && table.elapsedMins >= 40) {
        table.currentCourse = "Dessert";
      } else if (table.currentCourse === "Dessert" && table.elapsedMins >= 52) {
        table.status = "Paying";
        table.currentCourse = "Billing";
      }
    } else if (table.status === "Paying") {
      table.elapsedMins += 4;
      if (table.elapsedMins >= 60) {
        table.status = "Dirty";
        table.currentCourse = "None";
        table.assignedPartyId = null;
        table.assignedPartyName = null;
        table.assignedPartySize = null;
      }
    }
  }
  const assignedTargets = /* @__PURE__ */ new Set();
  for (const waiter of nextWaiters) {
    if (waiter.role === "Host (Goal-Based)") continue;
    let bestTable = null;
    let bestAction = "Standby";
    let bestBreakdown = {
      urgency: 0,
      vipBonus: 0,
      distancePenalty: 0,
      loadPenalty: 0,
      totalUtility: 0
    };
    for (const table of nextTables) {
      if (assignedTargets.has(table.id)) continue;
      let urgency = 0;
      let action = "Standby";
      if (table.status === "Dirty") {
        urgency = 0.96;
        action = "ClearTable";
      } else if (table.status === "Paying") {
        urgency = 0.86;
        action = "DeliverBill";
      } else if (table.status === "Occupied") {
        urgency = table.currentCourse === "Appetizer" ? 0.72 : 0.6;
        action = "ServeOrder";
      }
      if (action === "Standby") continue;
      const vipBonus = table.isVipBooth ? 0.16 : 0.06;
      const distPenalty = zoneDistance(waiter.zone, table.zone);
      const loadPenalty = Number(((100 - waiter.energyPct) * 4e-3).toFixed(2));
      const totalUtility = Number(
        Math.min(
          0.99,
          Math.max(0.25, urgency + vipBonus - distPenalty - loadPenalty)
        ).toFixed(2)
      );
      if (totalUtility > bestBreakdown.totalUtility) {
        bestTable = table;
        bestAction = action;
        bestBreakdown = {
          urgency,
          vipBonus,
          distancePenalty: distPenalty,
          loadPenalty,
          totalUtility
        };
      }
    }
    if (bestTable) {
      assignedTargets.add(bestTable.id);
      waiter.currentAction = bestAction;
      waiter.targetTableId = bestTable.id;
      waiter.utilityScore = bestBreakdown.totalUtility;
      waiter.utilityBreakdown = bestBreakdown;
      waiter.tasksCompleted += 1;
      waiter.energyPct = Math.max(62, waiter.energyPct - 1);
      if (bestAction === "ClearTable") {
        bestTable.status = "Free";
        bestTable.currentCourse = "None";
        bestTable.elapsedMins = 0;
        newEvents.push({
          id: `evt-${nextTick}-${waiter.id}`,
          tick: nextTick,
          timestamp: baseTime,
          agentId: waiter.id,
          agentName: waiter.name,
          agentType: "Waiter (Utility-Based)",
          utilityScore: bestBreakdown.totalUtility,
          targetTableId: bestTable.id,
          message: `${waiter.name} utility ${bestBreakdown.totalUtility} \u2192 Cleared ${bestTable.id} (${bestTable.zone}) to Free status.`
        });
      } else if (bestAction === "DeliverBill") {
        newEvents.push({
          id: `evt-${nextTick}-${waiter.id}`,
          tick: nextTick,
          timestamp: baseTime,
          agentId: waiter.id,
          agentName: waiter.name,
          agentType: "Waiter (Utility-Based)",
          utilityScore: bestBreakdown.totalUtility,
          targetTableId: bestTable.id,
          message: `${waiter.name} utility ${bestBreakdown.totalUtility} \u2192 Settling ${bestTable.id} (Bayes P(Free\u2081\u2080)=${Math.round(
            computeBayesianTurnoverProb(
              bestTable.status,
              bestTable.currentCourse,
              bestTable.elapsedMins
            ) * 100
          )}%).`
        });
      } else {
        newEvents.push({
          id: `evt-${nextTick}-${waiter.id}`,
          tick: nextTick,
          timestamp: baseTime,
          agentId: waiter.id,
          agentName: waiter.name,
          agentType: "Waiter (Utility-Based)",
          utilityScore: bestBreakdown.totalUtility,
          targetTableId: bestTable.id,
          message: `${waiter.name} utility ${bestBreakdown.totalUtility} \u2192 Course pacing (${bestTable.currentCourse}) at ${bestTable.id}.`
        });
      }
    }
  }
  const hostAgent = nextWaiters.find((w) => w.role === "Host (Goal-Based)");
  const waiting = nextQueue.filter((p) => p.status === "WAITING");
  if (waiting.length > 0) {
    const nextParty = waiting[0];
    const probe = runAStarAllocation(nextTables, nextParty, waiting.length - 1);
    if (hostAgent) {
      hostAgent.tasksCompleted += 1;
      hostAgent.targetTableId = probe.assignedTableIds[0] ?? null;
      hostAgent.currentAction = probe.success ? "DispatchAStar" : "Greet";
      hostAgent.utilityScore = probe.success ? 0.96 : 0.78;
    }
    if (probe.success && !probe.isBayesianPreAllocation) {
      newEvents.push({
        id: `evt-${nextTick}-host`,
        tick: nextTick,
        timestamp: baseTime,
        agentId: "Host-01",
        agentName: "Host-01 \xB7 Concierge",
        agentType: "Host (Goal-Based)",
        utilityScore: 0.96,
        targetTableId: probe.assignedTableIds[0],
        message: `Host-01 A* Goal Match: ${probe.assignedTableIds.join(
          " + "
        )} ready for ${nextParty.name} (f=${probe.fScore}).`
      });
    } else if (nextParty.isVip && nextParty.waitMins > 10) {
      newEvents.push({
        id: `evt-${nextTick}-host`,
        tick: nextTick,
        timestamp: baseTime,
        agentId: "Host-01",
        agentName: "Host-01 \xB7 Concierge",
        agentType: "Host (Goal-Based)",
        utilityScore: 0.91,
        targetTableId: null,
        message: `Rule R3 dispatched by Host-01 for ${nextParty.name} (${nextParty.waitMins}m wait) \u2192 Complimentary Saffron Amuse-Bouche.`
      });
    }
  }
  return { tables: nextTables, queue: nextQueue, waiters: nextWaiters, newEvents };
}
function computeFloorEfficiency(tables) {
  const occupied = tables.filter(
    (t) => t.status === "Occupied" || t.status === "Paying"
  );
  const free = tables.filter((t) => t.status === "Free");
  const accessibleAvailable = free.filter((t) => t.isAccessible);
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);
  const activeSeats = occupied.reduce(
    (s, t) => s + (t.assignedPartySize ?? t.capacity),
    0
  );
  const utilizedCapacity = occupied.reduce((s, t) => s + t.capacity, 0);
  const seatEfficiencyPct = utilizedCapacity > 0 ? Number((activeSeats / utilizedCapacity * 100).toFixed(1)) : totalSeats > 0 ? 98.4 : 0;
  const avgTurnoverRateMins = occupied.length > 0 ? Math.round(
    occupied.reduce((s, t) => s + Math.max(12, 62 - t.elapsedMins), 0) / occupied.length
  ) : 28;
  return {
    occupiedCount: occupied.length,
    freeCount: free.length,
    accessibleAvailableCount: accessibleAvailable.length,
    seatEfficiencyPct,
    avgTurnoverRateMins
  };
}

// backend/engine/workflows.ts
function addMinutesToIsoLocal(dateTimeStr, minsToAdd) {
  const parsed = new Date(dateTimeStr);
  if (Number.isNaN(parsed.getTime())) {
    return "+30 mins slot";
  }
  const shifted = new Date(parsed.getTime() + minsToAdd * 6e4);
  const hh = String(shifted.getHours()).padStart(2, "0");
  const mm = String(shifted.getMinutes()).padStart(2, "0");
  const yyyy = shifted.getFullYear();
  const mo = String(shifted.getMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getDate()).padStart(2, "0");
  return `${yyyy}-${mo}-${dd}T${hh}:${mm}`;
}
function formatReadableTime(dateTimeStr) {
  const parsed = new Date(dateTimeStr);
  if (Number.isNaN(parsed.getTime())) return dateTimeStr;
  return parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function validateBookingWorkflow(req, tables, existingReservations) {
  const t0 = performance.now();
  const slotReservedTableIds = /* @__PURE__ */ new Set();
  for (const r of existingReservations) {
    if (r.dateTime === req.dateTime) {
      for (const tid of r.assignedTableIds) {
        slotReservedTableIds.add(tid);
      }
    }
  }
  let pinnedMatch = null;
  if (req.preferredTableIds && req.preferredTableIds.length > 0) {
    const candidateTables = req.preferredTableIds.map((id) => tables.find((t) => t.id === id)).filter((t) => Boolean(t));
    const allFound = candidateTables.length === req.preferredTableIds.length;
    const allOpenAndUnreserved = candidateTables.every(
      (t) => !slotReservedTableIds.has(t.id) && (!req.needsWheelchair || t.isAccessible) && (t.status === "Free" || t.status === "Dirty" || t.status === "Paying")
    );
    const totalPinnedCapacity = candidateTables.reduce(
      (sum, t) => sum + t.capacity,
      0
    );
    if (allFound && allOpenAndUnreserved && totalPinnedCapacity >= req.partySize) {
      pinnedMatch = candidateTables;
    }
  }
  const zoneTables = req.preferredZone === "ANY" ? tables : tables.filter((t) => t.zone === req.preferredZone);
  const accessibleZoneTables = req.needsWheelchair ? zoneTables.filter((t) => t.isAccessible) : zoneTables;
  const openInZone = accessibleZoneTables.filter(
    (t) => !slotReservedTableIds.has(t.id) && (t.status === "Free" || t.status === "Dirty" || t.status === "Paying")
  );
  const singleMatch = pinnedMatch ? null : openInZone.filter((t) => t.capacity >= req.partySize).sort((a, b) => a.capacity - b.capacity)[0];
  let mergedMatch = null;
  if (!pinnedMatch && !singleMatch) {
    for (const t1 of openInZone) {
      if (!t1.combinableWith) continue;
      const t2 = openInZone.find((t) => t.id === t1.combinableWith);
      if (t2 && t1.capacity + t2.capacity >= req.partySize) {
        mergedMatch = [t1, t2].sort((a, b) => a.id.localeCompare(b.id));
        break;
      }
    }
  }
  if (!pinnedMatch && !singleMatch && !mergedMatch) {
    const slotLabel = formatReadableTime(req.dateTime);
    const plus30Iso = addMinutesToIsoLocal(req.dateTime, 30);
    const plus30Label = formatReadableTime(plus30Iso);
    const payingAccessible = tables.filter(
      (t) => t.status === "Paying" && (!req.needsWheelchair || t.isAccessible)
    );
    const bayesPct = payingAccessible.length > 0 ? Math.round(
      computeBayesianTurnoverProb(
        payingAccessible[0].status,
        payingAccessible[0].currentCourse,
        payingAccessible[0].elapsedMins
      ) * 100
    ) : 91;
    const alternatives = [
      {
        id: "alt-plus30",
        label: `${plus30Label} \xB7 Same Preference (${bayesPct}% Turnover Confidence)`,
        dateTime: plus30Iso,
        zone: req.preferredZone,
        bayesianConfidencePct: bayesPct,
        reason: "Bayesian turnover telemetry indicates Paying tables clear reliably within 25\u201330 minutes."
      }
    ];
    if (req.preferredZone !== "Main Hall") {
      alternatives.push({
        id: "alt-main-hall",
        label: `${slotLabel} \xB7 Main Hall Step-Free Seating (T3 + T4 Combinable)`,
        dateTime: req.dateTime,
        zone: "Main Hall",
        bayesianConfidencePct: 98,
        reason: "Main Hall hosts our widest wheelchair-accessible combinable tables (up to 8 guests)."
      });
    } else if (req.partySize > 8) {
      alternatives.push({
        id: "alt-split",
        label: `${slotLabel} \xB7 Adjacent Split-Table Pairing (T3 + T10 Accessible)`,
        dateTime: req.dateTime,
        zone: "Main Hall",
        bayesianConfidencePct: 96,
        reason: "Pairs two neighboring Main Hall step-free tables (4 + 6 = 10 seats) side by side."
      });
    }
    const constraintDetail = req.needsWheelchair ? `all wheelchair-accessible seating in ${req.preferredZone === "ANY" ? "the requested capacity" : req.preferredZone} for ${req.partySize} guests is already committed at ${slotLabel}` : `${req.preferredZone === "ANY" ? "matching seating" : req.preferredZone} capacity for ${req.partySize} guests is fully booked at ${slotLabel}`;
    const elapsedMs2 = Math.max(
      240,
      Math.min(1150, Math.round(performance.now() - t0 + 310))
    );
    return {
      fulfillable: false,
      responseTimeMs: elapsedMs2,
      apologyTitle: "Selected Slot Currently at Full Capacity",
      apologyMessage: `We sincerely apologize\u2014${constraintDetail}. Our hospitality concierge has verified the following immediate alternatives with live Bayesian turnover confidence:`,
      alternatives
    };
  }
  const assignedTables = pinnedMatch ? pinnedMatch : singleMatch ? [singleMatch] : mergedMatch;
  const assignedTableIds = assignedTables.map((t) => t.id);
  const triggeredRules = [];
  if (pinnedMatch) {
    triggeredRules.push(
      `Floor Map Selection: ${assignedTableIds.join(" + ")}`
    );
  }
  if (req.needsWheelchair) {
    triggeredRules.push("R1: Accessible Filter (isAccessible == true)");
  }
  if (assignedTables.length > 1) {
    triggeredRules.push(`R2: Adjacent Merge (${assignedTableIds.join(" + ")})`);
  }
  if (req.isVip) {
    triggeredRules.push("R3: VIP Priority Concierge & Saffron Welcome");
  }
  if (req.preferredZone !== "ANY") {
    triggeredRules.push(`Zone Match: ${req.preferredZone}`);
  }
  const minProb = Math.min(
    ...assignedTables.map(
      (t) => computeBayesianTurnoverProb(t.status, t.currentCourse, t.elapsedMins)
    )
  );
  const bayesianConfidencePct = Math.round(minProb * 100);
  const totalCap = assignedTables.reduce((s, t) => s + t.capacity, 0);
  const wastedSeats = Math.max(0, totalCap - req.partySize);
  const numericCode = String(Math.floor(1e3 + Math.random() * 8999));
  const bookingId = `KK-${numericCode}`;
  const qrPassCode = `KK-QR-${assignedTableIds[0]}-${numericCode}`;
  const now = /* @__PURE__ */ new Date();
  const createdAt = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  const reservation = {
    bookingId,
    guestName: req.guestName.trim(),
    email: req.email.trim(),
    phone: req.phone.trim(),
    dateTime: req.dateTime,
    partySize: req.partySize,
    preferredZone: req.preferredZone,
    needsWheelchair: req.needsWheelchair,
    isVip: Boolean(req.isVip),
    specialRequests: req.specialRequests.trim() || "Standard evening dining",
    status: "CONFIRMED",
    assignedTableIds,
    qrPassCode,
    triggeredRules,
    bayesianConfidencePct,
    fScore: Number((wastedSeats + (assignedTables.length > 1 ? 0.5 : 0)).toFixed(1)),
    createdAt
  };
  const elapsedMs = Math.max(
    260,
    Math.min(1180, Math.round(performance.now() - t0 + 340))
  );
  return {
    fulfillable: true,
    responseTimeMs: elapsedMs,
    reservation,
    emailPreview: {
      to: reservation.email,
      subject: `Khana-Khazana Reservation Confirmed \u2014 Pass #${bookingId}`,
      bookingId,
      qrPassCode,
      bodySummary: `Dear ${reservation.guestName}, your table (${assignedTableIds.join(
        " + "
      )} \xB7 ${assignedTables[0].zone}) for ${reservation.partySize} guests at ${formatReadableTime(
        reservation.dateTime
      )} is locked in NeonDB. Present QR Pass ${qrPassCode} upon arrival.`
    }
  };
}
function validateOrderIngredientsWorkflow(req, menuDishes, ingredients) {
  const t0 = performance.now();
  const requiredByIngredient = /* @__PURE__ */ new Map();
  const dishById = new Map(menuDishes.map((d) => [d.id, d]));
  const ingById = new Map(ingredients.map((i) => [i.id, i]));
  for (const cartItem of req.items) {
    const dish = dishById.get(cartItem.dishId);
    if (!dish || cartItem.quantity <= 0) continue;
    for (const r of dish.recipe) {
      const cur = requiredByIngredient.get(r.ingredientId) ?? 0;
      requiredByIngredient.set(r.ingredientId, cur + r.amount * cartItem.quantity);
    }
  }
  const isDishInStock = (dish) => dish.recipe.every((r) => {
    const ing = ingById.get(r.ingredientId);
    return ing ? ing.stock >= r.amount : false;
  });
  const conflicts = [];
  for (const cartItem of req.items) {
    const dish = dishById.get(cartItem.dishId);
    if (!dish || cartItem.quantity <= 0) continue;
    for (const r of dish.recipe) {
      const ing = ingById.get(r.ingredientId);
      const totalNeeded = requiredByIngredient.get(r.ingredientId) ?? 0;
      if (!ing || ing.stock < totalNeeded) {
        const availableSubstitutes = dish.substituteDishIds.map((subId) => dishById.get(subId)).filter((d) => Boolean(d && isDishInStock(d))).map((d) => ({
          dishId: d.id,
          name: d.name,
          price: d.price,
          reason: `In stock now \xB7 ${d.prepMins}m prep`
        }));
        conflicts.push({
          dishId: dish.id,
          dishName: dish.name,
          ingredientId: r.ingredientId,
          ingredientName: ing?.name ?? r.ingredientId,
          requiredAmount: totalNeeded,
          availableStock: ing?.stock ?? 0,
          unit: ing?.unit ?? "g",
          politeMessage: `We're so sorry\u2014our fresh ${ing?.name ?? "ingredient"} stock for ${dish.name} just ran out for the evening.`,
          suggestedSubstitutes: availableSubstitutes
        });
        break;
      }
    }
  }
  if (conflicts.length > 0) {
    const elapsedMs2 = Math.max(
      180,
      Math.min(980, Math.round(performance.now() - t0 + 290))
    );
    return {
      ok: false,
      responseTimeMs: elapsedMs2,
      conflicts
    };
  }
  const updatedIngredients = ingredients.map((ing) => {
    const used = requiredByIngredient.get(ing.id) ?? 0;
    return used > 0 ? { ...ing, stock: Math.max(0, ing.stock - used) } : ing;
  });
  const orderItems = req.items.map((ci) => {
    const dish = dishById.get(ci.dishId);
    if (!dish || ci.quantity <= 0) return null;
    return {
      dishId: dish.id,
      name: dish.name,
      quantity: ci.quantity,
      price: dish.price
    };
  }).filter(
    (x) => Boolean(x)
  );
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const prepTimeMins = Math.max(
    10,
    ...orderItems.map((oi) => dishById.get(oi.dishId)?.prepMins ?? 12)
  );
  const now = /* @__PURE__ */ new Date();
  const createdAt = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  const order = {
    orderId: `ORD-${Math.floor(400 + Math.random() * 599)}`,
    tableId: req.tableId,
    bookingId: req.bookingId,
    items: orderItems,
    totalAmount,
    prepTimeMins,
    status: "Order Received",
    dispatchedAgentId: "W1",
    createdAt
  };
  const elapsedMs = Math.max(
    210,
    Math.min(950, Math.round(performance.now() - t0 + 320))
  );
  return {
    ok: true,
    responseTimeMs: elapsedMs,
    order,
    updatedIngredients
  };
}

// backend/engine/ragGrounding.ts
var HALLUCINATION_REFUSAL_TEXT = "I cannot verify that information from our current restaurant knowledge base or live floor data.";
var OUT_OF_SCOPE_PATTERNS = [
  /swimming\s*pool/i,
  /rooftop\s*pool/i,
  /\bpool\b/i,
  /\bspa\b/i,
  /helipad/i,
  /helicopter/i,
  /hotel\s*room/i,
  /casino/i,
  /bowling/i,
  /pet\s*groom/i,
  /cryptocurrency/i,
  /\bbitcoin\b/i,
  /stock\s*price/i,
  /weather/i,
  /\bflight\b/i,
  /\bmovie\b/i,
  /president/i,
  /prime\s*minister/i,
  /capital\s+of/i
];
var GREETING_IDENTITY_PATTERNS = [
  /^\s*(hi|hello|hey|namaste|good\s*(morning|afternoon|evening))\b/i,
  /\bwho\s+(are\s+you|you\s+are|is\s+this)\b/i,
  /\bwhat\s+(are\s+you|can\s+you\s+do|do\s+you\s+do)\b/i,
  /\btell\s+me\s+about\s+(yourself|khana)\b/i,
  /\bhelp\b/i,
  /khana[-\s]?khazana/i
];
function isExplicitOutOfScopeQuery(query) {
  return OUT_OF_SCOPE_PATTERNS.some((rx) => rx.test(query.toLowerCase()));
}
var IN_DOMAIN_KEYWORDS = [
  "table",
  "t1",
  "t2",
  "t3",
  "t4",
  "t5",
  "t6",
  "t7",
  "t8",
  "t9",
  "t10",
  "seat",
  "wheelchair",
  "access",
  "step-free",
  "vip",
  "complimentary",
  "starter",
  "papad",
  "r1",
  "r2",
  "r3",
  "r4",
  "combine",
  "merge",
  "wait",
  "queue",
  "bayes",
  "prob",
  "free",
  "paying",
  "dirty",
  "window",
  "main hall",
  "lounge",
  "zone",
  "waiter",
  "agent",
  "host",
  "arjun",
  "kavya",
  "rohan",
  "menu",
  "dish",
  "food",
  "eat",
  "recommend",
  "suggest",
  "popular",
  "signature",
  "best",
  "price",
  "cost",
  "veg",
  "vegetarian",
  "non-veg",
  "spicy",
  "dessert",
  "sweet",
  "butter naan",
  "paneer",
  "truffle",
  "dal",
  "makhani",
  "biryani",
  "zafrani",
  "saffron",
  "penne",
  "pizza",
  "burrata",
  "chicken",
  "paratha",
  "gulab",
  "jain",
  "vegan",
  "gluten",
  "nut",
  "cashew",
  "pistachio",
  "dairy",
  "allerg",
  "hour",
  "open",
  "close",
  "policy",
  "policies",
  "floor",
  "party",
  "group",
  "reservation",
  "booking",
  "book",
  "qr",
  "stock",
  "inventory",
  "ingredient",
  "fairness"
];
function buildGroqKnowledgeContext(params) {
  const { portal, tables, queue, waiters, ingredients, reservations } = params;
  const staticKnowledge = {
    brand: RESTAURANT_POLICIES.brandName,
    hours: RESTAURANT_POLICIES.hours,
    zones: RESTAURANT_POLICIES.zones,
    policies: RESTAURANT_POLICIES_CHUNKS.map((p) => ({
      id: p.id,
      section: p.section,
      source: p.sourceFile,
      rule: p.content
    })),
    signatureMenuAndAllergens: SIGNATURE_MENU_KNOWLEDGE_BASE,
    qrMenuDishes: MENU_DISHES.map((d) => ({
      id: d.id,
      name: d.name,
      priceInr: d.price,
      prepMins: d.prepMins,
      dietaryTags: d.dietaryTags
    }))
  };
  const liveFloorDb = {
    portalView: portal === "customer" ? "Guest AI Concierge (Menu, Allergens, Availability & Accessibility)" : "Admin Operations Ma\xEEtre D\u2019 (Live Tables, Inventory, Queue & MAS)",
    tables: tables.map((t) => ({
      id: t.id,
      label: t.label,
      capacity: t.capacity,
      zone: t.zone,
      isAccessible: t.isAccessible,
      isVipBooth: t.isVipBooth,
      combinableWith: t.combinableWith,
      status: t.status,
      currentCourse: t.currentCourse,
      elapsedMins: t.elapsedMins,
      bayesianFreeIn10Pct: Math.round(
        computeBayesianTurnoverProb(t.status, t.currentCourse, t.elapsedMins) * 100
      )
    })),
    activeWaitingQueue: queue.filter((p) => p.status === "WAITING"),
    confirmedReservationsCount: reservations.length,
    livePantryStock: ingredients.map((i) => ({
      id: i.id,
      name: i.name,
      stock: `${i.stock}${i.unit}`,
      parLevel: `${i.parLevel}${i.unit}`
    })),
    activeWaiters: waiters.map((w) => ({
      id: w.id,
      zone: w.zone,
      action: w.currentAction,
      targetTableId: w.targetTableId
    }))
  };
  return `STATIC_KNOWLEDGE_BASE [restaurant_policies.md]:
${JSON.stringify(staticKnowledge)}

LIVE_FLOOR_AND_KITCHEN_STATE [live_floor_db]:
${JSON.stringify(liveFloorDb)}`;
}
function evaluateGroundedMaitreD(query, tables, queue, waiters, ingredients = [], reservations = []) {
  const q = query.toLowerCase().trim();
  if (isExplicitOutOfScopeQuery(q)) {
    return {
      reply: HALLUCINATION_REFUSAL_TEXT,
      sources: ["[restaurant_policies.md]", "[live_floor_db]"],
      refusalTriggered: true
    };
  }
  const freeTables = tables.filter((t) => t.status === "Free");
  const accessibleFree = freeTables.filter((t) => t.isAccessible);
  const payingTables = tables.filter((t) => t.status === "Paying");
  const waiting = queue.filter((p) => p.status === "WAITING");
  const eff = computeFloorEfficiency(tables);
  const isGreetingOrIdentity = GREETING_IDENTITY_PATTERNS.some((rx) => rx.test(q));
  const hasDomainAnchor = IN_DOMAIN_KEYWORDS.some((kw) => q.includes(kw));
  if (isGreetingOrIdentity && !hasDomainAnchor) {
    return {
      reply: `Namaste! I am the Khana-Khazana Grounded AI Concierge (${RESTAURANT_POLICIES.hours}, zones: Window, Main Hall & VIP Lounge). Currently ${freeTables.length}/${tables.length} tables are Free with ${waiting.length} queued parties\u2014ask me about wheelchair seating (T3 + T4), nut-free or gluten-free dishes, live kitchen ingredient stock, or VIP policies.`,
      sources: ["[restaurant_policies.md]", "[live_floor_db]"],
      refusalTriggered: false
    };
  }
  if (!hasDomainAnchor) {
    return {
      reply: HALLUCINATION_REFUSAL_TEXT,
      sources: ["[restaurant_policies.md]", "[live_floor_db]"],
      refusalTriggered: true
    };
  }
  if (q.includes("stock") || q.includes("inventory") || q.includes("ingredient") || q.includes("truffle") || q.includes("saffron") || q.includes("penne")) {
    if (ingredients.length > 0) {
      const truffleIng = ingredients.find((i) => i.id === "ing-truffle");
      const paneerIng = ingredients.find((i) => i.id === "ing-paneer");
      if (q.includes("truffle paneer tikka") && truffleIng && paneerIng) {
        const canMake = truffleIng.stock >= 15 && paneerIng.stock >= 220;
        return {
          reply: canMake ? `Yes \u2014 Truffle Paneer Tikka (\u20B9540) is IN STOCK right now: live NeonDB pantry holds ${truffleIng.stock}${truffleIng.unit} Black Truffle Shavings (15g/order) and ${paneerIng.stock}${paneerIng.unit} Fresh Malai Paneer (220g/order).` : `Truffle Paneer Tikka is currently OUT OF STOCK (Black Truffle Shavings: ${truffleIng.stock}${truffleIng.unit}, Fresh Malai Paneer: ${paneerIng.stock}${paneerIng.unit}). Chef substitutes: 24-Hour Smoked Dal Makhani or Wood-Fired Burrata Margherita.`,
          sources: ["[live_floor_db]", "[restaurant_policies.md]"],
          refusalTriggered: false
        };
      }
      const lowOrZero = ingredients.filter((i) => i.stock <= i.parLevel * 0.2);
      const summary = ingredients.map((i) => `${i.name}: ${i.stock}${i.unit}`).join(", ");
      return {
        reply: lowOrZero.length > 0 ? `Kitchen Inventory Alert \u2014 low/out items: ${lowOrZero.map((i) => `${i.name} (${i.stock}${i.unit})`).join(", ")}. Live stock snapshot: ${summary}.` : `All tracked kitchen ingredients are in stock: ${summary}.`,
        sources: ["[live_floor_db]", "[restaurant_policies.md]"],
        refusalTriggered: false
      };
    }
  }
  if (q.includes("nut-free") || q.includes("nut free") || q.includes("nuts") || q.includes("cashew") || q.includes("pistachio") || q.includes("allerg")) {
    const nutFreeList = SIGNATURE_MENU_KNOWLEDGE_BASE.filter((d) => d.nutFree).map((d) => `${d.name} (\u20B9${d.price} \u2014 ${d.allergens.join(", ")})`).join("; ");
    const containsNuts = SIGNATURE_MENU_KNOWLEDGE_BASE.filter((d) => !d.nutFree).map((d) => `${d.name} (${d.allergens.join(", ")})`).join(" and ");
    return {
      reply: `Verified nut-free dishes: ${nutFreeList}. Avoid dishes containing tree nuts: ${containsNuts}.`,
      sources: ["[restaurant_policies.md]", "[live_floor_db]"],
      refusalTriggered: false
    };
  }
  if (q.includes("wheelchair") || q.includes("access") || q.includes("r1")) {
    const sizeMatch = /\b([5-9]|10)\b/.exec(q);
    if (sizeMatch) {
      const requestedSize = Number(sizeMatch[1]);
      const probeParty = {
        id: "PROBE-WC",
        name: "Accessible Group Inquiry",
        size: requestedSize,
        isVip: false,
        needsWheelchair: true,
        preferredZone: "Main Hall",
        waitMins: 0,
        status: "WAITING"
      };
      const probe = runAStarAllocation(tables, probeParty, waiting.length);
      const t3 = tables.find((t) => t.id === "T3");
      const t4 = tables.find((t) => t.id === "T4");
      const t10 = tables.find((t) => t.id === "T10");
      return {
        reply: `Yes \u2014 a wheelchair party of ${requestedSize} can be seated together in the Main Hall. Step-free tables T3 (${t3?.status ?? "Free"}) + T4 (${t4?.status ?? "Free"}) combine into an ${(t3?.capacity ?? 4) + (t4?.capacity ?? 4)}-seat accessible setup (or 6-top T10 when Free, currently ${t10?.status ?? "Paying"}). Live A* routing ${probe.success ? `locks ${probe.assignedTableIds.join(" + ")} (${probe.totalCapacity} seats, f=${probe.fScore}).` : "queues for next accessible turn."}`,
        sources: ["[restaurant_policies.md]", "[live_floor_db]"],
        refusalTriggered: false
      };
    }
    const allAccessible = tables.filter((t) => t.isAccessible);
    const readyList = accessibleFree.length > 0 ? accessibleFree.map((t) => `${t.id} (${t.capacity} seats, ${t.zone})`).join(", ") : "none immediately Free";
    const soonest = allAccessible.filter((t) => t.status !== "Free").map(
      (t) => `${t.id} (${t.status}, P(Free\u2081\u2080)=${Math.round(
        computeBayesianTurnoverProb(t.status, t.currentCourse, t.elapsedMins) * 100
      )}%)`
    ).join("; ");
    return {
      reply: `Rule R1 enforces step-free access across tables ${allAccessible.map((t) => t.id).join(", ")} (with T3 + T4 combinable into an 8-seat accessible layout). Currently ${accessibleFree.length} accessible table${accessibleFree.length === 1 ? " is" : "s are"} Free: ${readyList}. Other accessible tables in cadence: ${soonest || "all currently open"}.`,
      sources: ["[live_floor_db]", "[restaurant_policies.md]"],
      refusalTriggered: false
    };
  }
  if (q.includes("vip") || q.includes("complimentary") || q.includes("starter") || q.includes("papad") || q.includes("fairness") || q.includes("r3") || q.includes("r4")) {
    const vipTables = tables.filter((t) => t.isVipBooth);
    return {
      reply: `${RESTAURANT_POLICIES_CHUNKS[1].content} Live VIP Lounge & celebration booths: ${vipTables.map((t) => `${t.id} (${t.capacity} seats \xB7 ${t.status})`).join(", ")}.`,
      sources: ["[restaurant_policies.md]", "[live_floor_db]"],
      refusalTriggered: false
    };
  }
  if (q.includes("menu") || q.includes("dish") || q.includes("food") || q.includes("eat") || q.includes("recommend") || q.includes("suggest") || q.includes("popular") || q.includes("signature") || q.includes("best") || q.includes("price") || q.includes("cost") || q.includes("veg") || q.includes("non-veg") || q.includes("spicy") || q.includes("dessert") || q.includes("sweet") || q.includes("paneer") || q.includes("pizza") || q.includes("biryani") || q.includes("gulab") || q.includes("dal") || q.includes("chicken") || q.includes("paratha") || q.includes("jain") || q.includes("vegan") || q.includes("gluten") || q.includes("hour") || q.includes("open")) {
    const gfDishes = SIGNATURE_MENU_KNOWLEDGE_BASE.filter((d) => d.glutenFree).map((d) => `${d.name} (\u20B9${d.price})`).join(", ");
    const signaturePrices = MENU_DISHES.slice(0, 4).map((d) => `${d.name} (\u20B9${d.price})`).join(", ");
    return {
      reply: `Hours: ${RESTAURANT_POLICIES.hours}. Signature highlights include ${signaturePrices}. ${RESTAURANT_POLICIES_CHUNKS[3].content} Verified Gluten-Free selections: ${gfDishes}.`,
      sources: ["[restaurant_policies.md]", "[live_floor_db]"],
      refusalTriggered: false
    };
  }
  if (q.includes("reservation") || q.includes("booking") || q.includes("wait") || q.includes("ready") || q.includes("combine") || q.includes("merge") || q.includes("large") || q.includes("party") || q.includes("group") || q.includes("bayes") || /\b[5-9]|10\b/.test(q)) {
    const size = q.includes("10") ? 10 : q.includes("8") ? 8 : q.includes("7") ? 7 : q.includes("6") ? 6 : 5;
    const probeParty = {
      id: "PROBE",
      name: "Guest Inquiry",
      size,
      isVip: q.includes("vip"),
      needsWheelchair: q.includes("wheelchair"),
      preferredZone: "ANY",
      waitMins: 0,
      status: "WAITING"
    };
    const probe = runAStarAllocation(tables, probeParty, waiting.length);
    const payingDetails = payingTables.length > 0 ? payingTables.map(
      (t) => `${t.id} (${t.zone}, P(Free\u2081\u2080)=${Math.round(
        computeBayesianTurnoverProb(
          t.status,
          t.currentCourse,
          t.elapsedMins
        ) * 100
      )}%)`
    ).join(", ") : "none currently in Paying stage";
    return {
      reply: `Floor snapshot shows ${freeTables.length} Free tables (${freeTables.map((t) => `${t.id} \xB7 ${t.capacity}s`).join(", ") || "none"}), ${reservations.length} confirmed NeonDB reservation(s), and Paying tables ${payingDetails}. For a party of ${size}, A* recommends ${probe.success ? `${probe.assignedTableIds.join(" + ")} (f=${probe.fScore}, ${probe.wastedSeats} wasted seats)` : "holding in queue until next Bayesian release"}.`,
      sources: ["[live_floor_db]", "[restaurant_policies.md]"],
      refusalTriggered: false
    };
  }
  const activeAgents = waiters.map((w) => `${w.id} (${w.currentAction} @ ${w.targetTableId ?? "Queue"})`).join(", ");
  return {
    reply: `Floor Command reports ${freeTables.length}/${tables.length} tables Free (${freeTables.map((t) => `${t.id} ${t.capacity}s`).join(", ") || "none"}), ${eff.seatEfficiencyPct}% seat utilization, and ${waiting.length} waiting parties. Active agents: ${activeAgents}.`,
    sources: ["[live_floor_db]", "[restaurant_policies.md]"],
    refusalTriggered: false
  };
}

// backend/db/neon.ts
var import_pg = require("pg");

// backend/db/schemaSql.ts
var SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  zone TEXT NOT NULL CHECK (zone IN ('Window', 'Main Hall', 'VIP Lounge')),
  is_accessible BOOLEAN NOT NULL DEFAULT FALSE,
  is_vip_booth BOOLEAN NOT NULL DEFAULT FALSE,
  combinable_with TEXT,
  status TEXT NOT NULL CHECK (status IN ('Free', 'Occupied', 'Paying', 'Dirty')),
  current_course TEXT NOT NULL CHECK (current_course IN ('None', 'Appetizer', 'Mains', 'Dessert', 'Billing')),
  elapsed_mins INTEGER NOT NULL DEFAULT 0 CHECK (elapsed_mins >= 0),
  assigned_party_id TEXT,
  assigned_party_name TEXT,
  assigned_party_size INTEGER,
  active_booking_id TEXT,
  grid_col INTEGER NOT NULL DEFAULT 0,
  grid_row INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waiting_queue (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  size INTEGER NOT NULL CHECK (size > 0),
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  needs_wheelchair BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_zone TEXT NOT NULL,
  dietary_notes TEXT,
  wait_mins INTEGER NOT NULL DEFAULT 0 CHECK (wait_mins >= 0),
  status TEXT NOT NULL CHECK (status IN ('WAITING', 'SEATED')),
  booking_id TEXT,
  created_ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  booking_id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_time TEXT NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  preferred_zone TEXT NOT NULL,
  needs_wheelchair BOOLEAN NOT NULL DEFAULT FALSE,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  special_requests TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('CONFIRMED', 'CHECKED_IN', 'SEATED')),
  assigned_table_ids JSONB NOT NULL,
  qr_pass_code TEXT NOT NULL,
  triggered_rules JSONB NOT NULL,
  bayesian_confidence_pct INTEGER NOT NULL,
  f_score REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  created_ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_datetime ON reservations (date_time);

CREATE TABLE IF NOT EXISTS ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('g', 'mg', 'ml', 'pcs')),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  par_level INTEGER NOT NULL CHECK (par_level > 0),
  per_order_highlight TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_dishes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  prep_mins INTEGER NOT NULL CHECK (prep_mins > 0),
  dietary_tags JSONB NOT NULL,
  is_veg BOOLEAN NOT NULL DEFAULT TRUE,
  image TEXT NOT NULL,
  recipe JSONB NOT NULL,
  substitute_dish_ids JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS kitchen_orders (
  order_id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL REFERENCES restaurant_tables(id) ON UPDATE CASCADE,
  booking_id TEXT,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  prep_time_mins INTEGER NOT NULL CHECK (prep_time_mins > 0),
  status TEXT NOT NULL CHECK (status IN ('Order Received', 'Preparing', 'Waiter En Route')),
  dispatched_agent_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kitchen_orders_table ON kitchen_orders (table_id);

CREATE TABLE IF NOT EXISTS waiter_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  zone TEXT NOT NULL,
  current_action TEXT NOT NULL,
  target_table_id TEXT,
  energy_pct INTEGER NOT NULL,
  utility_score REAL NOT NULL,
  utility_breakdown JSONB NOT NULL,
  tasks_completed INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS agent_events (
  id TEXT PRIMARY KEY,
  tick INTEGER NOT NULL DEFAULT 0,
  timestamp TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  utility_score REAL,
  target_table_id TEXT,
  message TEXT NOT NULL,
  created_ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_events_created ON agent_events (created_ts DESC);

CREATE TABLE IF NOT EXISTS xai_audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  party_name TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  assigned_tables JSONB NOT NULL,
  algorithm TEXT NOT NULL,
  f_score REAL NOT NULL,
  bayesian_prob REAL NOT NULL,
  rules_applied JSONB NOT NULL,
  justification TEXT NOT NULL,
  created_ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xai_audit_created ON xai_audit_logs (created_ts DESC);
`;

// backend/db/demoSeed.ts
var DEMO_INGREDIENTS = [
  {
    id: "ing-cashew",
    name: "Roasted Goan Cashew Paste",
    unit: "g",
    stock: 650,
    parLevel: 800,
    perOrderHighlight: "40g per Paneer Butter Masala (Tree Nut)"
  },
  {
    id: "ing-pistachio",
    name: "Iranian Pistachio Slivers",
    unit: "g",
    stock: 420,
    parLevel: 500,
    perOrderHighlight: "15g per Saffron Gulab Jamun (Tree Nut)"
  }
];
var DEMO_QUEUE = [
  {
    id: "P-105",
    name: "Ananya Kapoor",
    size: 2,
    isVip: false,
    needsWheelchair: false,
    preferredZone: "Window",
    dietaryNotes: "Strict nut allergy \xB7 Royal Zafrani Dum Biryani",
    waitMins: 5,
    status: "WAITING",
    bookingId: "KK-9102"
  },
  {
    id: "P-106",
    name: "Devansh & Riya Malhotra",
    size: 6,
    isVip: true,
    needsWheelchair: false,
    preferredZone: "VIP Lounge",
    dietaryNotes: "Anniversary saffron tasting & welcome drink",
    waitMins: 14,
    status: "WAITING",
    bookingId: "KK-9118"
  },
  {
    id: "P-107",
    name: "Rao Couple",
    size: 2,
    isVip: false,
    needsWheelchair: false,
    preferredZone: "Window",
    dietaryNotes: "24-Hour Smoked Dal Makhani + Biryani",
    waitMins: 0,
    status: "SEATED",
    bookingId: "KK-7401"
  },
  {
    id: "P-108",
    name: "Vikramaditya Party",
    size: 4,
    isVip: true,
    needsWheelchair: true,
    preferredZone: "VIP Lounge",
    dietaryNotes: "Step-free VIP suite",
    waitMins: 0,
    status: "SEATED",
    bookingId: "KK-7904"
  }
];
var DEMO_RESERVATIONS = [
  {
    bookingId: "KK-7401",
    guestName: "Rao Couple",
    email: "rao.couple@example.com",
    phone: "+91 98101 22310",
    dateTime: "2026-11-15T19:00",
    partySize: 2,
    preferredZone: "Window",
    needsWheelchair: false,
    isVip: false,
    specialRequests: "Corner bay window view",
    status: "SEATED",
    assignedTableIds: ["T1"],
    qrPassCode: "KK-QR-T1-7401",
    triggeredRules: ["Zone Match: Window", "Minimal Waste Heuristic (0 wasted)"],
    bayesianConfidencePct: 100,
    fScore: 0,
    createdAt: "18:55:10"
  },
  {
    bookingId: "KK-7512",
    guestName: "Mehta Quartet",
    email: "mehta.quartet@example.com",
    phone: "+91 98220 44109",
    dateTime: "2026-11-15T18:45",
    partySize: 4,
    preferredZone: "Window",
    needsWheelchair: false,
    isVip: false,
    specialRequests: "Gluten-free pizza option",
    status: "SEATED",
    assignedTableIds: ["T5"],
    qrPassCode: "KK-QR-T5-7512",
    triggeredRules: ["Zone Match: Window", "Bayesian Billing Cadence Tracked"],
    bayesianConfidencePct: 88,
    fScore: 0.5,
    createdAt: "18:40:02"
  },
  {
    bookingId: "KK-7618",
    guestName: "Sen Family",
    email: "sen.family@example.com",
    phone: "+91 98311 66780",
    dateTime: "2026-11-15T19:10",
    partySize: 3,
    preferredZone: "Window",
    needsWheelchair: false,
    isVip: false,
    specialRequests: "Warm Saffron Gulab Jamun dessert course",
    status: "SEATED",
    assignedTableIds: ["T6"],
    qrPassCode: "KK-QR-T6-7618",
    triggeredRules: ["Zone Match: Window", "Dessert Cadence P(Free10)=62%"],
    bayesianConfidencePct: 62,
    fScore: 1,
    createdAt: "19:05:19"
  },
  {
    bookingId: "KK-7904",
    guestName: "Vikramaditya Party",
    email: "vikram.vip@example.com",
    phone: "+91 98111 90011",
    dateTime: "2026-11-15T19:30",
    partySize: 4,
    preferredZone: "VIP Lounge",
    needsWheelchair: true,
    isVip: true,
    specialRequests: "Step-free VIP suite & saffron pairing",
    status: "SEATED",
    assignedTableIds: ["T9"],
    qrPassCode: "KK-QR-T9-7904",
    triggeredRules: ["R1: Accessible Filter", "Zone Match: VIP Lounge"],
    bayesianConfidencePct: 100,
    fScore: 0.5,
    createdAt: "19:22:40"
  },
  {
    bookingId: "KK-8010",
    guestName: "Chatterjee Guests",
    email: "chatterjee.h@example.com",
    phone: "+91 98300 77881",
    dateTime: "2026-11-15T18:50",
    partySize: 5,
    preferredZone: "Main Hall",
    needsWheelchair: true,
    isVip: true,
    specialRequests: "Wheelchair party of 5 \xB7 Main Hall Heritage table",
    status: "SEATED",
    assignedTableIds: ["T10"],
    qrPassCode: "KK-QR-T10-8010",
    triggeredRules: ["R1: Accessible Filter", "Single 6-Top Preferred Over Merge"],
    bayesianConfidencePct: 91,
    fScore: 1,
    createdAt: "18:47:11"
  },
  {
    bookingId: "KK-9102",
    guestName: "Ananya Kapoor",
    email: "ananya.kapoor@example.com",
    phone: "+91 98450 11223",
    dateTime: "2026-11-15T21:30",
    partySize: 2,
    preferredZone: "Window",
    needsWheelchair: false,
    isVip: false,
    specialRequests: "Nut-free menu verified via Concierge",
    status: "CONFIRMED",
    assignedTableIds: ["T1"],
    qrPassCode: "KK-QR-T1-9102",
    triggeredRules: ["Zone Match: Window", "Allergen Audit Logged"],
    bayesianConfidencePct: 96,
    fScore: 0,
    createdAt: "20:04:15"
  },
  {
    bookingId: "KK-9118",
    guestName: "Devansh & Riya Malhotra",
    email: "malhotra.vip@example.com",
    phone: "+91 98180 55432",
    dateTime: "2026-11-15T21:45",
    partySize: 6,
    preferredZone: "VIP Lounge",
    needsWheelchair: false,
    isVip: true,
    specialRequests: "Wait > 10m Saffron Masala Papad & Welcome Drink",
    status: "CONFIRMED",
    assignedTableIds: ["T8"],
    qrPassCode: "KK-QR-T8-9118",
    triggeredRules: ["Zone Match: VIP Lounge", "R3: VIP Wait > 10m Amuse-Bouche"],
    bayesianConfidencePct: 100,
    fScore: 0.5,
    createdAt: "20:11:30"
  },
  {
    bookingId: "KK-9150",
    guestName: "Iyer Accessible Group",
    email: "iyer.accessibility@example.com",
    phone: "+91 98401 33445",
    dateTime: "2026-11-16T13:00",
    partySize: 6,
    preferredZone: "Main Hall",
    needsWheelchair: true,
    isVip: false,
    specialRequests: "Step-free Main Hall lunch for 6 guests",
    status: "CONFIRMED",
    assignedTableIds: ["T10"],
    qrPassCode: "KK-QR-T10-9150",
    triggeredRules: ["R1: Accessible Filter", "Zone Match: Main Hall"],
    bayesianConfidencePct: 100,
    fScore: 0,
    createdAt: "20:15:08"
  }
];
var DEMO_ORDERS = [
  {
    orderId: "ORD-302",
    tableId: "T5",
    bookingId: "KK-7512",
    items: [
      {
        dishId: "dish-truffle-paneer",
        name: "Truffle Paneer Tikka",
        quantity: 1,
        price: 540
      },
      {
        dishId: "dish-margherita",
        name: "Wood-Fired Burrata Margherita",
        quantity: 1,
        price: 430
      }
    ],
    totalAmount: 970,
    prepTimeMins: 14,
    status: "Waiter En Route",
    dispatchedAgentId: "W2",
    createdAt: "19:48:20"
  },
  {
    orderId: "ORD-303",
    tableId: "T6",
    bookingId: "KK-7618",
    items: [
      {
        dishId: "dish-gf-penne",
        name: "Gluten-Free Masala Penne",
        quantity: 1,
        price: 450
      },
      {
        dishId: "dish-gulab-jamun",
        name: "Warm Saffron & Pistachio Gulab Jamun",
        quantity: 2,
        price: 220
      }
    ],
    totalAmount: 890,
    prepTimeMins: 14,
    status: "Waiter En Route",
    dispatchedAgentId: "W2",
    createdAt: "20:02:10"
  },
  {
    orderId: "ORD-304",
    tableId: "T9",
    bookingId: "KK-7904",
    items: [
      {
        dishId: "dish-saffron-biryani",
        name: "Royal Saffron Dum Biryani",
        quantity: 2,
        price: 490
      },
      {
        dishId: "dish-truffle-paneer",
        name: "Truffle Paneer Tikka",
        quantity: 1,
        price: 540
      }
    ],
    totalAmount: 1520,
    prepTimeMins: 18,
    status: "Preparing",
    dispatchedAgentId: "W3",
    createdAt: "20:09:44"
  },
  {
    orderId: "ORD-305",
    tableId: "T10",
    bookingId: "KK-8010",
    items: [
      {
        dishId: "dish-dal-makhani",
        name: "24-Hour Smoked Dal Makhani",
        quantity: 2,
        price: 420
      },
      {
        dishId: "dish-chicken-paratha",
        name: "Homestyle Chicken & Flaky Paratha",
        quantity: 2,
        price: 470
      }
    ],
    totalAmount: 1780,
    prepTimeMins: 16,
    status: "Waiter En Route",
    dispatchedAgentId: "W1",
    createdAt: "19:35:00"
  },
  {
    orderId: "ORD-306",
    tableId: "T9",
    bookingId: "KK-7904",
    items: [
      {
        dishId: "dish-gulab-jamun",
        name: "Warm Saffron & Pistachio Gulab Jamun",
        quantity: 2,
        price: 220
      }
    ],
    totalAmount: 440,
    prepTimeMins: 8,
    status: "Order Received",
    dispatchedAgentId: "W3",
    createdAt: "20:14:50"
  }
];
var DEMO_AGENT_EVENTS = [
  {
    id: "evt-demo-4",
    tick: 0,
    timestamp: "20:14:15",
    agentId: "Host-01",
    agentName: "Host-01 \xB7 Concierge",
    agentType: "Host (Goal-Based)",
    utilityScore: 0.94,
    targetTableId: "T5",
    message: "Bayesian Engine marked T5 Skyline North (Billing, 52m) at P(Free\u2081\u2080)=88% \u2014 eligible for pre-allocation."
  },
  {
    id: "evt-demo-5",
    tick: 0,
    timestamp: "20:14:22",
    agentId: "W3",
    agentName: "W3 \xB7 Rohan",
    agentType: "Waiter (Utility-Based)",
    utilityScore: 0.91,
    targetTableId: "T9",
    message: "W3 Rohan triggered Rule R3 Saffron Masala Papad & Welcome Drink for Devansh & Riya Malhotra (VIP wait 14m)."
  },
  {
    id: "evt-demo-6",
    tick: 0,
    timestamp: "20:14:30",
    agentId: "Host-01",
    agentName: "Host-01 \xB7 Concierge",
    agentType: "Host (Goal-Based)",
    utilityScore: 0.96,
    targetTableId: "T10",
    message: "T10 Heritage Chef Table (Paying, 58m) reached P(Free\u2081\u2080)=91% \u2014 queued for Iyer Accessible Group."
  },
  {
    id: "evt-demo-7",
    tick: 0,
    timestamp: "20:14:42",
    agentId: "W2",
    agentName: "W2 \xB7 Kavya",
    agentType: "Waiter (Utility-Based)",
    utilityScore: 0.89,
    targetTableId: "T6",
    message: "W2 Kavya delivered ORD-303 (Gluten-Free Masala Penne + Saffron Gulab Jamun) to T6 Sen Family."
  },
  {
    id: "evt-demo-8",
    tick: 0,
    timestamp: "20:14:55",
    agentId: "W1",
    agentName: "W1 \xB7 Arjun",
    agentType: "Waiter (Utility-Based)",
    utilityScore: 0.93,
    targetTableId: "T10",
    message: "W1 Arjun locked atomic recipe pantry check for ORD-305 (2x Dal Makhani + 2x Chicken Paratha) on T10."
  }
];
var DEMO_XAI_LOGS = [
  {
    id: "xai-demo-3",
    timestamp: "20:10:05",
    partyName: "Kulkarni Family Eight",
    partySize: 7,
    assignedTables: ["T3", "T4"],
    algorithm: "A* Search + Rule R2 Merge",
    fScore: 4.5,
    bayesianProb: 1,
    rulesApplied: ["R1: Accessible Filter", "R2: Merge T3 + T4 (8 seats)"],
    justification: "No single 7-seat step-free table available; A* combined adjacent Main Hall accessible tables T3 + T4 (1 wasted seat)."
  },
  {
    id: "xai-demo-4",
    timestamp: "20:11:30",
    partyName: "Devansh & Riya Malhotra",
    partySize: 6,
    assignedTables: ["T8"],
    algorithm: "A* Search + Rule R3 VIP",
    fScore: 0.5,
    bayesianProb: 1,
    rulesApplied: [
      "Zone Match: VIP Lounge",
      "R3: Wait > 10m \u2192 Saffron Masala Papad & Welcome Drink"
    ],
    justification: "Matched exact 6-top VIP Salon T8 (0 wasted seats) and dispatched Rule R3 lounge welcome drink without bumping R1 bookings."
  },
  {
    id: "xai-demo-5",
    timestamp: "20:04:15",
    partyName: "Ananya Kapoor",
    partySize: 2,
    assignedTables: ["T1"],
    algorithm: "Forward-Chaining + Bayesian Pre-Alloc",
    fScore: 1.2,
    bayesianProb: 0.96,
    rulesApplied: ["Zone Match: Window", "Allergen Audit: Nut-Free Verified"],
    justification: "Assigned 2-top Window bay T1 for 21:30 turnover (0 wasted seats) and attached strict tree-nut exclusion ticket."
  },
  {
    id: "xai-demo-6",
    timestamp: "19:48:20",
    partyName: "Mehta Quartet",
    partySize: 4,
    assignedTables: ["T5"],
    algorithm: "Bayesian Turnover Monitor",
    fScore: 0.5,
    bayesianProb: 0.88,
    rulesApplied: ["Zone Match: Window", "P(Free10) >= 75% Pre-Alloc Ready"],
    justification: "Billing stage reached 52m elapsed time; Bayesian model forecasts release inside 10 minutes with 88% confidence."
  }
];
async function insertDemoData(client) {
  const counts = {
    ingredients: 0,
    waiting_queue: 0,
    reservations: 0,
    kitchen_orders: 0,
    agent_events: 0,
    xai_audit_logs: 0
  };
  for (const ing of DEMO_INGREDIENTS) {
    const r = await client.query(
      `INSERT INTO ingredients (id, name, unit, stock, par_level, per_order_highlight)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
      [ing.id, ing.name, ing.unit, ing.stock, ing.parLevel, ing.perOrderHighlight]
    );
    counts.ingredients += r.rowCount ?? 0;
  }
  for (const p of DEMO_QUEUE) {
    const r = await client.query(
      `INSERT INTO waiting_queue (
        id, name, size, is_vip, needs_wheelchair, preferred_zone,
        dietary_notes, wait_mins, status, booking_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        p.id,
        p.name,
        p.size,
        p.isVip,
        p.needsWheelchair,
        p.preferredZone,
        p.dietaryNotes ?? "",
        p.waitMins,
        p.status,
        p.bookingId ?? null
      ]
    );
    counts.waiting_queue += r.rowCount ?? 0;
  }
  for (const rsv of DEMO_RESERVATIONS) {
    const r = await client.query(
      `INSERT INTO reservations (
        booking_id, guest_name, email, phone, date_time, party_size,
        preferred_zone, needs_wheelchair, is_vip, special_requests, status,
        assigned_table_ids, qr_pass_code, triggered_rules,
        bayesian_confidence_pct, f_score, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14::jsonb,$15,$16,$17)
      ON CONFLICT (booking_id) DO NOTHING`,
      [
        rsv.bookingId,
        rsv.guestName,
        rsv.email,
        rsv.phone,
        rsv.dateTime,
        rsv.partySize,
        rsv.preferredZone,
        rsv.needsWheelchair,
        rsv.isVip,
        rsv.specialRequests,
        rsv.status,
        JSON.stringify(rsv.assignedTableIds),
        rsv.qrPassCode,
        JSON.stringify(rsv.triggeredRules),
        rsv.bayesianConfidencePct,
        rsv.fScore,
        rsv.createdAt
      ]
    );
    counts.reservations += r.rowCount ?? 0;
  }
  for (const ord of DEMO_ORDERS) {
    const r = await client.query(
      `INSERT INTO kitchen_orders (
        order_id, table_id, booking_id, items, total_amount,
        prep_time_mins, status, dispatched_agent_id, created_at
      ) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9)
      ON CONFLICT (order_id) DO NOTHING`,
      [
        ord.orderId,
        ord.tableId,
        ord.bookingId,
        JSON.stringify(ord.items),
        ord.totalAmount,
        ord.prepTimeMins,
        ord.status,
        ord.dispatchedAgentId,
        ord.createdAt
      ]
    );
    counts.kitchen_orders += r.rowCount ?? 0;
  }
  for (const evt of DEMO_AGENT_EVENTS) {
    const r = await client.query(
      `INSERT INTO agent_events (
        id, tick, timestamp, agent_id, agent_name, agent_type,
        utility_score, target_table_id, message
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO NOTHING`,
      [
        evt.id,
        evt.tick,
        evt.timestamp,
        evt.agentId,
        evt.agentName,
        evt.agentType,
        evt.utilityScore,
        evt.targetTableId,
        evt.message
      ]
    );
    counts.agent_events += r.rowCount ?? 0;
  }
  for (const log of DEMO_XAI_LOGS) {
    const r = await client.query(
      `INSERT INTO xai_audit_logs (
        id, timestamp, party_name, party_size, assigned_tables,
        algorithm, f_score, bayesian_prob, rules_applied, justification
      ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        log.id,
        log.timestamp,
        log.partyName,
        log.partySize,
        JSON.stringify(log.assignedTables),
        log.algorithm,
        log.fScore,
        log.bayesianProb,
        JSON.stringify(log.rulesApplied),
        log.justification
      ]
    );
    counts.xai_audit_logs += r.rowCount ?? 0;
  }
  return counts;
}

// backend/db/neon.ts
var pool = null;
var schemaReadyPromise = null;
function getDbPool() {
  const connStr = process.env.DATABASE_URL?.trim();
  if (!connStr) return null;
  if (!pool) {
    pool = new import_pg.Pool({
      connectionString: connStr,
      max: 10,
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 8e3,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}
async function withTransaction(fn) {
  const db = getDbPool();
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => void 0);
    throw err;
  } finally {
    client.release();
  }
}
async function seedInitialData(client) {
  for (const t of INITIAL_TABLES) {
    await client.query(
      `INSERT INTO restaurant_tables (
        id, label, capacity, zone, is_accessible, is_vip_booth, combinable_with,
        status, current_course, elapsed_mins, assigned_party_id, assigned_party_name,
        assigned_party_size, active_booking_id, grid_col, grid_row
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (id) DO NOTHING`,
      [
        t.id,
        t.label,
        t.capacity,
        t.zone,
        t.isAccessible,
        t.isVipBooth,
        t.combinableWith,
        t.status,
        t.currentCourse,
        t.elapsedMins,
        t.assignedPartyId,
        t.assignedPartyName,
        t.assignedPartySize,
        t.activeBookingId ?? null,
        t.gridCol,
        t.gridRow
      ]
    );
  }
  for (const p of INITIAL_QUEUE) {
    await client.query(
      `INSERT INTO waiting_queue (
        id, name, size, is_vip, needs_wheelchair, preferred_zone,
        dietary_notes, wait_mins, status, booking_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        p.id,
        p.name,
        p.size,
        p.isVip,
        p.needsWheelchair,
        p.preferredZone,
        p.dietaryNotes ?? "",
        p.waitMins,
        p.status,
        p.bookingId ?? null
      ]
    );
  }
  for (const r of INITIAL_RESERVATIONS) {
    await client.query(
      `INSERT INTO reservations (
        booking_id, guest_name, email, phone, date_time, party_size,
        preferred_zone, needs_wheelchair, is_vip, special_requests, status,
        assigned_table_ids, qr_pass_code, triggered_rules,
        bayesian_confidence_pct, f_score, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14::jsonb,$15,$16,$17)
      ON CONFLICT (booking_id) DO NOTHING`,
      [
        r.bookingId,
        r.guestName,
        r.email,
        r.phone,
        r.dateTime,
        r.partySize,
        r.preferredZone,
        r.needsWheelchair,
        r.isVip,
        r.specialRequests,
        r.status,
        JSON.stringify(r.assignedTableIds),
        r.qrPassCode,
        JSON.stringify(r.triggeredRules),
        r.bayesianConfidencePct,
        r.fScore,
        r.createdAt
      ]
    );
  }
  for (const ing of INITIAL_INGREDIENTS) {
    await client.query(
      `INSERT INTO ingredients (
        id, name, unit, stock, par_level, per_order_highlight
      ) VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id) DO NOTHING`,
      [
        ing.id,
        ing.name,
        ing.unit,
        ing.stock,
        ing.parLevel,
        ing.perOrderHighlight
      ]
    );
  }
  for (const dish of MENU_DISHES) {
    await client.query(
      `INSERT INTO menu_dishes (
        id, name, category, description, price, prep_mins,
        dietary_tags, is_veg, image, recipe, substitute_dish_ids
      ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10::jsonb,$11::jsonb)
      ON CONFLICT (id) DO UPDATE SET image = EXCLUDED.image`,
      [
        dish.id,
        dish.name,
        dish.category,
        dish.description,
        dish.price,
        dish.prepMins,
        JSON.stringify(dish.dietaryTags),
        dish.isVeg,
        dish.image,
        JSON.stringify(dish.recipe),
        JSON.stringify(dish.substituteDishIds)
      ]
    );
  }
  for (const ord of INITIAL_ORDERS) {
    await client.query(
      `INSERT INTO kitchen_orders (
        order_id, table_id, booking_id, items, total_amount,
        prep_time_mins, status, dispatched_agent_id, created_at
      ) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9)
      ON CONFLICT (order_id) DO NOTHING`,
      [
        ord.orderId,
        ord.tableId,
        ord.bookingId,
        JSON.stringify(ord.items),
        ord.totalAmount,
        ord.prepTimeMins,
        ord.status,
        ord.dispatchedAgentId,
        ord.createdAt
      ]
    );
  }
  for (const w of INITIAL_WAITERS) {
    await client.query(
      `INSERT INTO waiter_agents (
        id, name, role, zone, current_action, target_table_id,
        energy_pct, utility_score, utility_breakdown, tasks_completed
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        w.id,
        w.name,
        w.role,
        w.zone,
        w.currentAction,
        w.targetTableId,
        w.energyPct,
        w.utilityScore,
        JSON.stringify(w.utilityBreakdown),
        w.tasksCompleted
      ]
    );
  }
  for (const evt of INITIAL_AGENT_EVENTS) {
    await client.query(
      `INSERT INTO agent_events (
        id, tick, timestamp, agent_id, agent_name, agent_type,
        utility_score, target_table_id, message
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO NOTHING`,
      [
        evt.id,
        evt.tick,
        evt.timestamp,
        evt.agentId,
        evt.agentName,
        evt.agentType,
        evt.utilityScore,
        evt.targetTableId,
        evt.message
      ]
    );
  }
  for (const log of INITIAL_XAI_LOGS) {
    await client.query(
      `INSERT INTO xai_audit_logs (
        id, timestamp, party_name, party_size, assigned_tables,
        algorithm, f_score, bayesian_prob, rules_applied, justification
      ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        log.id,
        log.timestamp,
        log.partyName,
        log.partySize,
        JSON.stringify(log.assignedTables),
        log.algorithm,
        log.fScore,
        log.bayesianProb,
        JSON.stringify(log.rulesApplied),
        log.justification
      ]
    );
  }
  await insertDemoData(client);
}
async function ensureSchemaAndSeed() {
  if (schemaReadyPromise) return schemaReadyPromise;
  schemaReadyPromise = (async () => {
    const db = getDbPool();
    if (!db) return false;
    try {
      await withTransaction(async (client) => {
        await client.query(SCHEMA_SQL);
        const { rows } = await client.query(
          "SELECT COUNT(*)::text AS count FROM restaurant_tables"
        );
        const count = Number(rows[0]?.count ?? "0");
        if (count === 0) {
          await seedInitialData(client);
        } else {
          const { rows: dishRows } = await client.query(
            "SELECT COUNT(*)::text AS count FROM menu_dishes"
          );
          if (Number(dishRows[0]?.count ?? "0") === 0) {
            await seedInitialData(client);
          }
        }
      });
      return true;
    } catch (err) {
      console.error("NeonDB initialization failed:", err);
      schemaReadyPromise = null;
      return false;
    }
  })();
  return schemaReadyPromise;
}
async function checkDbHealth() {
  const db = getDbPool();
  if (!db) {
    return { connected: false, latencyMs: 0, error: "DATABASE_URL not set" };
  }
  const t0 = performance.now();
  try {
    await db.query("SELECT 1");
    return {
      connected: true,
      latencyMs: Math.max(1, Math.round(performance.now() - t0))
    };
  } catch (err) {
    return {
      connected: false,
      latencyMs: 0,
      error: err instanceof Error ? err.message : "Connection failed"
    };
  }
}
function mapTableRow(row) {
  return {
    id: String(row.id),
    label: String(row.label),
    capacity: Number(row.capacity),
    zone: row.zone,
    isAccessible: Boolean(row.is_accessible),
    isVipBooth: Boolean(row.is_vip_booth),
    combinableWith: row.combinable_with ? String(row.combinable_with) : null,
    status: row.status,
    currentCourse: row.current_course,
    elapsedMins: Number(row.elapsed_mins),
    assignedPartyId: row.assigned_party_id ? String(row.assigned_party_id) : null,
    assignedPartyName: row.assigned_party_name ? String(row.assigned_party_name) : null,
    assignedPartySize: row.assigned_party_size !== null && row.assigned_party_size !== void 0 ? Number(row.assigned_party_size) : null,
    activeBookingId: row.active_booking_id ? String(row.active_booking_id) : null,
    gridCol: Number(row.grid_col),
    gridRow: Number(row.grid_row)
  };
}
function mapQueueRow(row) {
  return {
    id: String(row.id),
    name: String(row.name),
    size: Number(row.size),
    isVip: Boolean(row.is_vip),
    needsWheelchair: Boolean(row.needs_wheelchair),
    preferredZone: row.preferred_zone,
    dietaryNotes: row.dietary_notes ? String(row.dietary_notes) : "",
    waitMins: Number(row.wait_mins),
    status: row.status,
    bookingId: row.booking_id ? String(row.booking_id) : void 0
  };
}
function mapReservationRow(row) {
  return {
    bookingId: String(row.booking_id),
    guestName: String(row.guest_name),
    email: String(row.email),
    phone: String(row.phone),
    dateTime: String(row.date_time),
    partySize: Number(row.party_size),
    preferredZone: row.preferred_zone,
    needsWheelchair: Boolean(row.needs_wheelchair),
    isVip: Boolean(row.is_vip),
    specialRequests: String(row.special_requests ?? ""),
    status: row.status,
    assignedTableIds: Array.isArray(row.assigned_table_ids) ? row.assigned_table_ids : [],
    qrPassCode: String(row.qr_pass_code),
    triggeredRules: Array.isArray(row.triggered_rules) ? row.triggered_rules : [],
    bayesianConfidencePct: Number(row.bayesian_confidence_pct),
    fScore: Number(row.f_score),
    createdAt: String(row.created_at)
  };
}
function mapIngredientRow(row) {
  return {
    id: String(row.id),
    name: String(row.name),
    unit: row.unit,
    stock: Number(row.stock),
    parLevel: Number(row.par_level),
    perOrderHighlight: String(row.per_order_highlight)
  };
}
function mapDishRow(row) {
  return {
    id: String(row.id),
    name: String(row.name),
    category: row.category,
    description: String(row.description),
    price: Number(row.price),
    prepMins: Number(row.prep_mins),
    dietaryTags: Array.isArray(row.dietary_tags) ? row.dietary_tags : [],
    isVeg: Boolean(row.is_veg),
    image: String(row.image),
    recipe: Array.isArray(row.recipe) ? row.recipe : [],
    substituteDishIds: Array.isArray(row.substitute_dish_ids) ? row.substitute_dish_ids : []
  };
}
function mapOrderRow(row) {
  return {
    orderId: String(row.order_id),
    tableId: String(row.table_id),
    bookingId: row.booking_id ? String(row.booking_id) : null,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount),
    prepTimeMins: Number(row.prep_time_mins),
    status: row.status,
    dispatchedAgentId: String(row.dispatched_agent_id),
    createdAt: String(row.created_at)
  };
}
function mapWaiterRow(row) {
  return {
    id: String(row.id),
    name: String(row.name),
    role: row.role,
    zone: row.zone,
    currentAction: row.current_action,
    targetTableId: row.target_table_id ? String(row.target_table_id) : null,
    energyPct: Number(row.energy_pct),
    utilityScore: Number(row.utility_score),
    utilityBreakdown: row.utility_breakdown ?? {
      urgency: 0,
      vipBonus: 0,
      distancePenalty: 0,
      loadPenalty: 0,
      totalUtility: 0
    },
    tasksCompleted: Number(row.tasks_completed)
  };
}
function mapEventRow(row) {
  return {
    id: String(row.id),
    tick: Number(row.tick),
    timestamp: String(row.timestamp),
    agentId: String(row.agent_id),
    agentName: String(row.agent_name),
    agentType: row.agent_type,
    utilityScore: row.utility_score !== null && row.utility_score !== void 0 ? Number(row.utility_score) : null,
    targetTableId: row.target_table_id ? String(row.target_table_id) : null,
    message: String(row.message)
  };
}
function mapXaiRow(row) {
  return {
    id: String(row.id),
    timestamp: String(row.timestamp),
    partyName: String(row.party_name),
    partySize: Number(row.party_size),
    assignedTables: Array.isArray(row.assigned_tables) ? row.assigned_tables : [],
    algorithm: String(row.algorithm),
    fScore: Number(row.f_score),
    bayesianProb: Number(row.bayesian_prob),
    rulesApplied: Array.isArray(row.rules_applied) ? row.rules_applied : [],
    justification: String(row.justification)
  };
}
async function fetchFullFloorSnapshot() {
  const ready = await ensureSchemaAndSeed();
  const db = getDbPool();
  if (!ready || !db) return null;
  const t0 = performance.now();
  const [
    tablesRes,
    queueRes,
    resRes,
    ingRes,
    dishRes,
    ordRes,
    waiterRes,
    evtRes,
    xaiRes
  ] = await Promise.all([
    db.query(
      `SELECT * FROM restaurant_tables ORDER BY COALESCE(NULLIF(regexp_replace(id, '[^0-9]', '', 'g'), ''), '0')::int ASC`
    ),
    db.query(`SELECT * FROM waiting_queue ORDER BY created_ts DESC`),
    db.query(`SELECT * FROM reservations ORDER BY created_ts DESC`),
    db.query(`SELECT * FROM ingredients ORDER BY id ASC`),
    db.query(`SELECT * FROM menu_dishes ORDER BY id ASC`),
    db.query(`SELECT * FROM kitchen_orders ORDER BY created_ts DESC`),
    db.query(`SELECT * FROM waiter_agents ORDER BY id ASC`),
    db.query(`SELECT * FROM agent_events ORDER BY created_ts DESC LIMIT 32`),
    db.query(`SELECT * FROM xai_audit_logs ORDER BY created_ts DESC LIMIT 32`)
  ]);
  return {
    dbConnected: true,
    dbLatencyMs: Math.max(1, Math.round(performance.now() - t0)),
    tables: tablesRes.rows.map(mapTableRow),
    queue: queueRes.rows.map(mapQueueRow),
    reservations: resRes.rows.map(mapReservationRow),
    ingredients: ingRes.rows.map(mapIngredientRow),
    menuDishes: dishRes.rows.map(mapDishRow),
    orders: ordRes.rows.map(mapOrderRow),
    waiters: waiterRes.rows.map(mapWaiterRow),
    events: evtRes.rows.map(mapEventRow),
    xaiLogs: xaiRes.rows.map(mapXaiRow)
  };
}
async function persistBookingTransaction(params) {
  await withTransaction(async (client) => {
    const { reservation: r, party: p, xaiLog: x, agentEvent: e } = params;
    await client.query(
      `INSERT INTO reservations (
        booking_id, guest_name, email, phone, date_time, party_size,
        preferred_zone, needs_wheelchair, is_vip, special_requests, status,
        assigned_table_ids, qr_pass_code, triggered_rules,
        bayesian_confidence_pct, f_score, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14::jsonb,$15,$16,$17)`,
      [
        r.bookingId,
        r.guestName,
        r.email,
        r.phone,
        r.dateTime,
        r.partySize,
        r.preferredZone,
        r.needsWheelchair,
        r.isVip,
        r.specialRequests,
        r.status,
        JSON.stringify(r.assignedTableIds),
        r.qrPassCode,
        JSON.stringify(r.triggeredRules),
        r.bayesianConfidencePct,
        r.fScore,
        r.createdAt
      ]
    );
    await client.query(
      `INSERT INTO waiting_queue (
        id, name, size, is_vip, needs_wheelchair, preferred_zone,
        dietary_notes, wait_mins, status, booking_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
      [
        p.id,
        p.name,
        p.size,
        p.isVip,
        p.needsWheelchair,
        p.preferredZone,
        p.dietaryNotes ?? "",
        p.waitMins,
        p.status,
        p.bookingId ?? null
      ]
    );
    await client.query(
      `INSERT INTO xai_audit_logs (
        id, timestamp, party_name, party_size, assigned_tables,
        algorithm, f_score, bayesian_prob, rules_applied, justification
      ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10)`,
      [
        x.id,
        x.timestamp,
        x.partyName,
        x.partySize,
        JSON.stringify(x.assignedTables),
        x.algorithm,
        x.fScore,
        x.bayesianProb,
        JSON.stringify(x.rulesApplied),
        x.justification
      ]
    );
    await client.query(
      `INSERT INTO agent_events (
        id, tick, timestamp, agent_id, agent_name, agent_type,
        utility_score, target_table_id, message
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        e.id,
        e.tick,
        e.timestamp,
        e.agentId,
        e.agentName,
        e.agentType,
        e.utilityScore,
        e.targetTableId,
        e.message
      ]
    );
  });
}
async function persistGuestArrivalTransaction(params) {
  await withTransaction(async (client) => {
    const { assignedTableIds, party, bookingId, xaiLog, agentEvent } = params;
    if (assignedTableIds.length > 0) {
      await client.query(
        `UPDATE restaurant_tables
         SET status = 'Occupied',
             current_course = 'Appetizer',
             elapsed_mins = 0,
             assigned_party_id = $1,
             assigned_party_name = $2,
             assigned_party_size = $3,
             active_booking_id = $4,
             updated_at = NOW()
         WHERE id = ANY($5::text[])`,
        [
          party.id,
          party.name,
          party.size,
          bookingId ?? "WALKIN",
          assignedTableIds
        ]
      );
    }
    await client.query(
      `UPDATE waiting_queue
       SET status = 'SEATED'
       WHERE id = $1 OR ($2::text IS NOT NULL AND booking_id = $2)`,
      [party.id, bookingId]
    );
    if (bookingId) {
      await client.query(
        `UPDATE reservations
         SET status = 'SEATED',
             assigned_table_ids = $2::jsonb
         WHERE booking_id = $1`,
        [bookingId, JSON.stringify(assignedTableIds)]
      );
    }
    await client.query(
      `INSERT INTO xai_audit_logs (
        id, timestamp, party_name, party_size, assigned_tables,
        algorithm, f_score, bayesian_prob, rules_applied, justification
      ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10)`,
      [
        xaiLog.id,
        xaiLog.timestamp,
        xaiLog.partyName,
        xaiLog.partySize,
        JSON.stringify(xaiLog.assignedTables),
        xaiLog.algorithm,
        xaiLog.fScore,
        xaiLog.bayesianProb,
        JSON.stringify(xaiLog.rulesApplied),
        xaiLog.justification
      ]
    );
    await client.query(
      `INSERT INTO agent_events (
        id, tick, timestamp, agent_id, agent_name, agent_type,
        utility_score, target_table_id, message
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        agentEvent.id,
        agentEvent.tick,
        agentEvent.timestamp,
        agentEvent.agentId,
        agentEvent.agentName,
        agentEvent.agentType,
        agentEvent.utilityScore,
        agentEvent.targetTableId,
        agentEvent.message
      ]
    );
  });
}
async function persistOrderAndInventoryTransaction(params) {
  await withTransaction(async (client) => {
    for (const ing of params.updatedIngredients) {
      await client.query(
        `UPDATE ingredients SET stock = $2, updated_at = NOW() WHERE id = $1`,
        [ing.id, ing.stock]
      );
    }
    const o = params.order;
    await client.query(
      `INSERT INTO kitchen_orders (
        order_id, table_id, booking_id, items, total_amount,
        prep_time_mins, status, dispatched_agent_id, created_at
      ) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9)`,
      [
        o.orderId,
        o.tableId,
        o.bookingId,
        JSON.stringify(o.items),
        o.totalAmount,
        o.prepTimeMins,
        o.status,
        o.dispatchedAgentId,
        o.createdAt
      ]
    );
    await client.query(
      `UPDATE waiter_agents
       SET current_action = 'ServeOrder',
           target_table_id = $2,
           tasks_completed = tasks_completed + 1
       WHERE id = $1`,
      [params.waiterId, o.tableId]
    );
    const e = params.agentEvent;
    await client.query(
      `INSERT INTO agent_events (
        id, tick, timestamp, agent_id, agent_name, agent_type,
        utility_score, target_table_id, message
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        e.id,
        e.tick,
        e.timestamp,
        e.agentId,
        e.agentName,
        e.agentType,
        e.utilityScore,
        e.targetTableId,
        e.message
      ]
    );
  });
}
async function persistTableStateUpdate(params) {
  const db = getDbPool();
  if (!db) return null;
  const { rows } = await db.query(
    `UPDATE restaurant_tables
     SET status = $2,
         current_course = $3,
         elapsed_mins = $4,
         assigned_party_id = CASE WHEN $5 THEN NULL ELSE assigned_party_id END,
         assigned_party_name = CASE WHEN $5 THEN NULL ELSE assigned_party_name END,
         assigned_party_size = CASE WHEN $5 THEN NULL ELSE assigned_party_size END,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      params.tableId,
      params.status,
      params.currentCourse,
      params.elapsedMins,
      params.clearParty
    ]
  );
  return rows[0] ? mapTableRow(rows[0]) : null;
}
async function persistIngredientStockUpdate(ingredientId, stock) {
  const db = getDbPool();
  if (!db) return null;
  const { rows } = await db.query(
    `UPDATE ingredients SET stock = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [ingredientId, Math.max(0, Math.round(stock))]
  );
  return rows[0] ? mapIngredientRow(rows[0]) : null;
}
async function persistOrderStatusAdvance(orderId, nextStatus) {
  const db = getDbPool();
  if (!db) return null;
  const { rows } = await db.query(
    `UPDATE kitchen_orders SET status = $2 WHERE order_id = $1 RETURNING *`,
    [orderId, nextStatus]
  );
  return rows[0] ? mapOrderRow(rows[0]) : null;
}
async function persistSimulationStep(params) {
  await withTransaction(async (client) => {
    for (const t of params.tables) {
      await client.query(
        `UPDATE restaurant_tables
         SET status = $2,
             current_course = $3,
             elapsed_mins = $4,
             assigned_party_id = $5,
             assigned_party_name = $6,
             assigned_party_size = $7,
             updated_at = NOW()
         WHERE id = $1`,
        [
          t.id,
          t.status,
          t.currentCourse,
          t.elapsedMins,
          t.assignedPartyId,
          t.assignedPartyName,
          t.assignedPartySize
        ]
      );
    }
    for (const p of params.queue) {
      await client.query(
        `UPDATE waiting_queue SET wait_mins = $2, status = $3 WHERE id = $1`,
        [p.id, p.waitMins, p.status]
      );
    }
    for (const w of params.waiters) {
      await client.query(
        `UPDATE waiter_agents
         SET current_action = $2,
             target_table_id = $3,
             energy_pct = $4,
             utility_score = $5,
             utility_breakdown = $6::jsonb,
             tasks_completed = $7
         WHERE id = $1`,
        [
          w.id,
          w.currentAction,
          w.targetTableId,
          w.energyPct,
          w.utilityScore,
          JSON.stringify(w.utilityBreakdown),
          w.tasksCompleted
        ]
      );
    }
    await client.query(
      `UPDATE kitchen_orders
       SET status = CASE
         WHEN status = 'Order Received' THEN 'Preparing'
         WHEN status = 'Preparing' THEN 'Waiter En Route'
         ELSE status
       END`
    );
    for (const e of params.newEvents) {
      await client.query(
        `INSERT INTO agent_events (
          id, tick, timestamp, agent_id, agent_name, agent_type,
          utility_score, target_table_id, message
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO NOTHING`,
        [
          e.id,
          e.tick,
          e.timestamp,
          e.agentId,
          e.agentName,
          e.agentType,
          e.utilityScore,
          e.targetTableId,
          e.message
        ]
      );
    }
  });
}
async function resetNeonFloorToSeed() {
  const ready = await ensureSchemaAndSeed();
  if (!ready) return null;
  await withTransaction(async (client) => {
    await client.query("DELETE FROM kitchen_orders");
    await client.query("DELETE FROM xai_audit_logs");
    await client.query("DELETE FROM agent_events");
    await client.query("DELETE FROM reservations");
    await client.query("DELETE FROM waiting_queue");
    await client.query("DELETE FROM waiter_agents");
    await client.query("DELETE FROM ingredients");
    await client.query("DELETE FROM menu_dishes");
    await client.query("DELETE FROM restaurant_tables");
    await seedInitialData(client);
  });
  return fetchFullFloorSnapshot();
}
async function seedDemoDataInDb() {
  const ready = await ensureSchemaAndSeed();
  if (!ready) {
    return { ok: false, insertedCounts: {} };
  }
  const insertedCounts = await withTransaction(
    async (client) => insertDemoData(client)
  );
  return { ok: true, insertedCounts };
}

// backend/app.ts
function nowTimeString() {
  const now = /* @__PURE__ */ new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}
function isGroqConfigured() {
  const key = (process.env.GROQ_API_KEY ?? "").trim();
  return Boolean(key && key !== "YOUR_GROQ_API_KEY" && key !== "MY_GROQ_API_KEY");
}
function parseGroqJsonContent(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const braceStart = cleaned.indexOf("{");
    const braceEnd = cleaned.lastIndexOf("}");
    if (braceStart !== -1 && braceEnd > braceStart) {
      try {
        return JSON.parse(cleaned.slice(braceStart, braceEnd + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}
function createApiApp() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json({ limit: "1mb" }));
  app.use("/api", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });
  app.get("/api/health", async (_req, res) => {
    await ensureSchemaAndSeed().catch(() => false);
    const health = await checkDbHealth();
    res.json({
      ok: true,
      service: "khana-khazana-dual-portal",
      dbConnected: health.connected,
      dbLatencyMs: health.latencyMs,
      database: "neondb",
      groqConfigured: isGroqConfigured(),
      groqModel: "openai/gpt-oss-120b"
    });
  });
  app.get("/api/floor/state", async (_req, res) => {
    try {
      const snap = await fetchFullFloorSnapshot();
      if (!snap) {
        res.status(503).json({
          ok: false,
          error: "NeonDB connection unavailable."
        });
        return;
      }
      res.json({ ok: true, ...snap });
    } catch (err) {
      console.error("[/api/floor/state] Error:", err);
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch floor state"
      });
    }
  });
  app.post("/api/bookings/validate", async (req, res) => {
    const t0 = performance.now();
    const body = req.body ?? {};
    if (!body.request) {
      res.status(400).json({ error: "Invalid booking validation payload." });
      return;
    }
    try {
      const snap = await fetchFullFloorSnapshot();
      const liveTables = snap?.tables ?? (Array.isArray(body.tables) && body.tables.length > 0 ? body.tables : INITIAL_TABLES);
      const liveReservations = snap?.reservations ?? (Array.isArray(body.reservations) ? body.reservations : INITIAL_RESERVATIONS);
      const result = validateBookingWorkflow(
        body.request,
        liveTables,
        liveReservations
      );
      let persistedToDb = false;
      if (result.fulfillable && result.reservation) {
        const rec = result.reservation;
        const newParty = {
          id: `P-${rec.bookingId.replace("KK-", "")}`,
          name: rec.guestName,
          size: rec.partySize,
          isVip: rec.isVip,
          needsWheelchair: rec.needsWheelchair,
          preferredZone: rec.preferredZone,
          dietaryNotes: rec.specialRequests,
          waitMins: rec.isVip ? 11 : 2,
          status: "WAITING",
          bookingId: rec.bookingId
        };
        const newXaiLog = {
          id: `xai-${Date.now()}`,
          timestamp: rec.createdAt,
          partyName: rec.guestName,
          partySize: rec.partySize,
          assignedTables: rec.assignedTableIds,
          algorithm: "Forward-Chaining + NeonDB Lock",
          fScore: rec.fScore,
          bayesianProb: rec.bayesianConfidencePct / 100,
          rulesApplied: rec.triggeredRules,
          justification: `Booked ${rec.assignedTableIds.join(
            " + "
          )} (${rec.bookingId}) with email confirmation sent to ${rec.email}.`
        };
        const newEvent = {
          id: `evt-bk-${Date.now()}`,
          tick: 0,
          timestamp: rec.createdAt,
          agentId: "Host-01",
          agentName: "Host-01 \xB7 Concierge",
          agentType: "Host (Goal-Based)",
          utilityScore: 0.97,
          targetTableId: rec.assignedTableIds[0] ?? null,
          message: `Workflow A locked ${rec.assignedTableIds.join(
            " + "
          )} for ${rec.guestName} (${rec.bookingId}) in NeonDB.`
        };
        if (snap) {
          await persistBookingTransaction({
            reservation: rec,
            party: newParty,
            xaiLog: newXaiLog,
            agentEvent: newEvent
          });
          persistedToDb = true;
        }
      }
      res.json({
        ...result,
        persistedToDb,
        responseTimeMs: Math.max(25, Math.round(performance.now() - t0))
      });
    } catch (err) {
      console.error("[/api/bookings/validate] Error:", err);
      res.status(500).json({
        error: err instanceof Error ? err.message : "Booking validation failed"
      });
    }
  });
  app.post("/api/bookings/check-in", async (req, res) => {
    const t0 = performance.now();
    const body = req.body ?? {};
    if (!body.bookingIdOrPartyId) {
      res.status(400).json({ error: "bookingIdOrPartyId is required." });
      return;
    }
    try {
      const snap = await fetchFullFloorSnapshot();
      if (!snap) {
        res.status(503).json({ error: "NeonDB connection unavailable." });
        return;
      }
      const idOrBooking = body.bookingIdOrPartyId;
      const matchedParty = snap.queue.find(
        (p) => (p.id === idOrBooking || p.bookingId === idOrBooking) && p.status === "WAITING"
      );
      const matchedRes = snap.reservations.find(
        (r) => r.bookingId === idOrBooking
      );
      const targetParty = matchedParty ?? (matchedRes ? {
        id: `P-${matchedRes.bookingId.replace("KK-", "")}`,
        name: matchedRes.guestName,
        size: matchedRes.partySize,
        isVip: matchedRes.isVip,
        needsWheelchair: matchedRes.needsWheelchair,
        preferredZone: matchedRes.preferredZone,
        dietaryNotes: matchedRes.specialRequests,
        waitMins: 0,
        status: "WAITING",
        bookingId: matchedRes.bookingId
      } : null);
      if (!targetParty) {
        res.status(404).json({ error: "Party or reservation not found." });
        return;
      }
      const remaining = Math.max(
        0,
        snap.queue.filter((p) => p.status === "WAITING").length - 1
      );
      const allocation = runAStarAllocation(
        snap.tables,
        targetParty,
        remaining,
        body.weights
      );
      const ts = nowTimeString();
      const responseTimeMs = Math.max(25, Math.round(performance.now() - t0));
      const xaiLog = {
        id: `xai-arr-${Date.now()}`,
        timestamp: ts,
        partyName: targetParty.name,
        partySize: targetParty.size,
        assignedTables: allocation.assignedTableIds.length > 0 ? allocation.assignedTableIds : ["Waitlist"],
        algorithm: "A* Check-In Dispatch",
        fScore: allocation.fScore,
        bayesianProb: allocation.bayesianProb,
        rulesApplied: allocation.triggeredRules.length > 0 ? allocation.triggeredRules : ["Minimal Waste Heuristic"],
        justification: allocation.explanation
      };
      const agentEvent = {
        id: `evt-arr-${Date.now()}`,
        tick: 0,
        timestamp: ts,
        agentId: "Host-01",
        agentName: "Host-01 \xB7 Concierge",
        agentType: "Host (Goal-Based)",
        utilityScore: 0.98,
        targetTableId: allocation.assignedTableIds[0] ?? null,
        message: `Guest Arrived (${targetParty.name}) \u2192 A* assigned ${allocation.assignedTableIds.join(
          " + "
        )} & synced NeonDB (${responseTimeMs}ms).`
      };
      if (allocation.success) {
        await persistGuestArrivalTransaction({
          assignedTableIds: allocation.assignedTableIds,
          party: targetParty,
          bookingId: targetParty.bookingId ?? matchedRes?.bookingId ?? null,
          xaiLog,
          agentEvent
        });
      }
      res.json({
        allocation,
        responseTimeMs,
        persistedToDb: allocation.success,
        xaiLog,
        agentEvent
      });
    } catch (err) {
      console.error("[/api/bookings/check-in] Error:", err);
      res.status(500).json({
        error: err instanceof Error ? err.message : "Check-in failed"
      });
    }
  });
  app.post("/api/orders/validate-ingredients", async (req, res) => {
    const t0 = performance.now();
    const body = req.body ?? {};
    if (!body.request) {
      res.status(400).json({ error: "Invalid order inventory payload." });
      return;
    }
    try {
      const snap = await fetchFullFloorSnapshot();
      const liveDishes = snap?.menuDishes && snap.menuDishes.length > 0 ? snap.menuDishes : Array.isArray(body.menuDishes) && body.menuDishes.length > 0 ? body.menuDishes : MENU_DISHES;
      const liveIngredients = snap?.ingredients ?? (Array.isArray(body.ingredients) && body.ingredients.length > 0 ? body.ingredients : INITIAL_INGREDIENTS);
      const result = validateOrderIngredientsWorkflow(
        body.request,
        liveDishes,
        liveIngredients
      );
      if (result.ok && result.order && result.updatedIngredients && snap) {
        const tbl = snap.tables.find((t) => t.id === body.request.tableId);
        const matchingWaiter = snap.waiters.find(
          (w) => w.role === "Waiter (Utility-Based)" && w.zone === tbl?.zone
        ) ?? snap.waiters[0];
        result.order.dispatchedAgentId = matchingWaiter?.id ?? "W1";
        const responseTimeMs = Math.max(25, Math.round(performance.now() - t0));
        const agentEvent = {
          id: `evt-ord-${Date.now()}`,
          tick: 0,
          timestamp: result.order.createdAt,
          agentId: matchingWaiter?.id ?? "W1",
          agentName: matchingWaiter?.name ?? "W1 \xB7 Arjun",
          agentType: "Waiter (Utility-Based)",
          utilityScore: 0.95,
          targetTableId: body.request.tableId,
          message: `QR Order ${result.order.orderId} committed atomically in NeonDB (${responseTimeMs}ms) \u2192 Dispatched to ${matchingWaiter?.name ?? "Waiter"} for ${body.request.tableId}.`
        };
        await persistOrderAndInventoryTransaction({
          order: result.order,
          updatedIngredients: result.updatedIngredients,
          waiterId: matchingWaiter?.id ?? "W1",
          agentEvent
        });
        res.json({
          ...result,
          persistedToDb: true,
          responseTimeMs,
          agentEvent
        });
        return;
      }
      res.json({
        ...result,
        persistedToDb: false,
        responseTimeMs: Math.max(20, Math.round(performance.now() - t0))
      });
    } catch (err) {
      console.error("[/api/orders/validate-ingredients] Error:", err);
      res.status(500).json({
        error: err instanceof Error ? err.message : "Order validation failed"
      });
    }
  });
  app.patch("/api/orders/:orderId/advance", async (req, res) => {
    try {
      const snap = await fetchFullFloorSnapshot();
      const target = snap?.orders.find((o) => o.orderId === req.params.orderId);
      if (!target) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      const nextStatus = target.status === "Order Received" ? "Preparing" : target.status === "Preparing" ? "Waiter En Route" : "Waiter En Route";
      const updated = await persistOrderStatusAdvance(
        req.params.orderId,
        nextStatus
      );
      res.json({ ok: true, order: updated });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to advance order"
      });
    }
  });
  app.patch("/api/ingredients/:id", async (req, res) => {
    const body = req.body ?? {};
    if (typeof body.stock !== "number" || Number.isNaN(body.stock)) {
      res.status(400).json({ error: "Numeric stock value required." });
      return;
    }
    try {
      const updated = await persistIngredientStockUpdate(
        req.params.id,
        body.stock
      );
      if (!updated) {
        res.status(404).json({ error: "Ingredient not found." });
        return;
      }
      res.json({ ok: true, ingredient: updated });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Stock update failed"
      });
    }
  });
  app.patch("/api/tables/:id", async (req, res) => {
    const body = req.body ?? {};
    if (!body.status) {
      res.status(400).json({ error: "status is required." });
      return;
    }
    try {
      const snap = await fetchFullFloorSnapshot();
      const current = snap?.tables.find((t) => t.id === req.params.id);
      if (!current) {
        res.status(404).json({ error: "Table not found." });
        return;
      }
      const resolvedCourse = body.course ?? (body.status === "Free" || body.status === "Dirty" ? "None" : body.status === "Paying" ? "Billing" : current.currentCourse === "None" ? "Mains" : current.currentCourse);
      const clearParty = body.status === "Free" || body.status === "Dirty";
      const elapsedMins = clearParty ? 0 : body.status === "Paying" ? Math.max(50, current.elapsedMins) : current.elapsedMins;
      const updated = await persistTableStateUpdate({
        tableId: req.params.id,
        status: body.status,
        currentCourse: resolvedCourse,
        elapsedMins,
        clearParty
      });
      res.json({ ok: true, table: updated });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Table update failed"
      });
    }
  });
  app.post("/api/simulation/tick", async (req, res) => {
    const body = req.body ?? {};
    try {
      const snap = await fetchFullFloorSnapshot();
      if (!snap) {
        res.status(503).json({ error: "NeonDB connection unavailable." });
        return;
      }
      const tickCount = typeof body.tickCount === "number" ? body.tickCount : 0;
      const sim = stepMultiAgentSimulation(
        snap.tables,
        snap.queue,
        snap.waiters,
        tickCount
      );
      await persistSimulationStep(sim);
      res.json({ ok: true, ...sim });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Simulation step failed"
      });
    }
  });
  app.post("/api/floor/reset", async (_req, res) => {
    try {
      const snap = await resetNeonFloorToSeed();
      if (!snap) {
        res.status(503).json({ error: "NeonDB connection unavailable." });
        return;
      }
      res.json({ ok: true, ...snap });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Floor reset failed"
      });
    }
  });
  app.post("/api/floor/seed-demo", async (_req, res) => {
    try {
      const seedRes = await seedDemoDataInDb();
      if (!seedRes.ok) {
        res.status(503).json({ error: "NeonDB connection unavailable." });
        return;
      }
      const snap = await fetchFullFloorSnapshot();
      res.json({
        ok: true,
        insertedCounts: seedRes.insertedCounts,
        snapshot: snap
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Demo data seed failed"
      });
    }
  });
  app.post("/api/ai/allocate-table", (req, res) => {
    const body = req.body ?? {};
    if (!Array.isArray(body.tables) || !body.party) {
      res.status(400).json({ error: "Invalid table allocation payload." });
      return;
    }
    const result = runAStarAllocation(
      body.tables,
      body.party,
      typeof body.remainingQueueCount === "number" ? body.remainingQueueCount : 0,
      body.weights
    );
    res.json({ result });
  });
  async function handleGroundedAssistantRequest(body) {
    const t0 = performance.now();
    const userMessage = typeof body.message === "string" ? body.message.trim() : "";
    const portal = body.portal === "customer" ? "customer" : "admin";
    const snap = await fetchFullFloorSnapshot().catch(() => null);
    const tables = snap?.tables ?? (Array.isArray(body.tables) && body.tables.length > 0 ? body.tables : INITIAL_TABLES);
    const queue = snap?.queue ?? (Array.isArray(body.queue) && body.queue.length > 0 ? body.queue : INITIAL_QUEUE);
    const waiters = snap?.waiters ?? (Array.isArray(body.waiters) && body.waiters.length > 0 ? body.waiters : INITIAL_WAITERS);
    const ingredients = snap?.ingredients ?? (Array.isArray(body.ingredients) && body.ingredients.length > 0 ? body.ingredients : INITIAL_INGREDIENTS);
    const reservations = snap?.reservations ?? (Array.isArray(body.reservations) && body.reservations.length > 0 ? body.reservations : INITIAL_RESERVATIONS);
    if (isExplicitOutOfScopeQuery(userMessage)) {
      return {
        reply: HALLUCINATION_REFUSAL_TEXT,
        sources: ["[restaurant_policies.md]", "[live_floor_db]"],
        refusalTriggered: true,
        grounded: true,
        latencyMs: Math.max(12, Math.round(performance.now() - t0)),
        model: "openai/gpt-oss-120b",
        provider: isGroqConfigured() ? "groq" : "grounded-simulator"
      };
    }
    const groqApiKey = (process.env.GROQ_API_KEY ?? "").trim();
    if (isGroqConfigured()) {
      try {
        const ragContext = buildGroqKnowledgeContext({
          portal,
          tables,
          queue,
          waiters,
          ingredients,
          reservations
        });
        const systemPrompt = `You are the Grounded AI ${portal === "customer" ? "Concierge" : "Ma\xEEtre D'"} for Khana-Khazana ("Where Culinary Heritage Meets Autonomous Intelligence").
INSTRUCTIONS:
1. If the user greets you or asks who you are / what you can help with (e.g. "hi", "hello", "who are you"), warmly introduce yourself as the Khana-Khazana AI ${portal === "customer" ? "Concierge" : "Ma\xEEtre D'"} powered by Groq (openai/gpt-oss-120b), mention our operating hours (11:30 AM \u2013 11:30 PM), dining zones (Window, Main Hall, VIP Lounge), and invite questions about live tables, wheelchair accessibility (T3+T4), allergens, or live kitchen stock. Set "refusalTriggered": false.
2. Answer restaurant questions concisely (2-3 clear sentences) and politely using ONLY the injected Restaurant Knowledge Base and Live Floor & Kitchen State below. Cite exact table IDs (T1-T10), dish prices/allergens, or live gram/unit ingredient stock counts whenever relevant.
3. If asked about ANYTHING outside Khana-Khazana or unverified in the context below (e.g., rooftop pool, spa, hotel rooms, weather, stock market, general trivia), reply strictly verbatim with:
"${HALLUCINATION_REFUSAL_TEXT}" and set "refusalTriggered": true.
4. Always respond with a valid JSON object: {"reply": string, "sources": string[], "refusalTriggered": boolean} where "sources" uses ["[restaurant_policies.md]", "[live_floor_db]"].

${ragContext}`;
        const controller = new AbortController();
        const timeoutHandle = setTimeout(() => controller.abort(), 9e3);
        const groqResp = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-120b",
              temperature: 0.1,
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
              ]
            }),
            signal: controller.signal
          }
        ).finally(() => clearTimeout(timeoutHandle));
        if (!groqResp.ok) {
          const errText = await groqResp.text().catch(() => "");
          throw new Error(`Groq HTTP ${groqResp.status}: ${errText.slice(0, 120)}`);
        }
        const completion = await groqResp.json();
        const rawContent = completion.choices?.[0]?.message?.content?.trim() ?? "";
        const parsed = parseGroqJsonContent(rawContent);
        if (parsed?.reply && typeof parsed.reply === "string") {
          const isRefusal = Boolean(parsed.refusalTriggered) || parsed.reply.trim() === HALLUCINATION_REFUSAL_TEXT;
          return {
            reply: isRefusal ? HALLUCINATION_REFUSAL_TEXT : parsed.reply.trim(),
            sources: Array.isArray(parsed.sources) && parsed.sources.length > 0 ? parsed.sources : ["[restaurant_policies.md]", "[live_floor_db]"],
            refusalTriggered: isRefusal,
            grounded: true,
            latencyMs: Math.max(25, Math.round(performance.now() - t0)),
            model: "openai/gpt-oss-120b",
            provider: "groq"
          };
        }
        if (rawContent) {
          const isRefusal = rawContent === HALLUCINATION_REFUSAL_TEXT;
          return {
            reply: rawContent,
            sources: ["[restaurant_policies.md]", "[live_floor_db]"],
            refusalTriggered: isRefusal,
            grounded: true,
            latencyMs: Math.max(25, Math.round(performance.now() - t0)),
            model: "openai/gpt-oss-120b",
            provider: "groq"
          };
        }
      } catch (err) {
        console.warn("Groq inference failed, falling back to deterministic RAG:", err);
      }
    }
    const deterministicCheck = evaluateGroundedMaitreD(
      userMessage,
      tables,
      queue,
      waiters,
      ingredients,
      reservations
    );
    return {
      reply: deterministicCheck.reply,
      sources: deterministicCheck.sources,
      refusalTriggered: deterministicCheck.refusalTriggered,
      grounded: true,
      latencyMs: Math.max(18, Math.round(performance.now() - t0)),
      model: "openai/gpt-oss-120b",
      provider: "grounded-simulator"
    };
  }
  app.post("/api/groq/chat", async (req, res) => {
    const body = req.body ?? {};
    if (typeof body.message !== "string" || !body.message.trim()) {
      res.status(400).json({ error: "Message is required." });
      return;
    }
    const result = await handleGroundedAssistantRequest(body);
    res.json(result);
  });
  app.post("/api/maitre-d", async (req, res) => {
    const body = req.body ?? {};
    if (typeof body.message !== "string" || !body.message.trim()) {
      res.status(400).json({ error: "Message is required." });
      return;
    }
    const result = await handleGroundedAssistantRequest(body);
    res.json(result);
  });
  return app;
}

// backend/vercelHandler.ts
var cachedApp = null;
function getApp() {
  if (!cachedApp) {
    cachedApp = createApiApp();
  }
  return cachedApp;
}
function handler(req, res) {
  try {
    if (req.url) {
      const urlObj = new URL(req.url, "http://localhost");
      const rewrittenPath = urlObj.searchParams.get("__path");
      if (rewrittenPath !== null) {
        urlObj.searchParams.delete("__path");
        const qs = urlObj.searchParams.toString();
        const normalized = rewrittenPath.replace(/^\/+/, "");
        req.url = `/api/${normalized}${qs ? `?${qs}` : ""}`;
      }
    }
    const app = getApp();
    return app(
      req,
      res
    );
  } catch (err) {
    console.error("[Vercel API Handler Error]", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ok: false,
          error: err instanceof Error ? err.message : "Serverless API handler error"
        })
      );
    }
    return void 0;
  }
}
