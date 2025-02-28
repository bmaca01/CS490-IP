'''
Landing Page (4):
• 100%  As a user I want to view top 5 rented films of all times
• 100%  As a user I want to be able to click on any of the top 5 films and view its details
• 100%  As a user I want to be able to view top 5 actors that are part of films I have in the store
•   0%  As a user I want to be able to view the actor’s details and view their top 5 rented films
Films Page (3):
•  50%  As a user I want to be able to search a film by name of film, name of an actor, or genre of the film
•  50%  As a user I want to be able to view details of the film 
•   0%  As a user I want to be able to rent a film out to a customer
Customer Page (7):
• 100%  As a user I want to view a list of all customers (Pref. using pagination)
•  50%  As a user I want the ability to filter/search customers by their customer id, first name or last name.
•   0%  As a user I want to be able to add a new customer
•   0%  As a user I want to be able to edit a customer’s details
•   0%  As a user I want to be able to delete a customer if they no longer wish to patron at store
•   0%  As a user I want to be able to view customer details and see their past and present rental history
•   0%  As a user I want to be able to indicate that a customer has returned a rented movie
'''

from flask import Flask, jsonify, request, make_response
from flask_mysqldb import MySQL
from flask_cors import CORS
#from flask_restful import Resource, Api, reqparse

app = Flask(__name__)
app.config['MYSQL_USER'] = 'flask_app'
app.config['MYSQL_PASSWORD'] = 'abc'
app.config['MYSQL_DB'] = 'sakila'
app.config['MYSQL_HOST'] = '172.21.16.1'

mysql = MySQL(app)
cors = CORS(app, origins='*')

@app.route('/countries', methods=['GET'])
def countries():
    query = '''
    SELECT *
    FROM country
    '''
    cur = mysql.connection.cursor()
    cur.execute(query)
    row_headers = [x[0] for x in cur.description]
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()

    return jsonify({'countries': data_json})


@app.route('/customers', methods=['GET', 'POST'])
def customers():
    if request.method == 'GET':
        query = '''
        SELECT *
        FROM customer
        '''
        arg_list = []

        if len(request.args) != 0:
            query += ' WHERE '
        
            for k, v in request.args.items():
                arg_list.append(f"{k} = '{v}'")

            query += ' OR '.join(arg_list)

        cur = mysql.connection.cursor()
        cur.execute(query)
        row_headers = [x[0] for x in cur.description]
        data = cur.fetchall()
        data_json = []
        for d in data:
            data_json.append(dict(zip(row_headers, d)))
        cur.close()

        return jsonify({'customers': data_json})
    elif request.method == 'POST':
        data = request.json
        print('got a post')
        return jsonify({'request': data})

@app.route('/top-5-actors', methods=['GET'])
def get_top_actors():
    top_5 = '''
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

    cur = mysql.connection.cursor()
    cur.execute(top_5)

    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()

    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))

    cur.close()
    return jsonify({'top_5_actors': data_json})

@app.route('/top-5-films', methods=['GET'])
def get_top_films():
    top_5 = '''
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

    cur = mysql.connection.cursor()
    cur.execute(top_5)

    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()

    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))

    cur.close()
    return jsonify({'top_5_movies': data_json})

@app.route('/films', methods=['GET'])
def get_films():
    sql_query = '''
    SELECT * FROM film f 
     INNER JOIN film_category fc ON fc.film_id = f.film_id
     INNER JOIN category c ON c.category_id = fc.category_id
     INNER JOIN film_actor fa ON fa.film_id = f.film_id
     INNER JOIN actor a ON a.actor_id = fa.actor_id
    '''
    cur = mysql.connection.cursor()

    arg_list = []

    if len(request.args) != 0:
        sql_query += ' WHERE '
    
        for k, v in request.args.items():
            arg_list.append(f"{k} = '{v}'")

        sql_query += ' OR '.join(arg_list)

    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify(data_json)

@app.route('/films/<film_id>', methods=['GET', 'PUT'])
def get_film_details(film_id):
    if request.method == 'GET':
        sql_query = f"""
        SELECT * FROM film f 
        INNER JOIN film_category fc ON fc.film_id = f.film_id
        INNER JOIN category c ON c.category_id = fc.category_id
        WHERE f.film_id = {film_id}
        """ 
        cur = mysql.connection.cursor()

        cur.execute(sql_query)
        row_headers=[x[0] for x in cur.description] #this will extract row headers
        data = cur.fetchall()
        data_json = []
        for d in data:
            data_json.append(dict(zip(row_headers, d)))
        cur.close()
        return jsonify({'film': data_json})
    elif request.method == 'PUT':
        pass

@app.route('/actors/<actor_id>', methods=['GET'])
def get_actor_details(actor_id):
    sql_query = f"""
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
    cur = mysql.connection.cursor()

    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify({'actor': data_json})


"""
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('id', type=int)

class FilmsList(Resource):
    def get(self):
        try:

            cursor = mysql.connection.cursor()
            cursor.execute('''SELECT * FROM film''')

            row_headers = [x[0] for x in cursor.description]
            rows = cursor.fetchall()
            rows_json = []
            for r in rows:
                rows_json.append(dict(zip(row_headers, r)))

            cursor.close()
            return jsonify(rows_json)
        except Exception as e:
            print(e)

class Film(Resource):
    def get(self, film_id):
        try:

            cursor = mysql.connection.cursor()
            cursor.execute('''SELECT * FROM film WHERE film_id = %s''', film_id)
            row_headers = [x[0] for x in cursor.description]
            rows = cursor.fetchall()
            rows_json = []
            for r in rows:
                rows_json.append(dict(zip(row_headers, r)))
            cursor.close()
            return jsonify(rows_json)
        except Exception as e:
            print(e)

api.add_resource(FilmsList, '/films')
api.add_resource(Film, '/films/<film_id>')
"""

if __name__ == '__main__':
    app.run(debug=True)