CREATE OR REPLACE FUNCTION fn_create_cart()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO cart (user_id, created_at, subtotal) 
    VALUES (NEW.id, CURRENT_TIMESTAMP, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_create_cart_after_register
    AFTER INSERT ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION   
fn_create_cart();
     

CREATE OR REPLACE PROCEDURE sp_add_product_to_cart(p_user_id INT, p_product_id INT, p_quantity INT, p_color_code VARCHAR(7), p_size VARCHAR(25))
    LANGUAGE plpgsql
    AS $$
    DECLARE 
        v_cart_id INT;
    BEGIN
        SELECT id INTO v_cart_id FROM cart WHERE user_id = p_user_id;
        IF v_cart_id IS NULL THEN
            RAISE EXCEPTION 'El usuario no tiene carrito';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
            RAISE EXCEPTION 'El producto no existe';
        END IF;

        IF p_quantity <= 0 THEN 
            RAISE EXCEPTION 'La cantidad debe ser mayor a 0';
        END IF;

        IF EXISTS (SELECT 1 FROM cart_items WHERE cart_id = v_cart_id AND product_id = p_product_id AND color_code = p_color_code AND size = p_size) THEN
            UPDATE cart_items
            SET quantity = quantity + p_quantity
            WHERE cart_id = v_cart_id 
            AND product_id = p_product_id    
            AND COALESCE(color_code, '') = COALESCE(p_color_code, '')
            AND COALESCE(size, '') = COALESCE(p_size, '');       
        ELSE
            INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, size, color_code)
            VALUES (
                v_cart_id,
                p_product_id,
                p_quantity,
                (SELECT price FROM products WHERE id = p_product_id),
                p_size,
                p_color_code
            );
        END IF;
    END;
    $$;

CREATE OR REPLACE PROCEDURE sp_delete_product_from_cart(
    p_user_id INT, 
    p_product_id INT, 
    p_color_code VARCHAR(7), 
    p_size VARCHAR(25)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_cart_id INT;
BEGIN
    SELECT id INTO v_cart_id FROM cart WHERE user_id = p_user_id;
    IF v_cart_id IS NULL THEN
        RAISE EXCEPTION 'El usuario no tiene carrito';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM cart_items 
        WHERE cart_id = v_cart_id 
        AND product_id = p_product_id 
        AND color_code = p_color_code 
        AND size = p_size
    ) THEN
        RAISE EXCEPTION 'El producto con las especificaciones dadas no está en el carrito';
    END IF;

    DELETE FROM cart_items
    WHERE cart_id = v_cart_id
    AND product_id = p_product_id
    AND color_code = p_color_code
    AND size = p_size;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_update_cart_quantity(
    p_user_id INT, 
    p_product_id INT, 
    p_new_quantity INT,
    p_color_code VARCHAR(50),
    p_size VARCHAR(25)
)
LANGUAGE plpgsql
AS $$
DECLARE 
    v_cart_id INT;
    v_product_stock INT;
BEGIN
    IF p_new_quantity < 0 THEN
        RAISE EXCEPTION 'La cantidad no puede ser negativa';
    END IF;

    SELECT id INTO v_cart_id FROM cart WHERE user_id = p_user_id;
    IF v_cart_id IS NULL THEN
        RAISE EXCEPTION 'El usuario no tiene carrito';
    END IF;

    SELECT stock INTO v_product_stock FROM products WHERE id = p_product_id;
    IF p_new_quantity > v_product_stock THEN
        RAISE EXCEPTION 'Cantidad solicitada (%) excede el stock disponible (%)', p_new_quantity, v_product_stock;
    END IF;

        UPDATE cart_items
        SET quantity = p_new_quantity
        WHERE cart_id = v_cart_id 
        AND product_id = p_product_id 
        AND COALESCE(color_code, '') = COALESCE(p_color_code, '')
        AND COALESCE(size, '') = COALESCE(p_size, '');
END;
$$;

CREATE OR REPLACE FUNCTION fn_clear_cart(p_user_id INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_cart_id INT;
BEGIN
    SELECT id INTO v_cart_id FROM cart WHERE user_id = p_user_id;
    IF v_cart_id IS NULL THEN
        RAISE EXCEPTION 'El usuario no tiene carrito';
    END IF;

    DELETE FROM cart_items WHERE cart_id = v_cart_id;
END;
$$;