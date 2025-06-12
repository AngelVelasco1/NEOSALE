CREATE OR REPLACE PROCEDURE sp_createReview (p_rating INT, p_comment TEXT, p_userId INT, p_productId INT)
 LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO REVIEWS(rating, comment, userId, productId) VALUES (p_rating, p_comment, p_userId, p_productId);
    END;
    $$;


CREATE OR REPLACE PROCEDURE sp_updateReview (p_rating INT, p_comment TEXT, p_userId INT, p_productId INT)
 LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE REVIEWS SET rating = p_rating, comment = p_comment, userId = p_userId, productId = p_productId WHERE userId = p_userId;
    END;
    $$;

CREATE OR REPLACE PROCEDURE sp_deleteReview (p_id INT)
 LANGUAGE plpgsql
    AS $$
    BEGIN
        DELETE FROM REVIEWS WHERE id = p_id;
    END;
    $$;