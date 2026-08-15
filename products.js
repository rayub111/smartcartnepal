/*
  PRODUCT DATA
  ------------
  Edit this array to add your real products.

  Fields:
  - name        : product name
  - category    : one of "audio" | "smart-home" | "wearables" | "kitchen" | "fitness"
  - price       : display price string, e.g. "Rs 4,990" (keep updated manually — prices change)
  - blurb       : 1-2 sentence description
  - why         : short "why we picked it" editorial note
  - link        : YOUR AFFILIATE LINK — replace every "#REPLACE-LINK" below
  - icon        : which built-in icon to show (see script.js iconSet) — or swap for a real <img> yourself
  - pick        : true/false — shows the "Curator's Pick" ribbon
*/

const PRODUCTS = [
  {
    name: "Anker Soundcore Life Q30",
    category: "audio",
    price: "Rs 8,500",
    blurb: "Over-ear ANC headphones that punch well above their price — 40hr battery, app EQ.",
    why: "The one we recommend to anyone asking for their first \"good\" pair of headphones.",
    link: "#REPLACE-LINK-1",
    icon: "headphones",
    pick: true
  },
  {
    name: "JBL Flip 6",
    category: "audio",
    price: "Rs 12,900",
    blurb: "Rugged, waterproof bluetooth speaker with surprisingly deep bass for its size.",
    why: "Survived two monsoons and a trekking bag on our end — genuinely tough.",
    link: "#REPLACE-LINK-2",
    icon: "speaker",
    pick: false
  },
  {
    name: "Philips Hue White & Color Starter Kit",
    category: "smart-home",
    price: "Rs 14,200",
    blurb: "Three smart bulbs + hub. Millions of colors, scheduling, voice control.",
    why: "Still the most reliable smart lighting ecosystem — setup takes under 10 minutes.",
    link: "#REPLACE-LINK-3",
    icon: "bulb",
    pick: true
  },
  {
    name: "Xiaomi Mi Smart Plug",
    category: "smart-home",
    price: "Rs 1,650",
    blurb: "Turns any outlet smart — schedule, remote toggle, and energy monitoring.",
    why: "The cheapest, lowest-effort way to dip a toe into home automation.",
    link: "#REPLACE-LINK-4",
    icon: "plug",
    pick: false
  },
  {
    name: "Amazfit GTS 4 Mini",
    category: "wearables",
    price: "Rs 9,900",
    blurb: "Slim AMOLED smartwatch, 2-week battery, 120+ sport modes, SpO2 tracking.",
    why: "Battery life alone puts it ahead of watches twice the price.",
    link: "#REPLACE-LINK-5",
    icon: "watch",
    pick: true
  },
  {
    name: "Mi Band 8",
    category: "wearables",
    price: "Rs 4,300",
    blurb: "The budget fitness band that just keeps getting better — sharp display, solid tracking.",
    why: "Our default \"just get this\" answer for anyone starting out with fitness tracking.",
    link: "#REPLACE-LINK-6",
    icon: "watch",
    pick: false
  },
  {
    name: "Instant Pot Duo 7-in-1",
    category: "kitchen",
    price: "Rs 16,500",
    blurb: "Pressure cooker, slow cooker, rice cooker, steamer, and more, in one pot.",
    why: "Cuts daal-bhat prep time in half — the appliance we recommend most to new cooks.",
    link: "#REPLACE-LINK-7",
    icon: "pot",
    pick: true
  },
  {
    name: "Nutribullet Pro 900",
    category: "kitchen",
    price: "Rs 7,800",
    blurb: "900W personal blender for smoothies, batters, and chutneys — dishwasher-safe cups.",
    why: "Chews through ice and fibrous veg without leaving chunks behind.",
    link: "#REPLACE-LINK-8",
    icon: "blender",
    pick: false
  },
  {
    name: "Resistance Band Set (5-piece)",
    category: "fitness",
    price: "Rs 1,950",
    blurb: "Full range of resistance levels in a set small enough to pack in a bag.",
    why: "The single cheapest way to build a real home workout routine.",
    link: "#REPLACE-LINK-9",
    icon: "dumbbell",
    pick: false
  },
  {
    name: "Adjustable Dumbbell Set (2x20kg)",
    category: "fitness",
    price: "Rs 22,000",
    blurb: "Space-saving dial-adjustable dumbbells replacing an entire rack of fixed weights.",
    why: "Saves floor space in small apartments without cutting workout variety.",
    link: "#REPLACE-LINK-10",
    icon: "dumbbell",
    pick: true
  },
  {
    name: "TP-Link Tapo C200 Security Camera",
    category: "smart-home",
    price: "Rs 3,400",
    blurb: "Pan-tilt indoor WiFi camera with night vision and motion alerts on your phone.",
    why: "Best value indoor cam we've tested — the app is actually pleasant to use.",
    link: "#REPLACE-LINK-11",
    icon: "camera",
    pick: false
  },
  {
    name: "Fire-Boltt Ninja Call Pro Plus",
    category: "wearables",
    price: "Rs 3,800",
    blurb: "Bluetooth-calling smartwatch with a 1.83\" display at a genuinely low price.",
    why: "The best \"looks expensive, isn't\" pick on this whole shelf.",
    link: "#REPLACE-LINK-12",
    icon: "watch",
    pick: false
  }
];
