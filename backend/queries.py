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

q_ALL_FILMS = '''
SELECT * FROM film f 
    INNER JOIN film_category fc ON fc.film_id = f.film_id
    INNER JOIN category c ON c.category_id = fc.category_id
'''

'''
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

def q_film_actors(film_id):
    return f"""
SELECT
    a.actor_id, f.film_id, a.first_name, a.last_name, f.title
FROM film_actor fa
LEFT JOIN actor a ON a.actor_id = fa.actor_id
LEFT JOIN film f ON f.film_id = fa.film_id
WHERE f.film_id = {film_id}
ORDER BY a.actor_id ASC, f.film_id ASC
    """

def q_film_inventory(film_id):
    return f"""
SELECT i.store_id, i.film_id, COUNT(i.inventory_id) AS inventory_count
FROM inventory i
WHERE i.store_id = 1 AND i.film_id = {film_id}
GROUP BY i.film_id
    """

def q_film_language(film_id):
    return f"""
SELECT l.language_id, l.name
FROM film f
INNER JOIN language l ON l.language_id = f.language_id
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

def a_new_city(new_details: dict):
    return f'''INSERT IGNORE INTO city(city, country_id) VALUES ("{new_details['city']}", {new_details['country']})'''


def a_new_addr(new_details: dict, city_id):
    '''address, address2, district, city_id, postal_code, phone, location'''
    addr2 = 'NULL' if new_details['addr2'] == '' else "'" + str(new_details['addr2']) + "'"
    zip = 'NULL' if new_details['zip'] == '' else "'" + str(new_details['zip']) + "'"
    return f'''
    INSERT IGNORE INTO address(address, address2, district, city_id, postal_code, phone, location)
    VALUES (
        '{new_details['addr1']}',
        {addr2},
        '{new_details['district']}',
        {city_id},
        {zip},
        '{new_details['phone']}',
        ST_GeomFromText('POINT(1 1)')
    )
    '''


def a_new_cust(new_details: dict, addr_id):
    '''store_id, first_name, last_name, email, address_id, active'''
    return f'''
    INSERT INTO customer(store_id, first_name, last_name, email, address_id, active)
    VALUES (
        1,
        '{new_details['fname']}',
        '{new_details['lname']}',
        '{new_details['email']}',
        '{addr_id}',
        1
    )
    '''

def a_new_rental(fields):
    return f'''
INSERT INTO rental(rental_date, inventory_id, customer_id, staff_id)
VALUES (
    CURRENT_DATE(),
    {fields['inventory_id']},
    {fields['cid']},
    1
)
'''

def get_city_id_from_fields(fields):
    return f'''
SELECT c.city_id
FROM city c
WHERE
    c.city = '{fields['city']}' AND
    c.country_id = {fields['country']}
'''

def get_addr_id_from_fields(fields, city_id):
    return f'''
SELECT a.address_id
FROM address a
WHERE
    a.address = '{fields['addr1']}' AND
    a.district = '{fields['district']}' AND
    a.city_id = {city_id} AND
    a.phone = '{fields['phone']}'
'''

def update_rental(fields, cust_id):
    return f'''
UPDATE rental r
SET
    rental_date = CURRENT_DATE()
WHERE r.customer_id = {cust_id} AND r.rental_id = {fields['r_id']}
'''

def update_city(fields, city_id):
    return f'''
UPDATE city c
SET
    c.country_id = {fields['country']}
WHERE c.city_id = {city_id}
'''

def update_addr(fields, addr_id, city_id):
    addr2 = 'NULL' if fields['addr2'] == '' else "'" + str(fields['addr2']) + "'"
    zip = 'NULL' if fields['zip'] == '' else "'" + str(fields['zip']) + "'"
    return f'''
UPDATE address a
INNER JOIN city ci ON ci.city_id = a.city_id
SET
    a.address       = '{fields['addr1']}',
    a.address2      = {addr2},
    a.phone         = '{fields['phone']}',
    a.city_id       = {city_id},
    a.district      = '{fields['district']}',
    a.postal_code   = {zip},
    ci.country_id   = {fields['country']}
WHERE a.address_id = {addr_id}
'''
    

def update_cust_details(cust_id, new_details: dict, addr_id):
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
UPDATE customer c
SET
    c.first_name        =   "{new_details['fname']}",
    c.last_name         =   "{new_details['lname']}",
    c.email             =   "{new_details['email']}",
    c.address_id        =   {addr_id},
    c.active            =   {new_details['active']}
WHERE c.customer_id = {cust_id}
'''

def d_duplicate_addr():
    return f'''
DELETE a FROM address a
INNER JOIN address b
WHERE
	a.address_id > b.address_id AND
    a.address = b.address AND
    a.address2 <=> b.address2 AND
    a.district = b.district AND
    a.city_id = b.city_id AND
    a.postal_code <=> b.postal_code AND
    a.phone = b.phone AND
    a.location = b.location;
'''
def d_cust(cust_id):
    return f'''DELETE FROM customer c WHERE c.customer_id = {cust_id}'''


def q_film_availability(film_id):
    return f'''
SELECT t1.film_id, t1.inventory_id, r.return_date, r.customer_id
FROM (
	SELECT i.film_id, i.inventory_id, MAX(r.rental_id) AS latest
	FROM inventory i
	INNER JOIN rental r ON r.inventory_id = i.inventory_id
	WHERE i.film_id = {film_id} AND i.store_id = 1
	GROUP BY i.film_id, i.inventory_id
	ORDER BY i.inventory_id
) AS t1
INNER JOIN rental r ON r.rental_id = t1.latest
;
'''