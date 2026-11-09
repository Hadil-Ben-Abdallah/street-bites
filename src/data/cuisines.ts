import type { ImgKey } from "@/lib/images";

export interface DishSeed {
  name: string;
  description: string;
  price: number;
  diet: "Vegan" | "Vegetarian" | "Meat" | "Seafood" | "Gluten-free";
  allergens: string;
  spice: number; // 0-4
  img: ImgKey;
}

export interface CuisineSeed {
  cuisine: string;
  country: string;
  cities: string[];
  vendorNames: string[];
  dishes: DishSeed[];
  img: ImgKey;
}

export const CUISINES: CuisineSeed[] = [
  {
    cuisine: "Japanese", country: "Japan", cities: ["Osaka", "Tokyo", "Fukuoka"], img: "takoyaki",
    vendorNames: ["Octo Pop", "Hey! Mom Onigiri", "Yatai Nights", "Kaiju Katsu", "Ramen Rumble", "Dashi Dash", "Neko Gyoza"],
    dishes: [
      { name: "Takoyaki", description: "Octopus batter balls with bonito flakes and kewpie", price: 9, diet: "Seafood", allergens: "Gluten, Egg, Fish", spice: 0, img: "takoyaki" },
      { name: "Karaage Cup", description: "Ginger-soy fried chicken with yuzu mayo", price: 10, diet: "Meat", allergens: "Gluten, Soy, Egg", spice: 1, img: "takoyaki" },
      { name: "Okonomiyaki", description: "Cabbage pancake, okonomi sauce, aonori", price: 11, diet: "Vegetarian", allergens: "Gluten, Egg", spice: 0, img: "takoyaki" },
      { name: "Salmon Onigiri", description: "Hand-pressed rice triangle with grilled salmon", price: 6, diet: "Seafood", allergens: "Fish, Sesame", spice: 0, img: "takoyaki" },
      { name: "Yakisoba", description: "Wok-tossed noodles with pork belly and pickled ginger", price: 10, diet: "Meat", allergens: "Gluten, Soy", spice: 1, img: "padkrapao" },
    ],
  },
  {
    cuisine: "Korean", country: "South Korea", cities: ["Seoul", "Busan"], img: "corndog",
    vendorNames: ["Seoul Stix", "Gochu Gang", "K-Crunch", "Bibim Box", "Hanok Grill", "Tteok Talk"],
    dishes: [
      { name: "Korean Corn Dog", description: "Potato-crusted mozzarella dog with sugar dust", price: 8, diet: "Meat", allergens: "Gluten, Dairy, Egg", spice: 0, img: "corndog" },
      { name: "Tteokbokki", description: "Chewy rice cakes in fiery gochujang sauce", price: 9, diet: "Vegan", allergens: "Soy", spice: 3, img: "padkrapao" },
      { name: "Yangnyeom Wings", description: "Double-fried wings, sweet-spicy glaze, sesame", price: 12, diet: "Meat", allergens: "Gluten, Soy, Sesame", spice: 2, img: "corndog" },
      { name: "Kimchi Pancake", description: "Crispy kimchi jeon with scallion dip", price: 8, diet: "Vegan", allergens: "Gluten, Soy", spice: 2, img: "corndog" },
      { name: "Bulgogi Bao", description: "Soy-pear marinated beef in a steamed bun", price: 10, diet: "Meat", allergens: "Gluten, Soy, Sesame", spice: 1, img: "bao" },
    ],
  },
  {
    cuisine: "Thai", country: "Thailand", cities: ["Bangkok", "Chiang Mai"], img: "padkrapao",
    vendorNames: ["Wok This Way", "Krapao Club", "Soi 38", "Tuk Tuk Thai", "Lemongrass Lane"],
    dishes: [
      { name: "Pad Kra Pao", description: "Holy basil pork stir-fry, crispy egg, jasmine rice", price: 11, diet: "Meat", allergens: "Egg, Soy, Fish", spice: 3, img: "padkrapao" },
      { name: "Pad Thai", description: "Tamarind rice noodles, tofu, peanuts, lime", price: 10, diet: "Vegetarian", allergens: "Peanut, Egg, Soy", spice: 1, img: "padkrapao" },
      { name: "Moo Ping", description: "Coconut-glazed grilled pork skewers", price: 8, diet: "Meat", allergens: "Soy, Fish", spice: 1, img: "padkrapao" },
      { name: "Mango Sticky Rice", description: "Sweet coconut rice with ripe Nam Dok Mai mango", price: 7, diet: "Vegan", allergens: "None", spice: 0, img: "padkrapao" },
      { name: "Som Tam", description: "Pounded green papaya salad with chili and lime", price: 8, diet: "Gluten-free", allergens: "Peanut, Fish", spice: 4, img: "padkrapao" },
    ],
  },
  {
    cuisine: "Indian", country: "India", cities: ["Mumbai", "Delhi", "Kolkata"], img: "panipuri",
    vendorNames: ["Chaat Chaat", "Bombay Bites", "Tandoor Truck", "Masala Mile", "Dilli Dhaba", "Puri Party"],
    dishes: [
      { name: "Pani Puri", description: "Crisp puris, spiced potato, tangy mint water", price: 7, diet: "Vegan", allergens: "Gluten", spice: 2, img: "panipuri" },
      { name: "Vada Pav", description: "Mumbai potato fritter burger with garlic chutney", price: 7, diet: "Vegan", allergens: "Gluten", spice: 2, img: "panipuri" },
      { name: "Chicken Tikka Roll", description: "Charred tikka, pickled onions, kathi paratha", price: 11, diet: "Meat", allergens: "Gluten, Dairy", spice: 2, img: "shawarma" },
      { name: "Samosa Chaat", description: "Crushed samosa, chickpeas, yogurt, tamarind", price: 8, diet: "Vegetarian", allergens: "Gluten, Dairy", spice: 2, img: "panipuri" },
      { name: "Masala Dosa", description: "Crispy rice crepe with spiced potato and sambar", price: 10, diet: "Gluten-free", allergens: "Mustard", spice: 2, img: "panipuri" },
    ],
  },
  {
    cuisine: "Mexican", country: "Mexico", cities: ["Mexico City", "Oaxaca", "Guadalajara"], img: "tacos",
    vendorNames: ["Taco Loco", "El Trompo", "Masa Madre", "La Güera", "Salsa Brava", "Comal & Co"],
    dishes: [
      { name: "Tacos al Pastor", description: "Spit-roasted pork, pineapple, cilantro, onion", price: 10, diet: "Meat", allergens: "None", spice: 2, img: "tacos" },
      { name: "Birria Quesatacos", description: "Slow-braised beef, melted cheese, consommé dip", price: 13, diet: "Meat", allergens: "Dairy", spice: 2, img: "tacos" },
      { name: "Elote", description: "Grilled street corn, chili-lime mayo, cotija", price: 6, diet: "Vegetarian", allergens: "Dairy, Egg", spice: 1, img: "tacos" },
      { name: "Baja Fish Taco", description: "Beer-battered fish, chipotle crema, slaw", price: 11, diet: "Seafood", allergens: "Gluten, Fish, Dairy", spice: 1, img: "tacos" },
      { name: "Churros", description: "Cinnamon sugar churros with dark chocolate", price: 6, diet: "Vegetarian", allergens: "Gluten, Dairy", spice: 0, img: "tacos" },
    ],
  },
  {
    cuisine: "Italian", country: "Italy", cities: ["Palermo", "Naples", "Rome"], img: "arancini",
    vendorNames: ["Bella Gamba", "Arancina Amore", "Nonna's Cart", "Piazza Fritta", "Supplì Squad"],
    dishes: [
      { name: "Arancini", description: "Saffron risotto balls stuffed with ragù and mozzarella", price: 9, diet: "Meat", allergens: "Gluten, Dairy, Egg", spice: 0, img: "arancini" },
      { name: "Pizza Fritta", description: "Fried Neapolitan dough, tomato, fior di latte", price: 10, diet: "Vegetarian", allergens: "Gluten, Dairy", spice: 0, img: "arancini" },
      { name: "Supplì al Telefono", description: "Roman rice croquette with stretchy mozzarella", price: 8, diet: "Vegetarian", allergens: "Gluten, Dairy, Egg", spice: 0, img: "arancini" },
      { name: "Porchetta Panino", description: "Herb-roasted pork belly, salsa verde, ciabatta", price: 12, diet: "Meat", allergens: "Gluten", spice: 0, img: "banhmi" },
      { name: "Cannoli", description: "Crisp shells filled with sweet ricotta and pistachio", price: 6, diet: "Vegetarian", allergens: "Gluten, Dairy, Nuts", spice: 0, img: "arancini" },
    ],
  },
  {
    cuisine: "Turkish", country: "Turkey", cities: ["Istanbul", "Izmir"], img: "shawarma",
    vendorNames: ["Döner Kebab Co", "Bosphorus Grill", "Simit Street", "Anatolia Fire", "Gözleme Girls"],
    dishes: [
      { name: "Döner Kebab", description: "Shaved lamb, garlic yogurt, chili, pide bread", price: 11, diet: "Meat", allergens: "Gluten, Dairy", spice: 1, img: "shawarma" },
      { name: "Gözleme", description: "Hand-rolled flatbread with spinach and feta", price: 9, diet: "Vegetarian", allergens: "Gluten, Dairy", spice: 0, img: "shawarma" },
      { name: "Lahmacun", description: "Thin crust topped with spiced minced lamb", price: 8, diet: "Meat", allergens: "Gluten", spice: 1, img: "shawarma" },
      { name: "Balık Ekmek", description: "Grilled mackerel sandwich with onion and lemon", price: 10, diet: "Seafood", allergens: "Gluten, Fish", spice: 0, img: "banhmi" },
      { name: "Baklava Cone", description: "Pistachio baklava with kaymak cream", price: 7, diet: "Vegetarian", allergens: "Gluten, Dairy, Nuts", spice: 0, img: "arancini" },
    ],
  },
  {
    cuisine: "Lebanese", country: "Lebanon", cities: ["Beirut", "Tripoli"], img: "shawarma",
    vendorNames: ["Cedar & Coal", "Zaatar Zone", "Beirut Bites", "Falafel Fever", "Manousheh Spot"],
    dishes: [
      { name: "Chicken Shawarma", description: "Marinated chicken, toum, pickles, saj bread", price: 10, diet: "Meat", allergens: "Gluten", spice: 1, img: "shawarma" },
      { name: "Falafel Wrap", description: "Herby chickpea falafel, tahini, turnip pickles", price: 9, diet: "Vegan", allergens: "Gluten, Sesame", spice: 1, img: "shawarma" },
      { name: "Zaatar Manousheh", description: "Flatbread with wild thyme, sumac and olive oil", price: 7, diet: "Vegan", allergens: "Gluten, Sesame", spice: 0, img: "shawarma" },
      { name: "Kibbeh", description: "Bulgur shells filled with spiced lamb and pine nuts", price: 9, diet: "Meat", allergens: "Gluten, Nuts", spice: 1, img: "arancini" },
      { name: "Halloumi Saj", description: "Grilled halloumi, tomato, mint in saj bread", price: 9, diet: "Vegetarian", allergens: "Gluten, Dairy", spice: 0, img: "shawarma" },
    ],
  },
  {
    cuisine: "Tunisian", country: "Tunisia", cities: ["Tunis", "Sfax", "Sousse"], img: "arancini",
    vendorNames: ["Brik Brothers", "Harissa House", "Carthage Corner", "Medina Snacks", "Lablabi Lab"],
    dishes: [
      { name: "Brik à l'Œuf", description: "Crisp malsouka pastry, runny egg, tuna, capers", price: 7, diet: "Seafood", allergens: "Gluten, Egg, Fish", spice: 1, img: "arancini" },
      { name: "Fricassé", description: "Fried bread roll with tuna, olives, harissa", price: 6, diet: "Seafood", allergens: "Gluten, Egg, Fish", spice: 2, img: "banhmi" },
      { name: "Lablabi", description: "Chickpea soup with cumin, harissa, bread", price: 7, diet: "Vegan", allergens: "Gluten", spice: 3, img: "panipuri" },
      { name: "Makroudh", description: "Semolina pastry with date paste and honey", price: 5, diet: "Vegan", allergens: "Gluten", spice: 0, img: "arancini" },
      { name: "Merguez Sandwich", description: "Spicy lamb sausages, mechouia salad, baguette", price: 9, diet: "Meat", allergens: "Gluten", spice: 3, img: "banhmi" },
    ],
  },
  {
    cuisine: "Moroccan", country: "Morocco", cities: ["Marrakech", "Fes", "Casablanca"], img: "padkrapao",
    vendorNames: ["Tagine Truck", "Atlas Grill", "Souk Stop", "Ras el Hanout", "Djemaa Fire"],
    dishes: [
      { name: "Chicken Pastilla", description: "Flaky pie of spiced chicken, almonds, cinnamon", price: 11, diet: "Meat", allergens: "Gluten, Nuts, Egg", spice: 1, img: "arancini" },
      { name: "Kefta Skewers", description: "Charcoal lamb kefta with cumin salt", price: 10, diet: "Meat", allergens: "None", spice: 2, img: "shawarma" },
      { name: "Harira Cup", description: "Tomato, lentil and chickpea soup with dates", price: 6, diet: "Vegan", allergens: "None", spice: 1, img: "padkrapao" },
      { name: "Msemen Wrap", description: "Layered flatbread with honey and amlou", price: 6, diet: "Vegetarian", allergens: "Gluten, Nuts", spice: 0, img: "shawarma" },
      { name: "Sardine Chermoula", description: "Grilled sardines in herb chermoula", price: 9, diet: "Seafood", allergens: "Fish", spice: 1, img: "padkrapao" },
    ],
  },
  {
    cuisine: "American", country: "USA", cities: ["New York", "Austin", "New Orleans"], img: "burger",
    vendorNames: ["Smash Society", "Bun Fight", "Lone Star Smoke", "Big Easy Po'Boys", "Mac Attack", "Philly Phil's"],
    dishes: [
      { name: "Smash Burger", description: "Double crispy patties, American cheese, pickles", price: 13, diet: "Meat", allergens: "Gluten, Dairy, Egg", spice: 0, img: "burger" },
      { name: "Brisket Sandwich", description: "12-hour post-oak brisket, slaw, BBQ sauce", price: 14, diet: "Meat", allergens: "Gluten", spice: 1, img: "burger" },
      { name: "Nashville Hot Chicken", description: "Cayenne-fried chicken, pickles, white bread", price: 12, diet: "Meat", allergens: "Gluten, Dairy", spice: 4, img: "burger" },
      { name: "Lobster Roll", description: "Butter-poached lobster in a toasted split bun", price: 18, diet: "Seafood", allergens: "Gluten, Shellfish, Dairy", spice: 0, img: "banhmi" },
      { name: "Loaded Fries", description: "Cheese sauce, jalapeños, crispy onions", price: 8, diet: "Vegetarian", allergens: "Dairy", spice: 2, img: "burger" },
    ],
  },
  {
    cuisine: "Greek", country: "Greece", cities: ["Athens", "Thessaloniki"], img: "shawarma",
    vendorNames: ["Gyro Hero", "Opa! Street", "Souvlaki Social", "Feta Fiesta"],
    dishes: [
      { name: "Pork Gyro", description: "Shaved pork, tzatziki, tomato, fries in pita", price: 10, diet: "Meat", allergens: "Gluten, Dairy", spice: 0, img: "shawarma" },
      { name: "Spanakopita", description: "Spinach and feta in crisp filo", price: 7, diet: "Vegetarian", allergens: "Gluten, Dairy, Egg", spice: 0, img: "arancini" },
      { name: "Chicken Souvlaki", description: "Lemon-oregano chicken skewers with pita", price: 10, diet: "Meat", allergens: "Gluten", spice: 0, img: "shawarma" },
      { name: "Loukoumades", description: "Honey doughnuts with walnuts and cinnamon", price: 6, diet: "Vegetarian", allergens: "Gluten, Nuts", spice: 0, img: "arancini" },
    ],
  },
  {
    cuisine: "Vietnamese", country: "Vietnam", cities: ["Hanoi", "Ho Chi Minh City", "Hoi An"], img: "banhmi",
    vendorNames: ["Bánh Mì Boys", "Pho Real", "Saigon Social", "Hanoi Hustle", "Lucky Lotus"],
    dishes: [
      { name: "Bánh Mì Thịt", description: "Grilled pork, pâté, pickled carrot, chili, baguette", price: 9, diet: "Meat", allergens: "Gluten, Soy", spice: 2, img: "banhmi" },
      { name: "Tofu Bánh Mì", description: "Lemongrass tofu, pickles, cilantro, sriracha mayo", price: 8, diet: "Vegan", allergens: "Gluten, Soy", spice: 2, img: "banhmi" },
      { name: "Fresh Summer Rolls", description: "Shrimp, herbs, vermicelli, peanut hoisin", price: 7, diet: "Seafood", allergens: "Shellfish, Peanut", spice: 0, img: "banhmi" },
      { name: "Bún Chả", description: "Charred pork patties, noodles, nuoc cham", price: 11, diet: "Meat", allergens: "Fish", spice: 1, img: "padkrapao" },
      { name: "Bánh Xèo", description: "Turmeric crêpe with shrimp and bean sprouts", price: 10, diet: "Gluten-free", allergens: "Shellfish, Fish", spice: 1, img: "banhmi" },
    ],
  },
  {
    cuisine: "Chinese", country: "China", cities: ["Shanghai", "Chengdu", "Guangzhou"], img: "bao",
    vendorNames: ["B'ank Bao", "Dumpling Dynasty", "Sichuan Spark", "Jianbing Joe", "Golden Wok"],
    dishes: [
      { name: "Gua Bao", description: "Braised pork belly, pickled cucumber, peanut powder", price: 9, diet: "Meat", allergens: "Gluten, Soy, Peanut", spice: 1, img: "bao" },
      { name: "Xiao Long Bao", description: "Soup dumplings with ginger black vinegar", price: 10, diet: "Meat", allergens: "Gluten, Soy", spice: 0, img: "bao" },
      { name: "Dan Dan Noodles", description: "Sichuan pepper pork, chili oil, sesame", price: 10, diet: "Meat", allergens: "Gluten, Soy, Sesame", spice: 4, img: "padkrapao" },
      { name: "Jianbing", description: "Crispy egg crêpe with hoisin and scallions", price: 8, diet: "Vegetarian", allergens: "Gluten, Egg, Soy", spice: 1, img: "bao" },
      { name: "Mushroom Bao", description: "Five-spice shiitake, crispy shallots", price: 8, diet: "Vegan", allergens: "Gluten, Soy", spice: 1, img: "bao" },
    ],
  },
  {
    cuisine: "Brazilian", country: "Brazil", cities: ["São Paulo", "Rio de Janeiro", "Salvador"], img: "arancini",
    vendorNames: ["Pão de Queijo Co", "Churrasco Carnival", "Bahia Bites", "Coxinha Club"],
    dishes: [
      { name: "Pão de Queijo", description: "Chewy cheese bread puffs made with tapioca", price: 6, diet: "Gluten-free", allergens: "Dairy, Egg", spice: 0, img: "arancini" },
      { name: "Coxinha", description: "Teardrop croquettes of shredded chicken and catupiry", price: 7, diet: "Meat", allergens: "Gluten, Dairy", spice: 0, img: "arancini" },
      { name: "Picanha Skewer", description: "Churrasco rump cap with farofa and vinaigrette", price: 14, diet: "Meat", allergens: "None", spice: 0, img: "shawarma" },
      { name: "Acarajé", description: "Black-eyed pea fritter with vatapá and shrimp", price: 10, diet: "Seafood", allergens: "Shellfish, Peanut", spice: 3, img: "panipuri" },
      { name: "Brigadeiros", description: "Chocolate fudge truffles with sprinkles", price: 5, diet: "Vegetarian", allergens: "Dairy", spice: 0, img: "arancini" },
    ],
  },
];

export const CUISINE_NAMES = CUISINES.map((c) => c.cuisine);
export const COUNTRY_NAMES = CUISINES.map((c) => c.country);
