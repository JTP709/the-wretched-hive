BEGIN TRANSACTION;

-- Insert two carts
INSERT INTO cart (userId, status, createdAt, updatedAt)
VALUES (1, 'ACTIVE', datetime('now'), datetime('now'));

INSERT INTO cart (userId, status, createdAt, updatedAt)
VALUES (2, 'ACTIVE', datetime('now'), datetime('now'));

-- Insert cart items for the first cart (assumed id = 1)
INSERT INTO cartItems (productId, quantity, cartId, createdAt, updatedAt)
VALUES (1, 2, 1, datetime('now'), datetime('now'));

INSERT INTO cartItems (productId, quantity, cartId, createdAt, updatedAt)
VALUES (2, 1, 1, datetime('now'), datetime('now'));

INSERT INTO cartItems (productId, quantity, cartId, createdAt, updatedAt)
VALUES (3, 3, 1, datetime('now'), datetime('now'));

-- Insert cart items for the second cart (assumed id = 2)
INSERT INTO cartItems (productId, quantity, cartId, createdAt, updatedAt)
VALUES (1, 1, 2, datetime('now'), datetime('now'));

INSERT INTO cartItems (productId, quantity, cartId, createdAt, updatedAt)
VALUES (2, 4, 2, datetime('now'), datetime('now'));

INSERT INTO cartItems (productId, quantity, cartId, createdAt, updatedAt)
VALUES (3, 2, 2, datetime('now'), datetime('now'));

INSERT INTO cartItems (productId, quantity, cartId, createdAt, updatedAt)
VALUES (4, 5, 2, datetime('now'), datetime('now'));

COMMIT;
