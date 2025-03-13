q_TOP_FIVE_ACTORS = '''
    SELECT a.actor_id, a.first_name, a.last_name, t1.actor_film_cnt
    FROM actor a
    INNER JOIN (
    	SELECT fa.actor_id, COUNT(f.film_id) actor_film_cnt
    	FROM film_actor fa
    	INNER JOIN film f ON f.film_id = fa.film_id
    	GROUP BY fa.actor_id
    ) AS t1 ON t1.actor_id = a.actor_id
    ORDER BY t1.actor_film_cnt DESC
    LIMIT 5
    '''

q_TOP_FIVE_FILMS = '''
    SELECT t2.film_id, t2.title, c.name category, t2.rented
    FROM (
     SELECT t1.film_id, t1.title, SUM(t1.cnt) rented
     FROM (
      SELECT f.film_id, f.title, COUNT(*) cnt
      FROM rental r
      INNER JOIN inventory i ON i.inventory_id = r.inventory_id
      INNER JOIN film f ON f.film_id = i.film_id
      GROUP BY r.inventory_id
     ) AS t1
     GROUP BY t1.film_id, t1.title
     ORDER BY rented DESC
     LIMIT 5
    ) AS t2
    INNER JOIN film_category fc ON fc.film_id = t2.film_id
    INNER JOIN category c ON c.category_id = fc.category_id
    '''

q_ALL_FILMS = '''SELECT * FROM film f 
     INNER JOIN film_category fc ON fc.film_id = f.film_id
     INNER JOIN category c ON c.category_id = fc.category_id
     INNER JOIN film_actor fa ON fa.film_id = f.film_id
     INNER JOIN actor a ON a.actor_id = fa.actor_id
    '''

q_ALL_CUSTOMER = ''\
'''
SELECT
    c.customer_id, c.store_id, c.first_name,
    c.last_name, c.email, t1.phone,
    t1.address, t1.address2, t1.city,
    t1.district, t1.postal_code, t1.country,
    c.create_date, c.last_update, c.active, t1.country_id
FROM customer c
LEFT JOIN (
    SELECT 
        a.address_id, a.phone, a.address,
        a.address2, a.district, ct.city,
        a.postal_code, co.country, co.country_id
    FROM address a
    LEFT JOIN city ct ON ct.city_id = a.city_id
    LEFT JOIN country co ON co.country_id = ct.country_id
) AS t1 ON t1.address_id = c.address_id
'''

q_ALL_CUSTOMER_NULL_RETURN = ''\
"""
SELECT
    c.customer_id, c.store_id, c.first_name,
    c.last_name, c.email, t1.phone,
    t1.address, t1.address2, t1.city,
    t1.district, t1.postal_code, t1.country,
    c.active, c.create_date, c.last_update
FROM customer c
LEFT JOIN (
    SELECT 
        a.address_id, a.phone, a.address,
        a.address2, a.district, ct.city,
        a.postal_code, co.country
    FROM address a
    LEFT JOIN city ct ON ct.city_id = a.city_id
    LEFT JOIN country co ON co.country_id = ct.country_id
) AS t1 ON t1.address_id = c.address_id
LEFT JOIN rental r ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL
"""

q_ALL_COUNTRIES = '''
    SELECT *
    FROM country
    '''

def q_customer_details(customer_id):
    return ''\
f'''
SELECT 
    t2.customer_id, t3.store_id,  
    t2.active, t3.rental_id, t3.rental_date,
    t3.return_date, t3.address, t3.city, 
    t3.district, t3.country, t3.inventory_id,
    t3.film_id, t3.title, t3.rental_duration, t3.last_update
FROM (
    SELECT
        c.customer_id, c.active, c.store_id, c.first_name,
        c.last_name, c.email, t1.phone, 
        t1.address, t1.address2, t1.city,
        t1.district, t1.postal_code, t1.country,
        c.create_date, c.last_update
    FROM customer c
    LEFT JOIN (
        SELECT 
            a.address_id, a.phone, a.address,
            a.address2, a.district, ct.city,
            a.postal_code, co.country
        FROM address a
        LEFT JOIN city ct ON ct.city_id = a.city_id
        LEFT JOIN country co ON co.country_id = ct.country_id
    ) AS t1 ON t1.address_id = c.address_id
) AS t2
LEFT JOIN (
    SELECT 
        r.customer_id, r.rental_id, r.rental_date, 
        r.return_date, r.last_update,
        s.store_id, a.address, a.district,
        ci.city, co.country,
        i.inventory_id, f.film_id, f.title, f.rental_duration
    FROM rental r
    LEFT JOIN inventory i ON i.inventory_id = r.inventory_id
    LEFT JOIN film f ON f.film_id = i.film_id
    LEFT JOIN store s ON s.store_id = i.store_id
    LEFT JOIN address a ON a.address_id = s.address_id
    LEFT JOIN city ci ON ci.city_id = a.city_id
    LEFT JOIN country co ON co.country_id = ci.country_id
) AS t3 ON t3.customer_id = t2.customer_id
WHERE t2.customer_id = {customer_id}
ORDER BY t3.rental_date DESC, t3.return_date 
'''

def q_film_details(film_id):
    """
    return ''\
    f'''
    SELECT
	f.film_id, f.title, f.release_year,
    c.name,
    fa.actor_id, a.first_name, a.last_name
    FROM film f
    LEFT JOIN film_actor fa ON fa.film_id = f.film_id
    LEFT JOIN actor a ON a.actor_id = fa.actor_id
    LEFT JOIN film_category fc ON fc.film_id = f.film_id
    LEFT JOIN category c ON c.category_id = fc.category_id
    WHERE f.film_id = {film_id}
    '''
    """
    return f"""
        SELECT * FROM film f 
        INNER JOIN film_category fc ON fc.film_id = f.film_id
        INNER JOIN category c ON c.category_id = fc.category_id
        WHERE f.film_id = {film_id}
        """ 

def q_actor_details(actor_id):
    return f"""
    SELECT f.film_id, f.title, t4.film_rental_cnt
    FROM film f
    INNER JOIN (
    	SELECT t2.film_id, t2.film_rental_cnt
    	FROM film_actor fa
    	INNER JOIN (
    		SELECT fa.actor_id, COUNT(f.film_id) actor_film_cnt
    		FROM film_actor fa
    		INNER JOIN film f ON f.film_id = fa.film_id
    		WHERE fa.actor_id = {actor_id}
            GROUP BY fa.actor_id
    		ORDER BY actor_film_cnt DESC
    	) AS t1 ON t1.actor_id = fa.actor_id
    	INNER JOIN (
    		SELECT i.film_id, SUM(t3.inventory_rental_cnt) film_rental_cnt
    		FROM inventory i
    		INNER JOIN (
    			SELECT r.inventory_id, COUNT(r.inventory_id) inventory_rental_cnt
    			FROM rental r
    			GROUP BY r.inventory_id
    		) AS t3 ON t3.inventory_id = i.inventory_id
    		GROUP BY i.film_id
    		ORDER BY film_rental_cnt DESC
    	) AS t2 ON fa.film_id = t2.film_id
    	ORDER BY t2.film_rental_cnt DESC
    ) AS t4 ON t4.film_id = f.film_id
    ORDER BY t4.film_rental_cnt DESC
    LIMIT 5
"""

def u_cust_details(cust_id, new_details: dict):
    """On customer update, possible fields updated:
    first_name      :   customer
    last_name       :   customer
    email           :   customer
    phone           :   address
    address         :   address
    address2        :   address
    city            :   city
    district        :   address
    postal_code     :   address
    country_id      :   country
    active          :   customer

    keys needed: customer_id, address_id, city_id, country_id

    c.address_id <-> a.address_id, a.city_id <<=> ci.city, ci.country_id <<=> co.country_id

    city may or may not exist on update ;
    --> first check if exists in `city`;
    if exist:
        -- update the associated customer's address record's city_id field
    if not exist:
        -- insert new city with associated country
        -- update the associated customer's address record's city_id field
        -- with the newly inserted city
    """
    return f'''
BEGIN;




UPDATE customer c
INNER JOIN address a ON a.address_id = c.address_id
INNER JOIN city ci ON ci.city_id = a.city_id
INNER JOIN country co ON co.country_id = ci.country_id
SET
    c.first_name = {new_details['fname']},
    c.last_name  = {new_details['lname']},
    c.email      =   {new_details['email']},
    a.phone      =   {new_details['phone']},
    a.address    =   {new_details['addr1']},
    a.address2   =   {new_details['addr2']},
    c.city       =   {new_details['city']},
    c.district   =   {new_details['district']},
    c.postal_code=   {new_details['zip']},
    c.country_id =   {new_details['country']},
    c.active     =   {new_details['active']},
WHERE customer_id = {cust_id}

COMMIT;
'''
