BEGIN;

INSERT INTO "user" (firstname, lastname, email, password, phone, address, zipcode, city, role) VALUES
('John', 'Doe', 'john.doe@example.com', 'password1', '01 23 45 67 89', '123 Rue Principale', '12345', 'Springfield', 'utilisateur'),
('Jane', 'Smith', 'jane.smith@example.com', 'password2', '01 23 45 67 89', '456 Rue de l''Orme', '67890', 'Metropolis', 'admin'),
('Alice', 'Johnson', 'alice.johnson@example.com', 'password3', '01 23 45 67 89', '789 Rue du Chêne', '54321', 'Gotham', 'admin'),
('Bob', 'Brown', 'bob.brown@example.com', 'password4', '01 23 45 67 89', '321 Rue du Pin', '98765', 'Smallville', 'utilisateur'),
('Charlie', 'Davis', 'charlie.davis@example.com', 'password5', '01 23 45 67 89', '654 Rue du Cèdre', '45678', 'Riverdale', 'utilisateur'),
('David', 'Wilson', 'david.wilson@example.com', 'password6', '01 23 45 67 89', '987 Rue du Bouleau', '78901', 'Starling', 'utilisateur'),
('Eve', 'Miller', 'eve.miller@example.com', 'password7', '01 23 45 67 89', '234 Rue de l''Érable', '23456', 'Keystone', 'utilisateur'),
('Frank', 'Moore', 'frank.moore@example.com', 'password8', '01 23 45 67 89', '567 Rue du Noyer', '89012', 'Côte', 'utilisateur'),
('Grace', 'Taylor', 'grace.taylor@example.com', 'password9', '01 23 45 67 89', '890 Rue de l''Épicéa', '34567', 'Centre', 'utilisateur'),
('Heidi', 'Clark', 'heidi.clark@example.com', 'password10', '01 23 45 67 89', '123 Rue du Tremble', '67890', 'Colline', 'utilisateur'),
('Admin', '', 'master@greenroots.com', '$argon2id$v=19$m=65536,t=3,p=4$+p6idzhGlx1E5Eoxp7TTkw$Uk4xOlghkt8h2Qsr7yFjDnWdll6m33BjJULgl0mgVh0', '', '', '', '', 'admin');

INSERT INTO "tree" (name, scientific_name, image, category, description, co2, o2, price) VALUES
('Manguier Africain', 'Cordyla africana', 'manguier_africain.jpg', 'Fruitier', 'Fournit des fruits nutritifs, du bois et de l''ombre, Aide à la restauration des terres dégradées', 10, 30, 50),
('Santal Blanc', 'Santalum album', 'santal_blanc.jpg', 'Bois précieux', 'Bois précieux pour son huile essentielle et son utilisation culturelle, Nécessite souvent un arbre hôte pour ses racines', 25, 30, 200),
('Ébène du Gabon', 'Diospyros crassiflora', 'ebene_du_gabon.jpg', 'Bois précieux', 'Surexploité, Sa replantation est cruciale pour la biodiversité et l''économie locale durable', 40, 50, 300),
('Arolle', 'Pinus cembra', 'arolle.jpg', 'Conifère', 'Stabilise les sols en haute altitude, Important pour la faune, notamment le casse-noix, Ses graines sont comestibles', 50, 60, 120),
('Acajou d''Honduras', 'Swietenia macrophylla', 'acajou_honduras.jpg', 'Bois recherché', 'A subi une déforestation importante, Sa replantation durable est essentielle', 30, 50, 250),
('Baobab Africain', 'Adansonia digitata', 'baobab_africain.jpg', 'Emblématique', 'Stocke de l''eau, Ses fruits sont nutritifs, Ses feuilles et son écorce ont des usages traditionnels, Résilient à la sécheresse', 10, 50, 80),
('If Commun', 'Taxus baccata', 'if_commun.jpg', 'Conifère', 'Arbre à croissance lente, très important pour la biodiversité, Fournit abri et nourriture, Usages médicinaux (taxol), A subi des pertes dues à la déforestation et à son utilisation', 40, 50, 150),
('Kauri', 'Agathis australis', 'kauri.jpg', 'Emblématique', 'Arbre géant emblématique, Massivement exploité, Les efforts de replantation sont cruciaux pour restaurer les forêts indigènes et la biodiversité unique de la Nouvelle-Zélande', 20, 30, 500),
('Palmier de Jatata', 'Attalea phalerata', 'palmier_jatata.jpg', 'Palmier', 'Fournit des noix comestibles, de l''huile, des fibres et des matériaux de construction importants pour les communautés locales, Sa replantation soutient l''économie locale et la conservation des forêts', 40, 60, 90),
('Chêne Liège', 'Quercus suber', 'chene_liege.jpg', 'Bois précieux', 'Source de liège, une ressource renouvelable importante, Les forêts de chênes-lièges sont des écosystèmes riches en biodiversité, Jouent un rôle crucial dans la prévention de la désertification', 50, 30, 180);

INSERT INTO "forest" (name, association, image, description, country, location_x, location_y) VALUES
('Forêt Amazonienne', 'GreenRoots', 'imageforet1.jpg', 'Vaste forêt tropicale humide nécessitant une reforestation.', 'Bresil',  -5.0000, -60.0000),
('Forêts Indonésiennes', 'GreenRoots', 'imageforet2.jpg', 'Archipel avec des forêts tropicales humides critiques pour la biodiversité.','Indonésie', -2.0000, 118.0000),
('Zone de Reforestation du Sahel', 'GreenRoots', 'imageforet3.jpg', 'Région aride nécessitant des efforts de reforestation contre la désertification.', 'Maurritanie', 15.0000, 20.0000),
('Forêts de Madagascar', 'GreenRoots', 'imageforet4.jpg', 'Île avec une biodiversité unique et une déforestation importante.', 'Madagascar', -18.0000, 47.0000),
('Forêts des Philippines', 'GreenRoots', 'imageforet5.jpg', 'Archipel tropical avec des forêts ayant subi une déforestation.', 'Philippines', 13.0000, 122.0000),
('Zones de Reforestation sur Himalaya', 'GreenRoots', 'imageforet6.jpg', 'Région montagneuse où la reforestation est cruciale contre lérosion.', 'Népal', 30.0000, 85.0000),
('Zones de Reforestation à Haïti', 'GreenRoots', 'imageforet7.jpg', 'Pays ayant subi une déforestation sévère avec un besoin urgent de reforestation.', 'Haïti', 19.0000, -72.0000);

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
(1, 1, 150),  
(1, 6, 200),  
(2, 2, 100),  
(2, 8, 50),   
(3, 1, 300),  
(3, 6, 400),  
(4, 4, 120),  
(4, 6, 250),  
(5, 5, 80),  
(5, 9, 180),  
(6, 4, 90),   
(6, 7, 110),  
(7, 1, 500),  
(7, 10, 300); 

COMMIT;