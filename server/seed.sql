-- CREATE TABLE products (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     price REAL NOT NULL,
--     image TEXT NOT NULL,
--     category TEXT NOT NULL,
--     description TEXT NOT NULL
-- );

-- CREATE TABLE cartItems (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     productId INTEGER NOT NULL,
--     quantity INTEGER NOT NULL,
--     FOREIGN KEY (productId) REFERENCES products(id)
-- );

-- CREATE TABLE orders (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     total REAL NOT NULL
-- );

INSERT INTO products (name, price, image, category, description) VALUES
('Modified DL-44 Blaster Pistol', 2500.00, '/images/modified-dl-44-blaster-pistol.jpg', 'Gear & Weapons', 'Because sometimes you do have to shoot first.'),
('Vibroblade Set (3-pack)', 850.00, '/images/vibroblade-set.jpg', 'Gear & Weapons', 'For those close encounters when blasters aren’t enough.'),
('Thermal Detonator Alarm Clock', 200.00, '/images/thermal-detonator-alarm-clock.jpg', 'Gear & Weapons', 'Wake up with the thrill of imminent danger every morning.'),
('HoloCloak (Personal Stealth Field Generator)', 12000.00, '/images/holocloak.jpg', 'Gear & Weapons', 'For sneaky escapes or "totally innocent" espionage.'),
('Customizable Bounty Hunter Armor', 15000.00, '/images/bounty-hunter-armor.jpg', 'Outfits & Disguises', 'Whether you''re the hunter or the hunted, look the part.'),
('Disguise Generator Belt', 7500.00, '/images/disguise-generator-belt.jpg', 'Outfits & Disguises', 'Turn heads… or make sure no one notices yours.'),
('Corellian Leather Duster', 3200.00, '/images/corellian-leather-duster.jpg', 'Outfits & Disguises', 'Smuggler chic, for hyperspace lounges and back-alley deals.'),
('Hyperdrive Scrambler Kit', 18000.00, '/images/hyperdrive-scrambler-kit.jpg', 'Transportation Upgrades', 'Because nobody needs to know where you’ve been.'),
('Hollowed-Out Astromech Droid (for smuggling)', 9000.00, '/images/hollowed-astromech-droid.jpg', 'Transportation Upgrades', 'It’s R2 on the outside, but full of spice on the inside.'),
('Illegal S-Thread Booster', 25000.00, '/images/illegal-s-thread-booster.jpg', 'Transportation Upgrades', 'Outrun Imperial blockades in style.'),
('“Spice Sampler” Pack', 3000.00, '/images/spice-sampler-pack.jpg', 'Contraband', 'For the discerning taste of Outer Rim travelers. Not for resale in Imperial space.'),
('Faux-Kyber Crystals', 500.00, '/images/faux-kyber-crystals.jpg', 'Contraband', 'For the wannabe Jedi or Sith who just wants to look dangerous.'),
('Holocron-Inspired Flask', 300.00, '/images/holocron-flask.jpg', 'Contraband', 'Hide your core secrets. Or just your liquor.'),
('Carbonite Wall Art (Customizable)', 5000.00, '/images/carbonite-wall-art.jpg', 'Ship Decor', 'Preserve your enemies forever. Or just impress your friends.'),
('Sabacc-Themed Throw Pillows', 120.00, '/images/sabacc-throw-pillows.jpg', 'Ship Decor', 'Add a touch of scoundrel sophistication to your lounge.'),
('Holo-Portrait of Jabba the Hutt', 450.00, '/images/jabba-holo-portrait.jpg', 'Ship Decor', 'Show the galaxy you have taste… or that you don’t care.'),
('Scoundrel’s Guide to Hiding in Plain Sight (Digital Download)', 250.00, '/images/scoundrels-guide.jpg', 'Miscellaneous Essentials', 'Blend in anywhere, from Coruscant parties to Tatooine cantinas.'),
('Droid Restraint Bolt Multipack', 100.00, '/images/droid-restraint-bolts.jpg', 'Miscellaneous Essentials', 'For keeping those chatty droids in line.'),
('Womp Rat Jerky (Family Size)', 75.00, '/images/womp-rat-jerky.jpg', 'Miscellaneous Essentials', 'A snack as tough as you are.'),
('Imperial Credits Forgery Kit', 15000.00, '/images/credits-forgery-kit.jpg', 'Miscellaneous Essentials', 'Because sometimes, it’s easier to make your own money.');

