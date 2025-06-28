BEGIN;

INSERT INTO "user" (firstname, lastname, email, password, phone, address, zipcode, city, role) VALUES
('John', 'Doe', 'john.doe@example.com', '$argon2id$v=19$m=65536,t=3,p=4$FqOpNH8Iiwc/CB9jPU95WQ$Jgt0j69li1j5bn4Pshl1n/6nThjYmF7cwiZqq+EkaTI', '01 23 45 67 89', '123 Rue Principale', '12345', 'Springfield', 'utilisateur'), -- password1
('Jane', 'Smith', 'jane.smith@example.com', '$argon2id$v=19$m=65536,t=3,p=4$w+zAaUsziLhKSk8pm3dTtw$uKGEy95VvvPDA0VR3QchM3zZ2dvWBRydH2V2M/ed6u4', '01 23 45 67 89', '456 Rue de l''Orme', '67890', 'Metropolis', 'admin'), -- password2
('Alice', 'Johnson', 'alice.johnson@example.com', '$argon2id$v=19$m=65536,t=3,p=4$up1cn7c+uE45b5+rU7uHHw$6t+c7lHlIDoUyGY+xpyR2fqYVgQ55pCd1OHu3ryytZ8', '01 23 45 67 89', '789 Rue du Chêne', '54321', 'Gotham', 'admin'), -- password3
('Bob', 'Brown', 'bob.brown@example.com', '$argon2id$v=19$m=65536,t=3,p=4$5DfKX+gtNRX7U97G4PbzVA$qRYQIgG9U9RbWXrdPt5dy7D8oOLrzQJ7+MoqiX0xDYA', '01 23 45 67 89', '321 Rue du Pin', '98765', 'Smallville', 'utilisateur'), -- password4
('Charlie', 'Davis', 'charlie.davis@example.com', '$argon2id$v=19$m=65536,t=3,p=4$DkV9xLV+2gzSuA79KZ8ScA$RdnSKwFQHQNQn4KGVqTb0qPVF6JGwuhe3d9Y8xI9G6o', '01 23 45 67 89', '654 Rue du Cèdre', '45678', 'Riverdale', 'utilisateur'), -- password5
('David', 'Wilson', 'david.wilson@example.com', '$argon2id$v=19$m=65536,t=3,p=4$HF0ZjK6m+2JXYBgcPZEX9A$U8CnsqANz06PaxRRGgxJkGeD8nZel0M1kiKtIqSnocQ', '01 23 45 67 89', '987 Rue du Bouleau', '78901', 'Starling', 'utilisateur'), -- password6
('Eve', 'Miller', 'eve.miller@example.com', '$argon2id$v=19$m=65536,t=3,p=4$LSMiLgMdvI6OL1TwOEDTog$6/m+8Kh6HokYiRV/ovWhmUVsMvH1nZwmeKokQVV0B6I', '01 23 45 67 89', '234 Rue de l''Érable', '23456', 'Keystone', 'utilisateur'), -- password7
('Frank', 'Moore', 'frank.moore@example.com', '$argon2id$v=19$m=65536,t=3,p=4$jqAHmo3zrymmNKdLUqOvWw$dZtOvObDJ7wSz+y96LGgoLr0cvW8RxI7jkA/F3EXN1E', '01 23 45 67 89', '567 Rue du Noyer', '89012', 'Côte', 'utilisateur'), -- password8
('Grace', 'Taylor', 'grace.taylor@example.com', '$argon2id$v=19$m=65536,t=3,p=4$WoAfPvYY08I/1rPzhGnRnw$JV5qfN5VxSROUNxyiV7g6jjNmheG+VgiB1Rz6SoLxj0', '01 23 45 67 89', '890 Rue de l''Épicéa', '34567', 'Centre', 'utilisateur'), -- password9
('Heidi', 'Clark', 'heidi.clark@example.com', '$argon2id$v=19$m=65536,t=3,p=4$qkNfRGzV+ap+DeU7Um4bgw$M7f9yNvjTkgI79HSCvml5Uqzv3T93o9RBZn5o9VEFuM', '01 23 45 67 89', '123 Rue du Tremble', '67890', 'Colline', 'utilisateur'), -- password10
('Admin', '', 'master@greenroots.com', '$argon2id$v=19$m=65536,t=3,p=4$+p6idzhGlx1E5Eoxp7TTkw$Uk4xOlghkt8h2Qsr7yFjDnWdll6m33BjJULgl0mgVh0', '', '', '', '', 'admin'); -- admin123

INSERT INTO "tree" (name, scientific_name, image, category, description, co2, o2, price) VALUES
('Acacia', 'Acacia spp.', '/uploads/trees/acacia.webp', 'Résineux', 'Utilisé pour la stabilisation des sols et l’alimentation du bétail.', 12, 25, 70),
('Acajou', 'Swietenia macrophylla', '/uploads/trees/acajou.webp', 'Bois précieux', 'Utilisé pour la fabrication de meubles. Victime de déforestation massive.', 30, 50, 250),
('Arbre à Encens', 'Boswellia sacra', '/uploads/trees/arbres_a_encens.webp', 'Résineux', 'Utilisé pour la production d’encens. Croît en milieux arides.', 15, 20, 90),
('Arganier', 'Argania spinosa', '/uploads/trees/arganier.webp', 'Fruitier', 'Produit l’huile d’argan. Essentiel pour les écosystèmes arides.', 10, 30, 110),
('Bambou Géant', 'Dendrocalamus giganteus', '/uploads/trees/bambous_geants.webp', 'Graminée', 'Croissance rapide. Utilisé en construction et artisanat.', 20, 50, 60),
('Baobab Africain', 'Adansonia digitata', '/uploads/trees/baobab_africain.webp', 'Emblématique', 'Stocke l’eau. Fruits nutritifs. Résilient à la sécheresse.', 10, 50, 80),
('Bouleau Blanc', 'Betula pendula', '/uploads/trees/bouleau_blanc.webp', 'Feuillu', 'Résistant au froid. Contribue à la régénération forestière.', 20, 30, 75),
('Caoutchouc', 'Hevea brasiliensis', '/uploads/trees/caoutchouc.webp', 'Industriel', 'Produit du latex. Cultivé dans les zones tropicales.', 25, 40, 95),
('Cèdre Rouge', 'Thuja plicata', '/uploads/trees/cedre_rouge.webp', 'Conifère', 'Bois durable, aromatique. Utilisé en menuiserie.', 30, 45, 100),
('Cèdre Tropical', 'Cedrela odorata', '/uploads/trees/cedre_tropical.webp', 'Tropical', 'Bois parfumé et résistant. Croissance rapide.', 35, 40, 120),
('Cerisier Japonais', 'Prunus serrulata', '/uploads/trees/cerisier_japonais.webp', 'Ornemental', 'Célèbre pour sa floraison. Symbole culturel au Japon.', 15, 20, 130),
('Chêne Rouge', 'Quercus rubra', '/uploads/trees/chene_ouge.webp', 'Feuillu', 'Très résistant. Fournit bois et habitat pour la faune.', 40, 35, 150),
('Érable à Sucre', 'Acer saccharum', '/uploads/trees/erable_a_sucre.webp', 'Feuillu', 'Produit le sirop d’érable. Couleurs automnales spectaculaires.', 25, 40, 140),
('Figuier Géant', 'Ficus macrophylla', '/uploads/trees/figuiers_geants.webp', 'Tropical', 'Arbre massif aux racines aériennes. Habitat naturel pour de nombreuses espèces.', 30, 60, 160),
('Ginkgo Biloba', 'Ginkgo biloba', '/uploads/trees/ginkgo_biloba.webp', 'Relictuel', 'Arbre ancien. Résistant à la pollution. Utilisé en phytothérapie.', 20, 30, 200),
('Mélèze de Sibérie', 'Larix sibirica', '/uploads/trees/meleze_de_siberie.webp', 'Conifère', 'Adapté aux climats extrêmes. Bois léger et résistant.', 50, 60, 120),
('Moabi', 'Baillonella toxisperma', '/uploads/trees/moabi.webp', 'Bois précieux', 'Bois très dur. Utilisé en charpente et pour la parfumerie.', 35, 45, 300),
('Eucalyptus d’Océanie', 'Eucalyptus globulus', '/uploads/trees/oceanie_eucalyptus.webp', 'Arbre aromatique', 'Croissance rapide. Utilisé pour l’huile et le bois.', 40, 50, 90),
('Palmier Amazonien', 'Mauritia flexuosa', '/uploads/trees/palmiers_amazonniens.webp', 'Palmier', 'Source d’aliments, abris et matériaux de construction.', 40, 60, 90),
('Pin de Sibérie', 'Pinus sibirica', '/uploads/trees/pin_de_siberie.webp', 'Conifère', 'Supporte des températures très basses. Produit des pignons.', 50, 55, 110),
('Pin Rouge Japonais', 'Pinus densiflora', '/uploads/trees/pin_ouge_japonais.webp', 'Ornemental', 'Très décoratif, apprécié pour les jardins japonais.', 30, 35, 125),
('Pohutukawa', 'Metrosideros excelsa', '/uploads/trees/pohutukawa.webp', 'Côtier', 'Protège les littoraux. Floraison rouge spectaculaire.', 20, 30, 135),
('Rauri', 'Taxus spp.', '/uploads/trees/rauri.webp', 'Conifère', 'Croissance lente. Source du taxol (anti-cancer).', 40, 50, 150),
('Séquoia Géant', 'Sequoiadendron giganteum', '/uploads/trees/sequoia_gant.webp', 'Géant', 'Un des plus grands arbres du monde. Capture massive de CO₂.', 100, 200, 500),
('Teck', 'Tectona grandis', '/uploads/trees/teck.webp', 'Bois précieux', 'Résistant à l’eau. Très utilisé en construction navale.', 35, 45, 270);

INSERT INTO "forest" (name, association, image, description, country, location_x, location_y) VALUES
('Forêts des Philippines', 'GreenRoots', '/uploads/forests/forest_oceanie.webp', 'Archipel tropical avec des forêts ayant subi une déforestation.', 'Philippines', 13.0000, 122.0000),
('Zones de Reforestation sur Himalaya', 'GreenRoots', '/uploads/forests/Forest_temperee.webp', 'Région montagneuse où la reforestation est cruciale contre l’érosion.', 'Népal', 30.0000, 85.0000),
('Forêts de Madagascar', 'GreenRoots', '/uploads/forests/Forest_tropicale.webp', 'Île avec une biodiversité unique et une déforestation importante.', 'Madagascar', -18.0000, 47.0000),
('Zones de Reforestation à Haïti', 'GreenRoots', '/uploads/forests/forests_am_nord.webp', 'Pays ayant subi une déforestation sévère avec un besoin urgent de reforestation.', 'Haïti', 19.0000, -72.0000),
('Forêts Françaises', 'GreenRoots', '/uploads/forests/forest_fr.webp', 'Massifs forestiers métropolitains à préserver et restaurer.', 'France', 46.6034, 1.8883),
('Forêts d''Asie du Sud-Est', 'GreenRoots', '/uploads/forests/forest_asie.webp', 'Forêts tropicales menacées, essentielles pour la biodiversité.', 'Indonésie', -2.5489, 118.0149),
('Forêts Amazoniennes', 'GreenRoots', '/uploads/forests/forest_am_sud.webp', 'Poumon vert de la planète, en reforestation urgente.', 'Brésil', -3.4653, -62.2159),
('Zone de Reforestation du Sahel', 'GreenRoots', '/uploads/forests/foretes_africaine.webp', 'Région aride nécessitant des efforts de reforestation contre la désertification.', 'Mauritanie', 15.0000, 20.0000);

INSERT INTO "order" (user_id, total_price, status) VALUES
(1, 100, 1),
(1, 150, 1),
(2, 200, 2),
(3, 900, 3);

INSERT INTO "order_item" (order_id, tree_id, forest_id, name, quantity, price) VALUES
(1, 1, 1, 'Manguier Africain', 2, 50),  
(1, 7, 2, 'If Commun', 1, 150),  
(2, 2, 3, 'Santal Blanc', 1, 200),  
(3, 3, 4, 'Ébène du Gabon', 3, 900);  

INSERT INTO "forest_tree" (forest_id, tree_id, stock) VALUES
(1, 18, 150),  
(1, 5, 200),   
(1, 8, 120), 
(2, 16, 90),   
(2, 7, 150),   
(2, 22, 60),   
(3, 6, 250),  
(3, 14, 120),
(4, 3, 120),   
(4, 6, 300),   
(4, 1, 180),  
(5, 12, 100),  
(5, 13, 90),  
(5, 21, 60),   
(5, 23, 50),   
(5, 15, 40),   
(6, 2, 80),  
(6, 8, 100),
(6, 5, 150),
(6, 18, 100), 
(7, 19, 180),
(7, 2, 100), 
(7, 24, 50), 
(8, 1, 300),
(8, 6, 200),
(5, 9, 100), 
(2, 9, 80),
(3, 10, 90), 
(6, 10, 70), 
(2, 11, 60),  
(6, 11, 100), 
(3, 17, 40),  
(7, 17, 70),  
(2, 20, 100), 
(5, 20, 60),
(6, 25, 90),  
(7, 25, 50),
(8, 4, 150);  
 
COMMIT;