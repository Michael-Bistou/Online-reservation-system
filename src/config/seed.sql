-- =====================================================
-- DONNÉES DE TEST - SYSTÈME DE RÉSERVATION
-- =====================================================

-- Utilisation de la base de données
USE reservation_system;

-- =====================================================
-- INSERTION DES UTILISATEURS DE TEST
-- =====================================================
INSERT INTO users (email, password, first_name, last_name, phone) VALUES
('john.doe@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8.', 'John', 'Doe', '+33123456789'),
('jane.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8.', 'Jane', 'Smith', '+33987654321'),
('mike.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8.', 'Mike', 'Johnson', '+33555555555'),
('admin@restaurant.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8.', 'Admin', 'Restaurant', '+33000000000');

-- =====================================================
-- INSERTION DES RESTAURANTS DE TEST
-- =====================================================
INSERT INTO restaurants (name, description, address, phone, email, opening_hours, cuisine_type, price_range, rating) VALUES
('Le Petit Bistrot', 'Restaurant traditionnel français avec une cuisine authentique et un service chaleureux.', '123 Rue de la Paix, 75001 Paris', '+33123456789', 'contact@lepetitbistrot.fr', '{"lundi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "mardi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "mercredi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "jeudi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "vendredi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "23:00"}}, "samedi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "23:00"}}, "dimanche": {"ferme": true}}', 'Française', '€€', 4.5),

('Sakura Sushi', 'Restaurant japonais authentique avec des sushis frais et une ambiance zen.', '456 Avenue des Champs, 75008 Paris', '+33987654321', 'info@sakurasushi.fr', '{"lundi": {"ferme": true}, "mardi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "mercredi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "jeudi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "vendredi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "23:00"}}, "samedi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "23:00"}}, "dimanche": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:00"}}}', 'Japonaise', '€€€', 4.8),

('Pizza Roma', 'Pizzeria italienne traditionnelle avec des fours à bois et des ingrédients authentiques.', '789 Boulevard Saint-Germain, 75006 Paris', '+33555555555', 'hello@pizzaroma.fr', '{"lundi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "mardi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "mercredi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "jeudi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:30"}}, "vendredi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "23:00"}}, "samedi": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "23:00"}}, "dimanche": {"ouverture": "12:00", "fermeture": "14:30", "soir": {"ouverture": "19:00", "fermeture": "22:00"}}}', 'Italienne', '€€', 4.2);

-- =====================================================
-- INSERTION DES TABLES DE TEST
-- =====================================================
-- Tables pour Le Petit Bistrot (restaurant_id = 1)
INSERT INTO tables (restaurant_id, table_number, capacity) VALUES
(1, 'T1', 2),
(1, 'T2', 4),
(1, 'T3', 6),
(1, 'T4', 2),
(1, 'T5', 4);

-- Tables pour Sakura Sushi (restaurant_id = 2)
INSERT INTO tables (restaurant_id, table_number, capacity) VALUES
(2, 'S1', 2),
(2, 'S2', 4),
(2, 'S3', 8),
(2, 'S4', 2);

-- Tables pour Pizza Roma (restaurant_id = 3)
INSERT INTO tables (restaurant_id, table_number, capacity) VALUES
(3, 'P1', 2),
(3, 'P2', 4),
(3, 'P3', 6),
(3, 'P4', 8);

-- =====================================================
-- INSERTION DES PLATS DE TEST
-- =====================================================
-- Menu pour Le Petit Bistrot
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(1, 'Coq au Vin', 'Poulet mijoté dans du vin rouge avec des légumes', 24.50, 'Plat principal'),
(1, 'Bœuf Bourguignon', 'Bœuf braisé avec des carottes et des pommes de terre', 26.00, 'Plat principal'),
(1, 'Soupe à l\'Oignon', 'Soupe traditionnelle française gratinée', 12.00, 'Entrée'),
(1, 'Crème Brûlée', 'Crème vanille avec caramel croquant', 8.50, 'Dessert');

-- Menu pour Sakura Sushi
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(2, 'Sushi Saumon', '6 sushis au saumon frais', 18.00, 'Sushi'),
(2, 'Maki California', '8 makis au crabe et avocat', 16.50, 'Maki'),
(2, 'Sashimi Mix', 'Assortiment de sashimis frais', 22.00, 'Sashimi'),
(2, 'Ramen Tonkotsu', 'Soupe de nouilles au porc', 19.50, 'Plat principal');

-- Menu pour Pizza Roma
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(3, 'Pizza Margherita', 'Tomate, mozzarella, basilic', 14.00, 'Pizza'),
(3, 'Pizza Quattro Stagioni', 'Tomate, mozzarella, jambon, champignons, artichauts', 18.50, 'Pizza'),
(3, 'Pizza Diavola', 'Tomate, mozzarella, salami piquant', 17.00, 'Pizza'),
(3, 'Tiramisu', 'Dessert italien traditionnel', 7.50, 'Dessert');

-- =====================================================
-- INSERTION DES RÉSERVATIONS DE TEST
-- =====================================================
INSERT INTO reservations (user_id, restaurant_id, table_id, reservation_date, reservation_time, number_of_guests, status, special_requests) VALUES
(1, 1, 1, '2024-01-15', '19:30:00', 2, 'confirmed', 'Table près de la fenêtre si possible'),
(2, 2, 3, '2024-01-16', '20:00:00', 6, 'pending', 'Anniversaire, gâteau surprise'),
(3, 3, 2, '2024-01-17', '19:00:00', 4, 'confirmed', 'Allergie aux noix'),
(1, 1, 2, '2024-01-18', '12:30:00', 4, 'pending', NULL);

-- =====================================================
-- INSERTION DES PAIEMENTS DE TEST
-- =====================================================
INSERT INTO payments (reservation_id, amount, payment_method, status, stripe_payment_id) VALUES
(1, 49.00, 'card', 'completed', 'pi_test_123456789'),
(3, 68.00, 'online', 'completed', 'pi_test_987654321');
